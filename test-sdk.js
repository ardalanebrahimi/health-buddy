const { HealthCompanionClient } = require("./packages/sdk/dist/index.js");

async function testSDK() {
  console.log("Testing Health Companion SDK...");

  const client = new HealthCompanionClient("http://localhost:3000/api/v1");

  try {
    console.log("1. Testing health endpoint...");
    const health = await client.getHealth();
    console.log("✅ Health check:", JSON.stringify(health, null, 2));

    console.log("\n2. Testing daily summary endpoint...");
    const summary = await client.getDailySummary();
    console.log("✅ Daily summary:", JSON.stringify(summary, null, 2));

    console.log("\n3. Testing profile endpoint...");
    const profile = await client.getProfile();
    console.log("✅ Profile:", JSON.stringify(profile, null, 2));

    console.log("\n4. Testing companion message endpoint...");
    const message = await client.getDailyCompanionMessage();
    console.log("✅ Companion message:", JSON.stringify(message, null, 2));

    console.log("\n🎉 All SDK tests passed!");
  } catch (error) {
    console.error("❌ SDK test failed:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

testSDK().catch(console.error);
