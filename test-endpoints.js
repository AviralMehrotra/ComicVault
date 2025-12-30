import axios from "axios";

const BASE_URL = "http://localhost:3001/api";

// Test data
const testComic = {
  id: 12345,
  name: "Test Batman Comic",
  publisher: { name: "DC Comics" },
  start_year: 2020,
  count_of_issues: 50,
  description: "Test comic description",
  image: { medium_url: "https://example.com/image.jpg" },
  api_detail_url: "https://comicvine.gamespot.com/api/volume/4050-12345/",
};

// You'll need to get this token from your browser's developer tools
// 1. Login to your app
// 2. Open browser dev tools > Application > Local Storage
// 3. Look for supabase auth token
const TEST_TOKEN =
  "eyJhbGciOiJIUzI1NiIsImtpZCI6InkvMFZsOC94eWg4VmFtNHMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3FoZHNubnNhY2JkZGJvcGp4bnZoLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIwMDhjZjk4Ni03NjhmLTQ4N2EtOTMyZS1iZmIwYjAxN2JhY2IiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzY3MTA0OTU4LCJpYXQiOjE3NjcxMDEzNTgsImVtYWlsIjoiYXZpcmFsbWVocm90cmE5NDAyQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJhdmlyYWxtZWhyb3RyYTk0MDJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiMDA4Y2Y5ODYtNzY4Zi00ODdhLTkzMmUtYmZiMGIwMTdiYWNiIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NjcxMDEzNTh9XSwic2Vzc2lvbl9pZCI6IjUyYTJlOWYxLTQ0NzQtNGVjZC05NWUzLTMzMzNkYmY2ZTc3NyIsImlzX2Fub255bW91cyI6ZmFsc2V9.k3xrdXmulEWy-hAUaGDCfN6Z4bxB-lcBuDATXTqqy3o"; // Replace with actual token

const headers = {
  Authorization: `Bearer ${TEST_TOKEN}`,
  "Content-Type": "application/json",
};

async function testEndpoints() {
  console.log("🧪 Testing API Endpoints...\n");

  try {
    // Test 1: Add comic to collection
    console.log("1️⃣ Testing: Add to Collection");
    const addResponse = await axios.post(
      `${BASE_URL}/comics/add-to-collection`,
      {
        comic: testComic,
        status: "reading",
      },
      { headers }
    );
    console.log("✅ Success:", addResponse.data);

    const comicId = addResponse.data.data.id;
    console.log(`📝 Comic ID: ${comicId}\n`);

    // Test 2: Get user comics
    console.log("2️⃣ Testing: Get User Comics");
    const getResponse = await axios.get(`${BASE_URL}/user/comics`, { headers });
    console.log("✅ Success:", getResponse.data);
    console.log(`📊 Found ${getResponse.data.data.length} comics\n`);

    // Test 3: Update comic status
    console.log("3️⃣ Testing: Update Comic Status");
    const updateResponse = await axios.put(
      `${BASE_URL}/comics/${comicId}/status`,
      {
        status: "completed",
        rating: 5,
      },
      { headers }
    );
    console.log("✅ Success:", updateResponse.data);
    console.log(`📈 Status updated to: ${updateResponse.data.data.status}\n`);

    // Test 4: Toggle issue read status
    console.log("4️⃣ Testing: Toggle Issue Read Status");
    const toggleResponse = await axios.post(
      `${BASE_URL}/issues/${comicId}/1/toggle`,
      {},
      { headers }
    );
    console.log("✅ Success:", toggleResponse.data);
    console.log(
      `📖 Issue 1 read status: ${toggleResponse.data.data.is_read}\n`
    );

    // Test 5: Get reading progress
    console.log("5️⃣ Testing: Get Reading Progress");
    const progressResponse = await axios.get(
      `${BASE_URL}/issues/${comicId}/progress`,
      { headers }
    );
    console.log("✅ Success:", progressResponse.data);
    console.log(`📚 Read issues: ${progressResponse.data.data.readIssues}\n`);

    console.log("🎉 All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      console.log("\n💡 Authentication Error - Please update TEST_TOKEN:");
      console.log("1. Login to your app");
      console.log("2. Open browser dev tools > Application > Local Storage");
      console.log(
        "3. Find supabase.auth.token and copy the access_token value"
      );
      console.log("4. Replace TEST_TOKEN in this script");
    }
  }
}

// Run tests
testEndpoints();
