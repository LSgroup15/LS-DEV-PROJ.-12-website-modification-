let deferredPrompt;
const installButton = document.getElementById('installButton');

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to show the install button
  installButton.style.display = 'block';

  installButton.addEventListener('click', (e) => {
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  });
});

// Hide the install button on appinstalled event
window.addEventListener('appinstalled', (evt) => {
  installButton.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', function () {
    const name = 'Guest'; // This should be dynamically set based on user data from a server
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Hello ${name}! Welcome to the Dashboard.`;
    }

    // Event listeners for sidebar navigation, QR code scanning, and other interactions
    // function definitions for changeTab, scanQRCode, operateGSMModule, etc.
});

// Example function to change tabs
function changeTab(tabName, event) {
    event.preventDefault();
    const tabs = document.querySelectorAll('.tabContent');
    tabs.forEach(tab => {
        if (tab.id === tabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    });
}


// Additional JavaScript code for managing facilitators, students, visitors, and account updates
window.addEventListener('beforeunload', function(event) {
    navigator.sendBeacon('/logout');
});

