import http from "k6/http";
import { check, sleep } from "k6";

// Test configuration
export const options = {
  stages: [
    { duration: "60s", target: 1000 }, // Ramp up to 1000 users over 60 seconds
    { duration: "8m", target: 1000 }, // Stay at 1000 users for 9 minutes
    { duration: "60s", target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ["p(95)<900"], // 95% of requests should be below 900ms
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
