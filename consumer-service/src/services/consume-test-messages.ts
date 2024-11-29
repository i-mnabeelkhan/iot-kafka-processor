import { KafkaConfig } from "../config/kafka.config";

export const consumeTestMessage = async (kafka: KafkaConfig) => {
  try {
    await kafka.consume((message) => {
      console.log(`Received message on consumer: ${message}`);
    });
  } catch (error) {
    console.error(error);
  }
};
