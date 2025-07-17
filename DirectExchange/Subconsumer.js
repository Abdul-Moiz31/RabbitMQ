const amqp = require("amqplib");


async function receiveMail(){
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();


        await channel.assertQueue("mail_queue_subscriber",{durable:false});

        channel.consume("mail_queue_subscriber",(message)=>{
            if(message !== null){
                console.log("Received message for subscriber",JSON.parse(message.content));
                channel.ack(message); // Acknowledge the message
            }
        });
    } catch(error){
        console.log(error);
    }
}

receiveMail();