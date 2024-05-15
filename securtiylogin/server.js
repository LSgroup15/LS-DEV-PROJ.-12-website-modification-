if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const mysql = require('mysql2/promise');

const initializePassport = require("./passport-config");

const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

initializePassport(
    passport,
    async email => {
        const [users] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
        return users[0];
    },
    async id => {
        const [users] = await db.query('SELECT * FROM user WHERE id = ?', [id]);
        return users[0];
    }
);


app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 300000 // 5 minutes, for example
    }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));


const getUserData = async (userId) => {
    try {
        const [rows] = await db.query('SELECT * FROM user WHERE id = ?', [userId]);
        return rows.length ? rows[0] : null;
    } catch (error) {
        throw error;
    }
};

app.post("/register", checkNotAuthenticated, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Server-side validation checks
        if (!name || !email || !password) {
            req.flash('error_msg', 'All fields are required');
            return res.redirect('/register');
        }
        if (password.length < 8) {
            req.flash('error_msg', 'Password must be at least 8 characters long');
            return res.redirect('/register');
        }

        // Check if the email is already registered
        const [users] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
        if (users.length > 0) {
            req.flash('error_msg', 'Email is already registered');
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO user (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect("/login");
    } catch (e) {
        console.error('Failed to register:', e);
        req.flash('error_msg', 'Failed to register. Error: ' + e.message);
        res.redirect("/register");
    }
});



app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true
}));

app.get('/dashboard', checkAuthenticated, (req, res) => {
    // Ensure that the user object exists and has a name property
    if (req.user && req.user.name) {
        res.render('index', { name: req.user.name });
    } else {
        // Handle cases where req.user is not set or doesn't have a name
        res.render('index', { name: 'Guest' });
    }
});




app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render("login.ejs");
});

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render("register.ejs");
});

app.delete("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/login");
    });
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/dashboard");
    }
    next();
}

app.post("/facilitator", checkAuthenticated, async (req, res) => {
    const { name, department, plate_number, validation, cp_number } = req.body;

    try {
        await db.query('INSERT INTO facilitators (name, department, plate_number, validation, cp_number) VALUES (?, ?, ?, ?, ?)', [
            name, department, plate_number, validation, cp_number
        ]);
        res.json({ success: true, message: 'Facilitator added successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error adding facilitator', error: error.message });
    }
});


app.get("/facilitator", checkAuthenticated, async (req, res) => {
    try {
        const [facilitators] = await db.query('SELECT * FROM facilitators');    
        res.status(200).json(facilitators);
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Error fetching facilitators' });
    }
});

app.post("/student", checkAuthenticated, async (req, res) => {
    try {
        console.log(req.body); // Log the body to check what data is being sent to this route
        const { name, department, year_section, plate_number, validation, cp_number } = req.body;
        
        // Make sure the names here match exactly with the names you've logged on the client side
        await db.query('INSERT INTO students (name, department, year_section, plate_number, validation, cp_number) VALUES (?, ?, ?, ?, ?, ?)', [
            name, department, year_section, plate_number, validation, cp_number
        ]);
        res.status(201).send({ message: 'Student added successfully' });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Error adding student', error: e.message });
    }
});


app.get("/student", checkAuthenticated, async (req, res) => {
    try {
        const [students] = await db.query('SELECT * FROM students');    
        res.status(200).json(students);
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Error fetching students' });
    }
});

const getAccountDataFromDB = async (userId) => {
    // Simulate database call
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId) {
                resolve({
                    id: userId,
                    name: '',
                    email: '',
                    // Do not send back the password, even if it's hashed.
                });
            } else {
                reject('User ID is required');
            }
        }, 1000);
    });
};


//edit account//
app.post('/update-account', checkAuthenticated, async (req, res) => {
    const { name, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('UPDATE user SET name = ?, password = ? WHERE id = ?', [name, hashedPassword, req.user.id]);

        // Depending on your setup, you may want to return JSON or redirect
        res.json({ message: 'Account updated successfully' });
    } catch (error) {
        console.error('Failed to update account:', error);
        res.status(500).json({ message: 'Failed to update account' });
    }
});

app.get('/account-data', checkAuthenticated, async (req, res) => {
    try {
        const [results] = await db.query('SELECT name, password FROM user WHERE id = ?', [req.user.id]);
        if (results.length > 0) {
            const { name, password } = results[0];
            res.json({ name, password });  // Do NOT send the password in real applications
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching account data:', error);
        res.status(500).json({ message: 'Failed to load account data. Please try again later.' });
    }
});

app.post('/verify-password', checkAuthenticated, async (req, res) => {
    console.log('Verify password endpoint hit'); // First log
    try {
        const { password } = req.body;
        const match = await bcrypt.compare(password, req.user.password);

        if (match) {
            console.log('Password is correct'); // Second log
            res.json({ success: true });
        } else {
            console.log('Password is incorrect'); // Third log
            res.json({ success: false });
        }
    } catch (error) {
        console.error('Password verification error:', error);
        res.status(500).json({ message: 'Password verification failed.' });
    }
});



// end of edit acc//

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});


app.set('view cache', false);

app.delete('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});


// Endpoint to register a new student via RFID



  
app.listen(3000);
