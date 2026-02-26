const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/evaluate", async (req, res) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      req.body,
      {
        headers: {
          Authorization: "Bearer HAHA_API_KEY",
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ error: "API failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
