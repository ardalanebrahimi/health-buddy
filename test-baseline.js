// Test script for UP-002 baseline endpoint
const testBaseline = async () => {
  try {
    console.log("Testing PATCH /profile/baseline endpoint...");

    const response = await fetch(
      "http://localhost:3000/api/v1/profile/baseline",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conditions: ["overweight", "diabetes"],
          painAreas: ["lower_back", "shoulders"],
          notes: "Chronic back pain, especially in the morning",
        }),
      }
    );

    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log("✅ Baseline update successful!");

      // Test GET profile to verify baseline was saved
      console.log("\nTesting GET /profile to verify baseline...");
      const getResponse = await fetch("http://localhost:3000/api/v1/profile");
      const profileData = await getResponse.json();
      console.log(
        "Profile with baseline:",
        JSON.stringify(profileData.baselineJson, null, 2)
      );
    } else {
      console.log("❌ Baseline update failed");
    }
  } catch (error) {
    console.error("Error testing baseline:", error);
  }
};

testBaseline();
