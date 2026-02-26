  const express = require("express");
  const axios = require("axios");
  const cors = require("cors");

  const app = express(); // ✅ MUST exist before app.post

  app.use(cors());
  app.use(express.json());

  app.post("/evaluate", async (req, res) => {
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        req.body,
        {
          headers: {
            "Authorization": "Bearer HAHA_API_KEY",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost",
            "X-Title": "PLADE"
          }
        }
      );

      const aiText = response.data.choices[0].message.content;

      // 🔥 Extract JSON safely
      let jsonMatch = aiText.match(/\{.*\}/s);

      if (!jsonMatch) {
        return res.json({
          result: "wrong",
          reason: "Invalid AI response"
        });
      }

      let parsed;
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (e) {
        return res.json({
          result: "wrong",
          reason: "Parsing failed"
        });
      }

      res.json({
        result: parsed.result,
        reason: parsed.reason
      });

    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
      res.status(500).json({ error: "API failed" });
    }
  });

  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
