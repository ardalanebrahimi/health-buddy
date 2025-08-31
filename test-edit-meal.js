const http = require("http");

// Test data for updating meal items
const testData = {
  items: [
    {
      id: "test-item-1",
      name: "grilled chicken breast",
      portionGrams: 200,
      calories: 330,
      protein: 62,
      carbs: 0,
      fat: 7,
    },
    {
      id: "test-item-2",
      name: "mixed green salad",
      portionGrams: 100,
      calories: 20,
      protein: 2,
      carbs: 4,
      fat: 0.2,
    },
  ],
};

// Test the PATCH /meals/{mealId}/items endpoint
function testUpdateMealItems() {
  const mealId = "123e4567-e89b-12d3-a456-426614174000"; // Test meal ID

  const options = {
    hostname: "localhost",
    port: 3000,
    path: `/api/v1/meals/${mealId}/items`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(JSON.stringify(testData)),
    },
  };

  console.log("Testing PATCH /api/v1/meals/:mealId/items");
  console.log("Request body:", JSON.stringify(testData, null, 2));

  const req = http.request(options, (res) => {
    console.log(`\nStatus: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);

    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log("\nResponse Body:");
      try {
        const jsonData = JSON.parse(data);
        console.log(JSON.stringify(jsonData, null, 2));
      } catch (e) {
        console.log(data);
      }
    });
  });

  req.on("error", (e) => {
    console.error(`Request error: ${e.message}`);
  });

  req.write(JSON.stringify(testData));
  req.end();
}

// Test the GET /health endpoint first to ensure server is running
function testHealth() {
  const options = {
    hostname: "localhost",
    port: 3000,
    path: "/api/v1/health",
    method: "GET",
  };

  console.log("Testing GET /api/v1/health");

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);

    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log("Health check response:", data);

      if (res.statusCode === 200) {
        console.log("\n" + "=".repeat(50));
        console.log("Health check passed, testing update meal items...");
        console.log("=".repeat(50));
        setTimeout(testUpdateMealItems, 500);
      } else {
        console.log("Health check failed, server might not be running");
      }
    });
  });

  req.on("error", (e) => {
    console.error(`Health check error: ${e.message}`);
    console.log("Make sure the backend server is running with: npm run dev");
  });

  req.end();
}

// Start the test
testHealth();
