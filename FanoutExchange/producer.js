const amqp = require('amqplib');

// Function to connect to RabbitMQ and publish a new product launch message
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

    // Prepare the product message
    const message = JSON.stringify(product);

    // Publish the message to the fanout exchange
    channel.publish(exchange, " ", Buffer.from(message), { persistent: true });
    console.log("Message sent to exchange:", message);

    // Close the connection after a short delay to ensure message is sent
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.log(error);
  }
};

// Publish a new product launch message
announceNewProduct({
  id: 123,
  name: "John Doe",
  price: 100
});