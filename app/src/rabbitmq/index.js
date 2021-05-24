const amqp = require('amqplib');

exports.send = async (message) => {
  const connection = await amqp.connect(
    `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}`
  );
  const channel = await connection.createChannel();
  channel.assertQueue('tasks', { durable: true });
  channel.sendToQueue('tasks', Buffer.from(JSON.stringify(message)));
};
