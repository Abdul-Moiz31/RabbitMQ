const amqp = require('amqplib');

// Function to connect to RabbitMQ and consume comment or like notifications
const consumeCmntLikeNotification = async () => {
  try {
    // Establish connection to RabbitMQ server
    const connection = await amqp.connect("amqp://localhost");
    // Create a channel for communication
    const channel = await connection.createChannel();
    const exchange = "header_exchange";
    const exchangeType = "headers";

    // Assert (create if not exists) a headers exchange
    await channel.assertExchange(exchange, exchangeType, { durable: true });

    // Create a temporary, exclusive queue for this consumer
    const queue = await channel.assertQueue("", { exclusive: true });
    console.log("Waiting for message:", queue);

    // Bind the queue to the exchange with headers for comment or like notifications (x-match: any)
    await channel.bindQueue(queue.queue, exchange, "", {
      "x-match": "any",
      "notification_type-comment": "comment",
      "notification_type-Like": "Like"
    });

    // Consume messages from the queue
    channel.consume(queue.queue, (msg) => {
      if (msg !== null) {
        const message = msg.content.toString();
        console.log("Received comment or like notification:", message);
        channel.ack(msg); // Acknowledge the message
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// Start listening for comment or like notifications
consumeCmntLikeNotification();


