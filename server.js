import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";   // <— FIXED

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Root testing
app.get("/", (req, res) => {
  res.send("ballotBubble backend is live!");
  console.log("new page render");
});

// Resend setup
const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/send", async (req, res) => {
  const { to, subject, html } = req.body;

  try {
    const data = await resend.emails.send({
      from: `BallotBubble <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    res.json({ status: "sent!", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "email_failed" });
  }
});

// Port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
