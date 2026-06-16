# Valhalla vs Transformer — Brief Intro

**Version**: 1.3 · **Date**: 2026-06-16  
**Viz**: `viz/` · **Test API**: `api/` · **Rogue Intelligence LNC.**

---

## What we are

**Valhalla** is a private **AI incubation runtime**: text → f64 signals → **Hub / Tile / StemCell** structure evolution → patch external models (Tier A) or **native decode** (Tier B).

**Transformer** remains the strong baseline for general language. Valhalla does **not** claim overall replacement.

---

## Progress vs regression

| Dimension | **Progress** | **Not progress / regression** |
|-----------|--------------|-------------------------------|
| Methodology | 200Q + body split + CI + Transformer benchmark | — |
| Engineering | Tier B `valhalla_native_qa` end-to-end, no HF | — |
| Structure signal | Tier A: triad patch beats random (-2.08 vs -14.58 pp) | Tier A strict **no net acc gain** |
| Numeric wedge | direct_math 100%; numeric **61%** vs TF **71%** | Overall **24.5% vs 68%** |
| Body separation | hub/tile/stem/triad each 200Q | Single body **23.5%**, -1pp vs triad |
| Corpus incubation | Honest 200Q Δ **0pp** (CI±2) | 48Q +2.08pp **invalid** |
| Open QA | — | **2.6% vs 94.8%** (no generative LM) |

> Paradigm and evidence chain progressed; **general benchmark capability** has not.

---

## What happens inside Hub / Tile / StemCell

Each corpus line is f64-encoded → `TriadSession::with_body(hub|tile|stemcell|triad)`:

| Module | Internal | Tier B role |
|--------|----------|-------------|
| **Hub** | Quad routing → `hub_routed[4]`; Fate → `hub_prefs` | Weighted memory + MCQ scoring |
| **Tile** | Block merge/split → `tile_signatures` | Numeric/cortex candidate weighting |
| **StemCell** | Cell merge/divide → `stem_signatures` | Numeric weighting |
| **Triad** | All three in parallel → `patch_vector` 256-d | MCQ stable; numeric identical across bodies at 200Q |

---

## Viz & test API

```bash
./scripts/start-dev.sh
# API  http://127.0.0.1:8780/api/health
# Vue  http://127.0.0.1:5173
```

See [02_INTRO_DETAILED.md](./02_INTRO_DETAILED.md) · [05_FUNDRAISE_MVP_REPORT.md](./05_FUNDRAISE_MVP_REPORT.md)

*BP / whitepaper (03/04) — local only, not pushed with this repo update.*

---

*Rogue Intelligence LNC. · v1.3 · 2026-06-16*
