const amqp = require("amqplib");

// Function to connect to RabbitMQ and receive messages for the user
async function receiveMail() {
    try {
        // Establish connection to RabbitMQ server
        const connection = await amqp.connect("amqp://localhost");
        // Create a channel for communication
        const channel = await connection.createChannel();

        // Assert (create if not exists) the user queue
        await channel.assertQueue("mail_queue_user", { durable: false });

        // Consume messages from the user queue
        channel.consume("mail_queue_user", (message) => {
            if (message !== null) {
                console.log("Received message for user", JSON.parse(message.content));
                channel.ack(message); // Acknowledge the message
            }
        });
    } catch (error) {
        console.log(error);
    }
}

// Start listening for messages for the user
receiveMail();