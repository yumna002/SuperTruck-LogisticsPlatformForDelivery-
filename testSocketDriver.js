const { io } = require("socket.io-client");



const socket = io('https://grad-supertruck-back.8byteslab.com/drivers',{
  auth :{
    driverId:'1'
  }
});


socket.on('connect', () => {
  console.log('Connected as driver 1');
  // socket.emit('driverLocation',{
  //   driverId:1,
  //   lat:11.2,
  //   lng:33.2,
  //   orderId:1,
  //   customerId:1
  // })

  socket.emit('generalDriverLocation',{
    driverId:1,
    lat:33.55,
    lng:36.311,
    orderId:1,
    customerId:1
  })

  //Listen for the order request
  socket.on('order-request', (data) => {
    console.log('✅ Received order request:', data);
    console.log("data=",data);

    //Send response
    socket.emit('order-response', {
     orderId: data.orderId,
     accepted: false
    });
  });

  socket.on('cancel-order-request',(data)=>{
    console.log('order cancelled')
  })

  socket.on('final-price',(data=>{
    console.log('finalPrice',data)
  }))

});
