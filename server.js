import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve everything inside /public
app.use(express.static(path.join(__dirname, "public")));

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`🚀 Widget Server running on http://localhost:${PORT}`);
});