const { io } = require("socket.io-client");



//Change the URL if your server is running elsewhere
const socket = io('http://localhost:8080/customers', {
  auth : {
    customerId: '1' //Replace with a real or test customer ID
  },
  transports: ['websocket'],
});


socket.on('connect', () => {
  console.log('Customer connected with ID:', socket.id);
});

socket.on('order-status-update', (data) => {
  console.log('Received order status update:', data);
});

socket.on('orderStateUpdate', (data) => {
  console.log('🔁 Processing order state update received:', data);
});

socket.on('updateDriverLocation',(data)=>{
  console.log('new driver lacation',data)
})

socket.on('orderClosed',(data)=>{
  console.log('order closed',data)
})

socket.on('disconnect', () => {
  console.log('Customer disconnected');
});

socket.on('final-price',(data=>{
    console.log('finalPrice',data)
  }))
