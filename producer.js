const amqp = require('amqplib');

// This is how we connect the amqp server
async function sendMail(){
 try{
    const connection = await amqp.connect("amqp://localhost")  
    const channel = await connection.createChannel();
    const exchange ="mail_exchange";
    const routingKey ="send_mail";


    const message = {
        to: "Test@gmail.com",
        subject: "This is the Test email",
        body: "This is the body of the email",
        from: "Pass@gmail.com"
    }

    await channel.assertExchange(exchange,"direct",{durable:false});

    await channel.assertQueue("mail_queue",{durable:false});

    await channel.bindQueue("mail_queue",exchange,routingKey);

    channel.publish(exchange,routingKey,Buffer.from(JSON.stringify(message)));

    console.log("Message sent to the queue");

    setTimeout(()=>{
        connection.close();
    },500)

 } catch(error){
    console.log(error)
 }
}

sendMail();