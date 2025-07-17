const amqp = require("amqplib");


const receiveMessage = async () => {
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchange = "notification_exchange";
        const queue= "order_queue";
        const exchangeType = "topic";

        await channel.assertExchange(exchange,exchangeType,{durable:true});
        await channel.assertQueue(queue,{durable:true});

        await channel.bindQueue(queue,exchange,"order.*");

        console.log("Waiting for messages...");
        channel.consume(queue , (message) =>{
                if(message !== null){
                    console.log("Received message:",message.content.toString());
                    channel.ack(message);
                }
            },
            {noAck:false}
        );
    } catch(error){
        console.log(error);
    }
};

receiveMessage();