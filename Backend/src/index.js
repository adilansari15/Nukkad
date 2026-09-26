import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import fs from "fs";
import User from "./models/user.model.js";
import { connectDB } from "./lib/db.js";
import { clerkMiddleware,  } from '@clerk/express'
import clerkWebhook from "./webhooks/clerk.webhook.js";

const app = express();
const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;


const publicDir = path.join(process.cwd(), "public");


app.use("/api/webhooks/clerk", express.raw({type: "application/json"}), clerkWebhook);


app.use(express.json());
app.use(cors({ origin: FRONTEND_URL, credentials: true }))
console.log("PK:", process.env.CLERK_PUBLISHABLE_KEY);
console.log("SK:", process.env.CLERK_SECRET_KEY ? "FOUND" : "MISSING");
app.use(clerkMiddleware());



app.get("/health", (req, res) => {
    console.log("Health endpoint hit");
    res.status(200).json({ ok: true });
})

if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));

    app.get("/{*any}", (req, res, next) => {
        res.sendFile(path.join(publicDir, "index.html"), (err) => {
            next(err);
        });
    });
}


app.listen(PORT, () => {
    connectDB();
    console.log("server Is Up & Running On port:", PORT)
});
