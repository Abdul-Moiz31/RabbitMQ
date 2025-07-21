const amqp = require('amqplib');

// This is how we connect the amqp server
const  announceNewProduct =  async (product) => {
 try{
    const connection = await amqp.connect("amqp://localhost")  
    const channel = await connection.createChannel();
    const exchange ="new_product_launch";
    const exchangeType ="fanout";

    await channel.assertExchange(exchange,exchangeType,{durable:true});

    const queue = await channel.assertQueue("",{exclusive:true});
    console.log("Queue created:", queue);


    await channel.bindQueue(queue.queue, exchange, "");

    const message = JSON.stringify(product);

    channel.publish(exchange," ",Buffer.from(message) , {persistent:true});
    
    console.log("Message sent to exchange:", message);

    channel.consume(queue.queue, (msg) => {
        if (msg !== null) {
            const product = JSON.parse(msg.content.toString());
            console.log("Sending SMs Notification for product:", product.name);
            channel.ack(msg);
        }
    });

 } catch(error){
    console.log(error)
 }
};

announceNewProduct({
    id:123,
    name:"John Doe",
    price:100
});