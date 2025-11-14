import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Resolve __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5050;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// --- Load all community JSON files from ./data --------------------------------
const DATA_DIR = path.join(__dirname, "data");
const data = {};
if (fs.existsSync(DATA_DIR)) {
  for (const file of fs.readdirSync(DATA_DIR)) {
    if (!file.endsWith(".json")) continue;
    const community = file.replace(/\.json$/, "");
    const payload = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, file), "utf8")
    );
    data[community] = payload;
  }
} else {
  console.warn(`Data directory not found: ${DATA_DIR}`);
}
const communities = Object.keys(data);

// --- Helpers ------------------------------------------------------------------
const pick = (arr) => {
  if (!arr || arr.length === 0) return null;
  const i = Math.floor(Math.random() * arr.length);
  return arr[i];
};

// --- Routes -------------------------------------------------------------------
app.get("/api/communities", (req, res) => {
  res.json({ communities });
});

app.get("/api/names", (req, res) => {
  const { community } = req.query;
  if (!community || !data[community]) {
    return res.status(400).json({ error: "Unknown or missing community" });
  }
  res.json(data[community]);
});

app.get("/api/generate", (req, res) => {
  let {
    community = "all",
    gender = "any",
    count = 5,
    fullName = "true",
    meaning = "false",
  } = req.query;

  count = Math.max(1, Math.min(50, parseInt(count, 10) || 1));
  fullName = String(fullName) === "true";
  meaning = String(meaning) === "true";

  // Build pools (merge when community = all)
  const selected = community === "all" ? communities : [community];
  const pools = { first: { male: [], female: [] }, last: [] };

  for (const c of selected) {
    const block = data[c];
    if (!block) continue;
    pools.first.male.push(...(block.firstNames?.male || []));
    pools.first.female.push(...(block.firstNames?.female || []));
    pools.last.push(...(block.surnames || []).map((s) => ({ name: s })));
  }

  const results = [];
  for (let i = 0; i < count; i++) {
    const g = gender === "any" ? (Math.random() < 0.5 ? "male" : "female") : gender;
    const first = pick(pools.first[g]);
    const last = fullName ? pick(pools.last) : null;

    const name = [first?.name, last?.name].filter(Boolean).join(" ");
    const item = {
      name,
      parts: { first: first?.name || null, last: last?.name || null },
      gender: g,
      community,
    };
    if (meaning && first?.meaning) item.meaning = first.meaning;
    results.push(item);
  }

  res.json({ count: results.length, results });
});

// --- Start server -------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});