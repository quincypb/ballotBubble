import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";   // <— FIXED
import pkg from "pg";
const { Client } = pkg;

dotenv.config();

// Database connection for email collection 
const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

db.connect()
  .then(() => console.log("Connected to Render Postgres"))
  .catch(err => console.error("DB connection error", err));

// express stuff 
const app = express();
app.use(cors());
app.use(express.json());


// current static lander 
app.use(express.static("public"));

// for subscription end point 
app.post("/subscribe", async (req, res) => {
  const { email, zipcode } = req.body;

  if (!email) {
    return res.status(400).json({ error: "email_required" });
  }

  try {
    const result = await db.query(
      `
      INSERT INTO subscribers (email, zipcode)
      VALUES ($1, $2)
      ON CONFLICT (email) DO UPDATE SET zipcode = EXCLUDED.zipcode
      RETURNING *;
      `,
      [email, zipcode || null]
    );

    res.json({ status: "subscribed", subscriber: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db_error" });
  }
});

//make email template in db (run once)
// app.get("/init", async (req, res) => {
//   try {
//     await db.query(`
//       CREATE TABLE IF NOT EXISTS subscribers (
//         id SERIAL PRIMARY KEY,
//         email VARCHAR(255) UNIQUE NOT NULL,
//         zipcode VARCHAR(20),               -- added here, allows NULL
//         created_at TIMESTAMP DEFAULT NOW()
//       );
//     `);

//     res.send("Subscribers table created.");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error creating table.");
//   }
// });



// Root testing
// app.get("/", (req, res) => {
//   res.send("ballotBubble backend is live!");
//   console.log("new page render");
// });

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
