
function setActiveTabFromURL() {
    const params = new URLSearchParams(window.location.search);
    const activeTab = params.get('activeTab'); // Get 'activeTab' parameter from URL

    if (activeTab) {
        changeTab(activeTab, null);
    } else {
        // Default to 'dashboard' if no other tab is specified
        changeTab('dashboard', null);
    }
}

function scanQRCode() {
    alert("QR code scanning is not implemented yet.");
}

function showForm(tab) {
    document.getElementById(`${tab}-form`).style.display = 'block';
}

function logout() {
    const activeTab = document.querySelector('.sidebar a.active').getAttribute('href').slice(1);
    localStorage.setItem('activeTab', activeTab);

}




function setupTabClickHandlers() {
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor behavior
            const tabId = this.getAttribute('href').substring(1); // Extract the tab ID
            setActiveTab(tabId); // Set the clicked tab as active
        });
    });
}

// Handles setting the active tab, storing it, and showing the content//
function setActiveTab(tabId) {
    showTab(tabId); // Show the tab content
    localStorage.setItem('activeTab', tabId); // Save the active tab to localStorage
}
function updateTabDisplay(tabId) {
    let tabs = document.getElementsByClassName('tabContent');
    let sidebarLinks = document.querySelectorAll('.sidebar a');

    // Hide all tabs and remove 'active' class from sidebar links
    Array.from(tabs).forEach(tab => tab.style.display = 'none');
    Array.from(sidebarLinks).forEach(link => link.classList.remove('active'));

    // Show the active tab content and add 'active' class to the sidebar link
    document.getElementById(tabId).style.display = 'block';
    document.querySelector(`.sidebar a[href='#${tabId}']`).classList.add('active');
}


// Event handler for DOMContentLoaded to show the active or default tab
document.addEventListener("DOMContentLoaded", () => {
    setupTabClickHandlers(); // Setup the click handlers for the sidebar

    // Check if it's a fresh login, if so, set 'dashboard' as the active tab
    const freshLogin = sessionStorage.getItem('freshLogin'); // You should set this during login
    const activeTab = freshLogin ? 'dashboard' : localStorage.getItem('activeTab') || 'dashboard';

    setActiveTab(activeTab); // Set the active tab

    // If it was a fresh login, clear the freshLogin flag for subsequent page loads
    if (freshLogin) {
        sessionStorage.removeItem('freshLogin');
    }

});
// The loadFacilitators and loadStudents functions need to be defined or kept if they already are.

function updateSidebarAndStorage(tabId) {
    let sidebarLinks = document.querySelectorAll('.sidebar a');
    for (let link of sidebarLinks) {
        if(link.getAttribute('href') === `#${tabId}`) {
            link.classList.add('active');
            console.log(`Sidebar link for ${tabId} should now be active.`);
        } else {
            link.classList.remove('active');
        }
    }

    localStorage.setItem('activeTab', tabId);

    // Make sure the data loading functions are called only once
    if (tabId === 'facilitator') {
        loadFacilitators();
    } else if (tabId === 'student') {
        loadStudents();
    }
}

function changeTab(tabId, event) {
    var i, tabContent, tabLinks;
    tabContent = document.getElementsByClassName("tabContent");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }
    tabLinks = document.querySelectorAll('.sidebar a');
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }
    document.getElementById(tabId).style.display = "block";
    
    // Update local storage with the currently active tab
    localStorage.setItem('activeTab', tabId);

    if (event) {
        event.currentTarget.classList.add("active");
    } else {
        let activeLink = document.querySelector(`.sidebar a[onclick*="${tabId}"]`);
        if (activeLink) {
            activeLink.classList.add("active");
        }
    }
}

function showTab(tabId) {
    // Hide all tab content and remove 'active' class from sidebar links
    const tabs = document.querySelectorAll('.tabContent');
    tabs.forEach(tab => tab.style.display = 'none');
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    sidebarLinks.forEach(link => link.classList.remove('active'));

    // Show the active tab content and add 'active' class to the corresponding sidebar link
    const tabContent = document.getElementById(tabId);
    const tabLink = document.querySelector(`.sidebar a[href='#${tabId}']`);
    if (tabContent && tabLink) {
        tabContent.style.display = 'block';
        tabLink.classList.add('active');
    }

    // Load the data for the active tab
    if (tabId === 'facilitator') {
        loadFacilitators();
    } else if (tabId === 'student') {
        loadStudents();
    }
    if (tabId === 'edit-account') {
        loadAccountData();
    }
}

function setupTabClickHandlers() {
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor behavior
            const tabId = this.getAttribute('href').substring(1); // Extract the tab ID
            setActiveTab(tabId); // Set the clicked tab as active
        });
    });
}

function setDashboardAsActiveTab() {
    setActiveTab('dashboard'); // Set dashboard as the active tab
    localStorage.setItem('activeTab', 'dashboard'); // Save 'dashboard' as the active tab to localStorage
}



//service worker//

//end service worker//




