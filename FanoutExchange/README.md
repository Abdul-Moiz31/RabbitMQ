# Fanout Exchange - RabbitMQ

## Introduction
A Fanout Exchange in RabbitMQ is a type of exchange that routes messages to all queues bound to it, regardless of the routing key. It is the simplest form of message routing and is ideal for broadcasting messages to multiple consumers simultaneously.

## Explanation
When a producer sends a message to a fanout exchange, the exchange forwards the message to every queue that is bound to it. The routing key is ignored. This makes fanout exchanges perfect for scenarios where the same message needs to be delivered to multiple consumers.

## Use Case
Fanout exchanges are commonly used for:
- Broadcasting notifications or events to multiple services
- Real-time data feeds (e.g., live sports scores, stock tickers)
- Sending the same message to multiple microservices
- Pub/Sub (publish/subscribe) systems

## Architecture
- **Producer**: Sends messages to the fanout exchange.
- **Fanout Exchange**: Forwards every message to all bound queues, ignoring the routing key.
- **Queue(s)**: Receive all messages sent to the exchange.
- **Consumer(s)**: Listen to queues and process messages.

## Example
Suppose you have a fanout exchange named `logs` and three queues bound to it: `email_notifications`, `sms_notifications`, and `push_notifications`.
- When the producer sends a message to the `logs` exchange, all three queues receive a copy of the message, regardless of any routing key.

## Architecture Flow
1. The producer connects to RabbitMQ and sends a message to the fanout exchange.
2. The fanout exchange forwards the message to all bound queues.
3. Each consumer receives and processes the message from its respective queue.

### Architecture Diagram
```mermaid
graph LR
    Producer["Producer"] -- "Message" --> FanoutExchange["Fanout Exchange"]
    FanoutExchange -- "" --> QueueEmail["Queue: email_notifications"]
    FanoutExchange -- "" --> QueueSMS["Queue: sms_notifications"]
    FanoutExchange -- "" --> QueuePush["Queue: push_notifications"]
    QueueEmail --> ConsumerA["Consumer: Email Service"]
    QueueSMS --> ConsumerB["Consumer: SMS Service"]
    QueuePush --> ConsumerC["Consumer: Push Service"]
```

---
This folder contains code examples demonstrating the use of a fanout exchange in RabbitMQ.
