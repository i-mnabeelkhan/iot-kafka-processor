import { Kafka, Consumer } from "kafkajs";
export class KafkaConfig {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;

  // constructor
  constructor(brokers: string[]) {
    this.kafka = new Kafka({
      clientId: "consumer-service",
      brokers: brokers,
    });
    this.consumer = this.kafka.consumer({ groupId: "consumer-group-1" });
  }

  // connect to kafka
  async connect() {
    try {
      await this.consumer.connect();
    } catch (error) {
      throw new Error(
        `\n\n❌ Error connecting consumer to Kafka: ${error}\n\n`
      );
    }
  }

  // subscribe to topic
  async subscribe(topic: string) {
    try {
      await this.consumer.subscribe({ topic, fromBeginning: true });
      console.log(`\n\n✅ Subscribed to topic ${topic}\n\n`);
    } catch (error) {
      throw new Error(`\n\n❌ Error subscribing to topic: ${error}\n\n`);
    }
  }

  // consume messages
  async consume(onMessage: (message: string) => void) {
    try {
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          message?.value && onMessage(message.value.toString());
        },
      });
    } catch (error) {
      throw new Error(`\n\n❌ Error consuming messages: ${error}\n\n`);
    }
  }

  //disconnect
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
