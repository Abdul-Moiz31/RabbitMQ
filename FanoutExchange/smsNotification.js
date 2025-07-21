const amqp = require('amqplib');

// Function to connect to RabbitMQ, send, and receive SMS notifications for new products
const announceNewProduct = async (product) => {
  try {
    // Establish connection to RabbitMQ server
    const connection = await amqp.connect("amqp://localhost");
    // Create a channel for communication
    const channel = await connection.createChannel();
    const exchange = "new_product_launch";
    const exchangeType = "fanout";

    // Assert (create if not exists) a fanout exchange
    await channel.assertExchange(exchange, exchangeType, { durable: true });

    // Create a temporary, exclusive queue for this consumer
    const queue = await channel.assertQueue("", { exclusive: true });
    console.log("Queue created:", queue);

    // Bind the queue to the fanout exchange (routing key is ignored)
    await channel.bindQueue(queue.queue, exchange, "");

    // Prepare the product message
    const message = JSON.stringify(product);

    // Publish the message to the fanout exchange
    channel.publish(exchange, " ", Buffer.from(message), { persistent: true });
    console.log("Message sent to exchange:", message);

    // Consume messages from the queue
    channel.consume(queue.queue, (msg) => {
      if (msg !== null) {
        const product = JSON.parse(msg.content.toString());
        console.log("Sending SMS Notification for product:", product.name);
        channel.ack(msg); // Acknowledge message
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// Start the process for new product launch SMS notification
announceNewProduct({
  id: 123,
  name: "John Doe",
  price: 100
});