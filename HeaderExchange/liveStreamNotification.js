const amqp = require('amqplib');

// Function to connect to RabbitMQ and consume live stream notifications
const consumeLiveStreamNotification = async () => {
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

    // Bind the queue to the exchange with headers for live stream notifications (x-match: all)
    await channel.bindQueue(queue.queue, exchange, "", {
      "x-match": "all",
      "notification_type": "live-stream",
      "content_type": "gaming"
    });

    // Consume messages from the queue
    channel.consume(queue.queue, (msg) => {
      if (msg !== null) {
        const message = msg.content.toString();
        console.log("Received live stream notification:", message);
        channel.ack(msg); // Acknowledge the message
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// Start listening for live stream notifications
consumeLiveStreamNotification();


