import { KafkaConfig } from "./config/kafka.config";
import { consumeTestMessage } from "./services/consume-test-messages";

export const startServices = async () => {
  try {
    const kafka = new KafkaConfig(["localhost:29092"]);
    await kafka.connect();
    await kafka.subscribe("test-topic");
    await consumeTestMessage(kafka);
  } catch (error) {
    console.error(error);
  }
};
