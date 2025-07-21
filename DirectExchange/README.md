# Direct Exchange - RabbitMQ

## Introduction
A Direct Exchange in RabbitMQ is a type of exchange that routes messages to queues based on a message routing key. It delivers messages to queues whose binding key exactly matches the routing key of the message.

## Explanation
In a direct exchange, the routing algorithm is simple: a message goes to the queues whose binding key exactly matches the routing key of the message. This is useful for unicast routing (one-to-one) or multicast routing (one-to-many) with exact matching.

## Use Case
Direct exchanges are ideal for scenarios where you want to deliver messages to specific queues based on a precise identifier, such as:
- Task distribution systems
- Notification systems where each type of notification has its own queue
- Logging systems with different log levels (info, warning, error)

## Architecture
- **Producer**: Sends messages with a specific routing key to the direct exchange.
- **Direct Exchange**: Forwards messages to queues whose binding key matches the routing key.
- **Queue(s)**: Receive messages if their binding key matches the message's routing key.
- **Consumer(s)**: Listen to queues and process messages.

## Example
Suppose you have a direct exchange named `direct_logs` and three queues bound with binding keys `info`, `warning`, and `error`.
- A message with routing key `error` will only go to the queue bound with `error`.

## Architecture Flow
1. The producer connects to RabbitMQ and sends a message to the direct exchange with a routing key.
2. The direct exchange checks all bindings and routes the message to the queue(s) with a matching binding key.
3. The consumer(s) receive and process the message from the queue.

### General Architecture Diagram
```mermaid
graph LR
    Producer1["Producer"] -- "routing key: info" --> DirectExchange["Direct Exchange"]
    Producer2["Producer"] -- "routing key: warning" --> DirectExchange
    Producer3["Producer"] -- "routing key: error" --> DirectExchange
    DirectExchange -- "binding key: info" --> QueueInfo["Queue: info"]
    DirectExchange -- "binding key: warning" --> QueueWarning["Queue: warning"]
    DirectExchange -- "binding key: error" --> QueueError["Queue: error"]
    QueueInfo --> ConsumerA["Consumer"]
    QueueWarning --> ConsumerB["Consumer"]
    QueueError --> ConsumerC["Consumer"]
```

---

## Implementation Flow Diagram
```mermaid
graph TD
    Producer["producer.js"] -- "Publishes message with routing key" --> DirectExchange["Direct Exchange"]
    DirectExchange -- "routing key: info" --> QueueInfo["Queue (info)"]
    DirectExchange -- "routing key: warning" --> QueueWarning["Queue (warning)"]
    DirectExchange -- "routing key: error" --> QueueError["Queue (error)"]
    QueueInfo --> InfoConsumer["infoConsumer.js: Receives & processes"]
    QueueWarning --> WarningConsumer["warningConsumer.js: Receives & processes"]
    QueueError --> ErrorConsumer["errorConsumer.js: Receives & processes"]
```

---
This folder contains code examples demonstrating the use of a direct exchange in RabbitMQ. 