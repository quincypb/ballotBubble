import fetch from "node-fetch";

export const getPresidentialCandidates = async (req, res) => {
  try {
    console.log("📡 Fetching presidential candidates from civicAPI... nvm govt");

    const response = await fetch(
      "https://civicapi.org/api/v2/race/search?query=Governor"
    );

    console.log("✅ Received response from API:", response.status, response.statusText);

    const data = await response.json();
    console.log("📦 Parsed JSON data:", JSON.stringify(data, null, 2));

    // Optional: check if races exists
    if (!data.races) {
      console.warn("⚠️ 'races' field is undefined or null in API response");
    } else {
      console.log(`🔹 Found ${data.races.length} races in response`);
    }

    // Just return everything
    res.json(data);
    console.log("🚀 Response sent to client successfully");
  } catch (err) {
    console.error("❌ Error fetching presidential candidates:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};
