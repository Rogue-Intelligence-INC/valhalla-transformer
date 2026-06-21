#!/usr/bin/env node
/**
 * Valhalla-Transformer test API
 * Serves experiment JSON, body internals, and optional native QA proxy.
 *
 * Endpoints:
 *   GET  /api/health
 *   GET  /api/experiments
 *   GET  /api/experiments/:id
 *   GET  /api/bodies
 *   GET  /api/progress
 *   GET  /api/body-diff
 *   POST /api/qa
 *   GET  /api/fair-benchmark
 *   GET  /api/fair-benchmark/spec
 *   GET  /api/fair-benchmark/:id
 *   GET  /api/hybrid-unified
 *   GET  /api/hybrid-unified/:id
 *   GET  /api/tile-stemcell-cycles
 *   GET  /api/tile-stemcell-cycles/:id
 */

import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const EXP_DIR = path.join(ROOT, "experiments");
const PORT = Number(process.env.VT_API_PORT || 8780);
const NATIVE_BIN = process.env.VALHALLA_NATIVE_QA || "";
const DASHBOARD_URL = process.env.VALHALLA_DASHBOARD_URL || "http://127.0.0.1:8765";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function listExperiments() {
  if (!fs.existsSync(EXP_DIR)) return [];
  return fs
    .readdirSync(EXP_DIR)
    .filter((f) => f.endsWith(".json") && f.startsWith("fundraise_mvp_"))
    .map((f) => {
      const full = path.join(EXP_DIR, f);
      const data = readJson(full);
      return {
        id: f.replace(".json", ""),
        file: f,
        timestamp: data.meta?.timestamp,
        n: data.meta?.n,
        experiment: data.meta?.experiment,
      };
    })
    .sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""));
}

function resolveNativeBin() {
  if (NATIVE_BIN && fs.existsSync(NATIVE_BIN)) return NATIVE_BIN;
  const candidates = [
    path.join(process.env.HOME || "", "AI/Valhalla/target/release/valhalla_native_qa"),
    "/home/jouly/AI/Valhalla/target/release/valhalla_native_qa",
  ];
  return candidates.find((p) => fs.existsSync(p)) || null;
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "valhalla-transformer-api",
    version: "2.0.0",
    hybrid_product: "hybrid-2.0",
    fair_benchmark: "fair-1.2",
    native_qa: resolveNativeBin() ? "available" : "mock_only",
    experiments_dir: EXP_DIR,
  });
});

app.get("/api/experiments", (_req, res) => {
  res.json({ experiments: listExperiments() });
});

app.get("/api/experiments/:id", (req, res) => {
  const file = path.join(EXP_DIR, `${req.params.id}.json`);
  if (!fs.existsSync(file)) {
    return res.status(404).json({ error: "experiment not found", id: req.params.id });
  }
  res.json(readJson(file));
});

app.get("/api/bodies", (_req, res) => {
  const file = path.join(EXP_DIR, "body_internals.json");
  res.json(readJson(file));
});

app.get("/api/progress", (_req, res) => {
  const file = path.join(EXP_DIR, "body_internals.json");
  const { progress_regression: pr } = readJson(file);
  res.json(pr);
});

app.get("/api/body-diff", (_req, res) => {
  const file = path.join(EXP_DIR, "body_diff_sample.json");
  res.json(readJson(file));
});

app.post("/api/qa", (req, res) => {
  const { body = "triad", cycles = 1, corpus = [], question = "", score_type = "open" } = req.body || {};
  if (!question.trim()) {
    return res.status(400).json({ error: "question required" });
  }
  const bin = resolveNativeBin();
  const payload = JSON.stringify({ body, cycles, corpus, question, score_type });
  if (bin) {
    const proc = spawnSync(bin, [], { input: payload, encoding: "utf8", timeout: 120000 });
    if (proc.status !== 0) {
      return res.status(500).json({ error: "native_qa failed", stderr: proc.stderr, stdout: proc.stdout });
    }
    try {
      return res.json(JSON.parse(proc.stdout));
    } catch {
      return res.status(500).json({ error: "invalid native_qa output", raw: proc.stdout });
    }
  }
  // Mock when binary absent (CI / docs-only checkout)
  res.json({
    answer: `[mock] body=${body} score_type=${score_type} — set VALHALLA_NATIVE_QA for live Tier B`,
    body,
    cycles_executed: cycles,
    score_type,
    memory_items: corpus.length + 1,
    tile_count: body === "tile" || body === "triad" ? 4 : 0,
    stem_cells: body === "stemcell" || body === "triad" ? 8 : 0,
    decode_path: score_type === "numeric" ? "direct_math" : score_type === "mcq" ? "mcq_option" : "open_retrieval",
    top_matches: corpus.slice(0, 3).map((t, i) => ({ text: t, score: 1 - i * 0.1, source: "corpus" })),
    report_mode: "mock",
  });
});

function listFairBenchmarkRuns() {
  if (!fs.existsSync(EXP_DIR)) return [];
  const files = fs
    .readdirSync(EXP_DIR)
    .filter((f) => f.startsWith("fair_benchmark_") && f.endsWith(".json") && f !== "fair_benchmark_latest.json");
  return files
    .map((f) => {
      const data = readJson(path.join(EXP_DIR, f));
      const mem = (data.results || []).find((r) => r.arm === "triad_c1" || r.track === "memory_tier_b");
      return {
        id: f.replace(".json", ""),
        file: f,
        phase: data.meta?.phase,
        timestamp: data.meta?.timestamp,
        prompt_count: data.meta?.prompt_count,
        memory_acc: mem?.summary?.acc ?? mem?.acc,
        with_patch: data.meta?.with_patch,
        with_transformer: data.meta?.with_transformer,
      };
    })
    .sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""));
}

function fairBenchmarkPayload(id) {
  if (id === "latest") {
    const p = path.join(EXP_DIR, "fair_benchmark_latest.json");
    if (fs.existsSync(p)) return readJson(p);
  }
  const file = path.join(EXP_DIR, `${id}.json`);
  if (!fs.existsSync(file)) return null;
  return readJson(file);
}

app.get("/api/fair-benchmark", (_req, res) => {
  res.json({ runs: listFairBenchmarkRuns() });
});

app.get("/api/fair-benchmark/spec", (_req, res) => {
  const candidates = [
    path.join(ROOT, "en", "10_FAIR_BENCHMARK_SPEC.md"),
    path.join(ROOT, "zh", "10_FAIR_BENCHMARK_SPEC.md"),
  ];
  const specPath = candidates.find((p) => fs.existsSync(p));
  if (!specPath) {
    return res.json({
      summary:
        "fair-1.2: decontaminated corpus; Hybrid unified product hybrid-2.0.",
    });
  }
  const text = fs.readFileSync(specPath, "utf8");
  res.json({ summary: text.slice(0, 1200), path: path.basename(specPath) });
});

app.get("/api/fair-benchmark/:id", (req, res) => {
  const data = fairBenchmarkPayload(req.params.id);
  if (!data) {
    return res.status(404).json({ error: "fair benchmark run not found", id: req.params.id });
  }
  res.json(data);
});

function listTileStemCycleRuns() {
  if (!fs.existsSync(EXP_DIR)) return [];
  const files = fs
    .readdirSync(EXP_DIR)
    .filter(
      (f) =>
        f.startsWith("tile_stemcell_cycles_") &&
        f.endsWith(".json") &&
        f !== "tile_stemcell_cycles_latest.json",
    );
  return files
    .map((f) => {
      const data = readJson(path.join(EXP_DIR, f));
      const iso = (data.results || []).filter((r) => r.protocol === "isolated");
      const tile20 = iso.find((r) => r.body === "tile" && r.cycles === 20);
      const stem20 = iso.find((r) => r.body === "stemcell" && r.cycles === 20);
      return {
        id: f.replace(".json", ""),
        file: f,
        phase: data.meta?.phase,
        timestamp: data.meta?.timestamp,
        prompt_count: data.meta?.prompt_count,
        tile_c20_acc: tile20?.summary?.acc,
        stem_c20_acc: stem20?.summary?.acc,
        verdict: data.verdict,
      };
    })
    .sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""));
}

function tileStemCyclePayload(id) {
  if (id === "latest") {
    const p = path.join(EXP_DIR, "tile_stemcell_cycles_latest.json");
    if (fs.existsSync(p)) return readJson(p);
  }
  const file = path.join(EXP_DIR, `${id}.json`);
  if (!fs.existsSync(file)) return null;
  return readJson(file);
}

app.get("/api/tile-stemcell-cycles", (_req, res) => {
  res.json({ runs: listTileStemCycleRuns() });
});

app.get("/api/tile-stemcell-cycles/:id", (req, res) => {
  const data = tileStemCyclePayload(req.params.id);
  if (!data) {
    return res.status(404).json({ error: "tile/stem cycle run not found", id: req.params.id });
  }
  res.json(data);
});

function listHybridUnifiedRuns() {
  if (!fs.existsSync(EXP_DIR)) return [];
  return fs
    .readdirSync(EXP_DIR)
    .filter(
      (f) =>
        f.startsWith("hybrid_unified_") &&
        f.endsWith(".json") &&
        f !== "hybrid_unified_latest.json",
    )
    .map((f) => {
      const data = readJson(path.join(EXP_DIR, f));
      const h = data.summary?.hybrid || {};
      const st = h.by_score_type || {};
      return {
        id: f.replace(".json", ""),
        file: f,
        phase: data.meta?.phase,
        timestamp: data.meta?.timestamp,
        hybrid_product_version: data.meta?.hybrid_product_version,
        total_acc: h.acc,
        open_acc: st.open?.acc,
        mcq_acc: st.mcq?.acc,
        numeric_acc: st.numeric?.acc,
      };
    })
    .sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""));
}

function hybridUnifiedPayload(id) {
  if (id === "latest") {
    const p = path.join(EXP_DIR, "hybrid_unified_latest.json");
    if (fs.existsSync(p)) return readJson(p);
  }
  const file = path.join(EXP_DIR, `${id}.json`);
  if (!fs.existsSync(file)) return null;
  return readJson(file);
}

app.get("/api/hybrid-unified", (_req, res) => {
  res.json({ runs: listHybridUnifiedRuns() });
});

app.get("/api/hybrid-unified/:id", (req, res) => {
  const data = hybridUnifiedPayload(req.params.id);
  if (!data) {
    return res.status(404).json({ error: "hybrid unified run not found", id: req.params.id });
  }
  res.json(data);
});

app.get("/api/smoke", async (_req, res) => {
  try {
    const r = await fetch(`${DASHBOARD_URL}/api/state`, { signal: AbortSignal.timeout(3000) });
    if (!r.ok) throw new Error(`dashboard ${r.status}`);
    const data = await r.json();
    return res.json({ source: "valhalla_dashboard", ...data });
  } catch (e) {
    res.json({
      source: "fallback",
      message: "valhalla_dashboard not running — start with Valhalla: docs/valhalla/run_dashboard.sh",
      report: {
        hub_signals: 0,
        tile_completed: 0,
        stem_cells: 0,
        overall_pass: null,
      },
      error: String(e.message || e),
    });
  }
});

if (process.argv[1]?.endsWith("server.js")) {
  app.listen(PORT, () => {
    console.log(`valhalla-transformer API http://127.0.0.1:${PORT}`);
    console.log(`  GET  /api/health /api/experiments /api/bodies /api/progress`);
    console.log(`  GET  /api/fair-benchmark /api/fair-benchmark/:id`);
    console.log(`  GET  /api/hybrid-unified /api/hybrid-unified/:id`);
    console.log(`  GET  /api/tile-stemcell-cycles /api/tile-stemcell-cycles/:id`);
  });
}

export default app;
