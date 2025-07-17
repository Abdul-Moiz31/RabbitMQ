const amqp = require('amqplib');

// This is how we connect the amqp server
async function sendMessage(routingKey , message){
 try{
    const connection = await amqp.connect("amqp://localhost")  
    const channel = await connection.createChannel();
    const exchange ="notification_exchange";
    const exchangeType ="topic";

    await channel.assertExchange(exchange,exchangeType,{durable:true});

    channel.publish(exchange,routingKey,Buffer.from(JSON.stringify(message)) , {persistent:true});
    console.log(" [x] sent '%s' : '%s'", routingKey , JSON.stringify(message));
    console.log(`Message sent to the queue with routing key ${routingKey} and message ${JSON.stringify(message)}`);
    

   
    await channel.assertQueue("mail_queue_subscriber",{durable:false});
    await channel.assertQueue("mail_queue_user",{durable:false});

    console.log("Message sent to the queue");

    setTimeout(()=>{
        connection.close();
    },500)

 } catch(error){
    console.log(error)
 }
};

sendMessage("order.placed" , {
    orderId:123,
    customerName:"John Doe",
    productName:"Product 1",
    quantity:1,
    price:100
});
sendMessage("payment.success" , {
    orderId:1234,
    customerName:"Tom",
    productName:"Product 1",
    quantity:1,
    price:200
});