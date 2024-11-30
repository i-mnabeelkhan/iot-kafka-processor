import { KafkaConfig } from "../config/kafka.config";
import PostModel from "../models/post";
const messages: any[] = [];
let processing = false;

export const postConsumer = async (kafka: KafkaConfig) => {
  try {
    await kafka.consumeMessages(async (message: any) => {
      messages.push(message);
      console.log(`📩 Message received: ${JSON.stringify(message, null, 2)}`);
      if (messages.length > 1000) {
        // Bulk Insert messages to database
        processMessages();
      }
    });
  } catch (error) {
    console.log("\n\n❌ Error consuming messages: ", error);
  }
};

// Process messages every 10 seconds
setInterval(processMessages, 10000);

async function processMessages() {
  if (messages.length > 0 && !processing) {
    processing = true;
    const batchToProcess = [...messages];
    messages.length = 0;
    try {
      await PostModel.insertMany(batchToProcess);
      console.log(`✅ Inserted ${batchToProcess.length} messages to database`);
    } catch (error) {
      console.log("\n\n❌ Error inserting messages to database: ", error);
      messages.push(...batchToProcess);
    } finally {
      processing = false;
    }
  }
}
