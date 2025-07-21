const amqp = require('amqplib');

// Function to connect to RabbitMQ and send notifications with headers
const sendNotification = async (headers, message) => {
  try {
    // Establish connection to RabbitMQ server
    const connection = await amqp.connect("amqp://localhost");
    // Create a channel for communication
    const channel = await connection.createChannel();
    const exchange = "header_exchange";
    const exchangeType = "headers";

    // Assert (create if not exists) a headers exchange
    await channel.assertExchange(exchange, exchangeType, { durable: true });

    // Publish the message to the headers exchange with custom headers
    channel.publish(exchange, " ", Buffer.from(message), { persistent: true, headers });
    console.log("Sent Notification with headers:", headers);

    // Close the connection after a short delay to ensure message is sent
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.log(error);
  }
};

// Send different types of notifications with various headers
sendNotification({ "x-match": "all", "notification_type": "new-video", "content_type": "video" }, "New video uploaded");
sendNotification({ "x-match": "all", "notification_type": "live-stream", "content_type": "gaming" }, "Gaming Live Stream Started");
sendNotification({ "x-match": "any", "notification_type-comment": "comment", "content_type": "video" }, "New Comment on the video");
sendNotification({ "x-match": "any", "notification_type-Like": "Like", "content_type": "video" }, "New Like on the video");  

