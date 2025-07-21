const amqp = require('amqplib');

// Function to connect to RabbitMQ and listen for new product launch notifications
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
    console.log("Waiting for message:", queue);

    // Bind the queue to the fanout exchange (routing key is ignored)
    await channel.bindQueue(queue.queue, exchange, "");

    // Consume messages from the queue
    channel.consume(queue.queue, (msg) => {
      if (msg !== null) {
        const product = JSON.parse(msg.content.toString());
        console.log("Received message:", product.name);
        channel.ack(msg); // Acknowledge message
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// Start listening for new product launch notifications
announceNewProduct({
  id: 123,
  name: "John Doe",
  price: 100
});