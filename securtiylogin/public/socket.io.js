const socket = io();  // Connect to the server

  socket.on('connect', function() {
    console.log('Connected to server');
  });

  socket.on('rfidScanned', function(uid) {
    console.log('RFID Scanned with UID:', uid);
    document.getElementById('facilitator-form').style.display = 'block';
  });