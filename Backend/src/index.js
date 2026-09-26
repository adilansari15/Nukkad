import express from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT
console.log(process.env.DB_URL);

app.listen(PORT, () => console.log("server Is Up & Running On port:", PORT));
