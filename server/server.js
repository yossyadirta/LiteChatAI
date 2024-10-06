import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

const app = express();

app.use(cors());
app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 1,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: {
        type: "text",
      },
    });

    console.log(response, "<< in iresponse co");

    res.status(200).send({
      bot: response.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.listen(4000, () => console.log("Server Running on Port: 4000"));
