import { Admin, Kafka, Producer, Message } from "kafkajs";
export class KafkaConfig {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly admin: Admin;

  // constructor
  constructor(brokers: string[]) {
    this.kafka = new Kafka({
      clientId: "producer-service",
      brokers: brokers,
    });
    this.producer = this.kafka.producer();
    this.admin = this.kafka.admin();
  }

  // connect to kafka
  async connect() {
    try {
      await this.producer.connect();
      await this.admin.connect();
    } catch (error) {
      throw new Error(
        `\n\n❌ Error connecting producer to Kafka: ${error}\n\n`
      );
    }
  }
  // create topic
  async createTopic(topic: string) {
    try {
      // check if topic exists
      const topicExists = await this.admin.listTopics();
      if (topicExists.includes(topic)) {
        console.log(`\n\n✅ Topic ${topic} already exists\n\n`);
      } else {
        await this.admin.createTopics({
          topics: [{ topic }],
        });
        console.log(`\n\n✅ Topic ${topic} created\n\n`);
      }
    } catch (error) {
      throw new Error(`\n\n❌ Error creating topic: ${error}\n\n`);
    }
  }

  // message producer
  async produceMessage(topic: string, messages: Message[]) {
    try {
      await this.producer.send({
        topic,
        messages,
      });
      console.log(`✅ Messages produced to topic ${topic}`);
    } catch (error) {
      throw new Error(`❌ Error producing message: ${error}`);
    }
  }

  //disconnect
  async disconnect() {
    try {
      await this.producer.disconnect();
      await this.admin.disconnect();
    } catch (error) {
      throw new Error(
        `\n\n❌ Error disconnecting producer from Kafka: ${error}\n\n`
      );
    }
  }
}