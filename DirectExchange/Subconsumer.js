const amqp = require("amqplib");

// Function to connect to RabbitMQ and receive messages for the subscriber
async function receiveMail() {
    try {
        // Establish connection to RabbitMQ server
        const connection = await amqp.connect("amqp://localhost");
        // Create a channel for communication
        const channel = await connection.createChannel();

        // Assert (create if not exists) the subscriber queue
        await channel.assertQueue("mail_queue_subscriber", { durable: false });

        // Consume messages from the subscriber queue
        channel.consume("mail_queue_subscriber", (message) => {
            if (message !== null) {
                console.log("Received message for subscriber", JSON.parse(message.content));
                channel.ack(message); // Acknowledge the message
            }
        });
    } catch (error) {
        console.log(error);
    }
}

// Start listening for messages for the subscriber
receiveMail();