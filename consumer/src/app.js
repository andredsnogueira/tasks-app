const amqp = require('amqplib');

const startConsumer = async () => {
  try {
    const connection = await amqp.connect(
      `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}`
    );

    const channel = await connection.createChannel();
    await channel.assertQueue('tasks', { durable: true });
    await channel.prefetch(1);

    channel.consume('tasks', async (message) => {
      const content = JSON.parse(message.content);

      channel.ack(message);

      console.log(
        `The tech ${content.creator_id} performed the task ${
          content.id
        } on date ${new Date(content.completed_at)}`
      );
    });
  } catch (error) {
    console.log(error);
  }
};

startConsumer();
