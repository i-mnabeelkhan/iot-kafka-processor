import http from "k6/http";
import { check, sleep } from "k6";

// Test configuration
export const options = {
  stages: [
    { duration: "60s", target: 1000 }, // Ramp up to 20 users over 30 seconds
    { duration: "4m", target: 1000 }, // Stay at 20 users for 1 minute
    { duration: "5s", target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests should be below 500ms
    http_req_failed: ["rate<0.01"], // Less than 1% of requests should fail
  },
};

const PRODUCER_BASE_URL = "http://localhost:3000";
let count = 0;
// Helper function to generate random content
function generateRandomContent() {
  const id = Math.floor(Math.random() * 10000);
  count++;
  return {
    title: `${count} Test Post ${id}`,
    content: `${count} This is test content for post ${id}`,
  };
}

export default function () {
  // Test 2: Create post
  const postData = generateRandomContent();

  const res = http.post(
    `${PRODUCER_BASE_URL}/create-post`,
    JSON.stringify(postData),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  check(res, {
    "create-post status is 200": (r) => r.status === 200,
    "create-post response has success": (r) => r.json("success") === true,
  });

  sleep(1);
}
