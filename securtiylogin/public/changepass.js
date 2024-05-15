document.addEventListener('DOMContentLoaded', () => {
    // Logic here to check if the active tab should be 'edit-account'
    const urlParams = new URLSearchParams(window.location.search);
    const activeTab = urlParams.get('activeTab');
    if (activeTab === 'edit-account') {
        showEditAccountForm();
    }
});

//end edit form//

function loadAccountData() {
    // Fetch the account data from the server
    fetch('/account-data')
    .then(response => response.json())
    .then(data => {
        document.getElementById('account-name').value = data.name;
        document.getElementById('account-email').value = data.email;
        document.getElementById('account-email').value = data.password;
    })
    .catch(error => {
        console.error('Failed to load account data:', error);
        alert('Failed to load account data. Please try again later.');
    });
}

function showEditAccountForm() {
    // Assuming there's a server-side endpoint to get current user data at '/account-data'
    fetch('/account-data', {
        credentials: 'include' // This might be needed to include session cookies
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch account data');
        }
        return response.json();
    })
    .then(userData => {
        document.getElementById('account-name').value = userData.name;
        // Don't pre-fill the password for security reasons
    })
    .catch(error => {
        console.error('Error fetching account data:', error);
        alert('Failed to load account data. Please try again later.');
    });
}

function submitAccountChanges() {
    const name = document.getElementById('account-name').value;
    const password = document.getElementById('account-password').value;

    // Validate input, ensure the name and password fields are not empty
    if (!name || !password) {
        alert('Both name and password are required');
        return;
    }

    fetch('/update-account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, password }),
        credentials: 'include' // To include session cookies
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update account');
        }
        alert('Account updated successfully');
        // Redirect to dashboard or refresh the page
        window.location.href = '/dashboard';
    })
    .catch(error => {
        console.error('Error updating account data:', error);
        alert(error.message);
    });
}

function loadAccountData() {
    fetch('/account-data')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('account-name').value = data.name;
        // Don't actually populate the password field, especially if it's hashed
    })
    .catch(error => {
        console.error('Failed to load account data:', error);
        alert('Failed to load account data. Please try again later.');
    });
}

function verifyPassword(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    const password = document.getElementById('verify-password').value;
    
    fetch('/verify-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Include the session cookie
        body: JSON.stringify({ password: password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show an alert similar to the failure message, but indicating success
            alert('Password verified successfully.');  // Alert for correct password
            
            // Hide verification form and show edit form
            document.getElementById('password-verification-form').style.display = 'none';
            document.getElementById('edit-account-form').style.display = 'block';
            
            // Optionally, pre-load account data
            loadAccountData();
        } else {
            // Show alert for incorrect password
            alert('Password verification failed. Please try again.');
            // Clear the password field
            document.getElementById('verify-password').value = '';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Show a generic error alert
        alert('An error occurred during password verification. Please try again later.');
    });
}

function cancelEdit() {
    // Hide the edit account form
    document.getElementById('edit-account-form').style.display = 'none';

    // Optionally, clear form fields
    document.getElementById('account-name').value = '';
    document.getElementById('account-password').value = '';

    // If you need to navigate the user away after canceling, uncomment the next line
    window.location.href = '/dashboard';
}
//edn of edit acc//