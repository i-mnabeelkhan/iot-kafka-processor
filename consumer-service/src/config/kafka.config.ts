import { Kafka, Consumer, logLevel } from "kafkajs";

export class KafkaConfig {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly brokers: string;

  constructor() {
    this.brokers = process.env.KAFKA_BROKERS ?? "localhost:29092";
    this.kafka = new Kafka({
      clientId: "consumer-service",
      brokers: [this.brokers],
      logLevel: logLevel.INFO,
    });
    this.consumer = this.kafka.consumer({
      groupId: "consumer-group",
    });
  }

  async connect() {
    try {
      await this.consumer.connect();
    } catch (error) {
      throw new Error(
        `\n\n❌ Error connecting consumer to Kafka: ${error}\n\n`
      );
    }
  }

  async subscribeToTopic(topic: string) {
    try {
      await this.consumer.subscribe({
        topic,
        fromBeginning: true,
      });
      console.log(`✅ Subscribed to topic ${topic}`);
    } catch (error) {
      throw new Error(`\n\n❌ Error subscribing to topic: ${error}\n\n`);
    }
  }

  async consumeMessages(callback: (message: any) => void): Promise<void> {
    try {
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          callback(JSON.parse(message?.value?.toString()!));
        },
      });
    } catch (error) {
      throw new Error(`\n\n❌ Error consuming messages: ${error}\n\n`);
    }
  }

  async disconnect() {
    try {
      await this.consumer.disconnect();
    } catch (error) {
      throw new Error(
        `\n\n❌ Error disconnecting consumer from Kafka: ${error}\n\n`
      );
    }
  }
}
