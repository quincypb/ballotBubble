import fetch from "node-fetch";

export const getPresidentialCandidates = async (req, res) => {
  try {
    const response = await fetch(
      "https://civicapi.org/api/results?race_type=President"
    );
    const data = await response.json();

    const filtered = data.races.map(race => ({
      race_id: race.race_id,
      candidates: race.candidates.map(c => ({
        name: c.name,
        party: c.party
      }))
    }));

    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};
