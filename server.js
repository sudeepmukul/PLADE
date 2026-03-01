const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
// I am the GOAT hehehehehe
//  Accept RAW TEXT instead of JSON
app.use(express.text({ type: "*/*" }));
app.use(cors());

app.post("/evaluate", async (req, res) => {
  try {
    let playerCode = req.body;

    if (!playerCode || typeof playerCode !== "string") {
      return res.json({
        result: "wrong",
        reason: "No code received"
      });
    }

    console.log("RAW CODE:\n", playerCode);

    const prompt = `
You are a STRICT code evaluator.

You must ONLY return "correct" if ALL conditions are satisfied.

Conditions:
1. Must store 3 knight IDs in a list (numbers only)
2. Must use a loop to print each knight ID
3. Must use a boolean variable for enemy detection
4. If enemy is NOT detected, must print total number of knights

If ANY condition is missing → result = "wrong"
If unsure → ALWAYS return "wrong"
Also Only say its correct when all the test cases mentioned above are included in the code.

------------------------
USER CODE:
${playerCode}
------------------------

Respond ONLY in JSON:
{"result":"correct or wrong","reason":"short explanation"}
`;

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "qwen:7b",
        prompt: prompt,
        stream: false,
        options: { temperature: 0 }
      }
    );

    const aiText = response.data.response;

    console.log("🤖 AI RAW:\n", aiText);

    const match = aiText.match(/\{[\s\S]*?\}/);

    if (!match) {
      return res.json({
        result: "wrong",
        reason: "Invalid AI output"
      });
    }

    let parsed;

    try {
      parsed = JSON.parse(match[0]);
    } catch {
      return res.json({
        result: "wrong",
        reason: "Parsing failed"
      });
    }

    res.json({
      result: parsed.result,
      reason: parsed.reason,
      display: `Result: ${parsed.result}\nReason: ${parsed.reason}`
    });

  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);

    res.status(500).json({
      result: "wrong",
      reason: "Local AI failed"
    });
  }
});

app.listen(3000, () => {
  console.log("Wow bro Server running on http://localhost:3000");
});
