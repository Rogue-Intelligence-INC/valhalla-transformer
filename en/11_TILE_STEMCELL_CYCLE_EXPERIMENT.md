# Tile / StemCell Multi-Cycle Optimization Experiment

**Run**: `20260620_1032` (test 145Q) · `20260620_1027` (smoke 12Q)  
**Corpus**: Fair ingest_clean 49 lines · Artifact `3beed48570c4`  
**Full report**: Valhalla monorepo `reports/VALHALLA_TILE_STEMCELL_MULTI_CYCLE_EXPERIMENT_20260620.md`

---

## 1. Research question

Does increasing `optimize_cycles` (1→5→10→20) improve **Tile / StemCell** structure and QA accuracy on the **Fair Benchmark** decontaminated corpus?

---

## 2. Protocols

| Protocol | Description |
|----------|-------------|
| **export** | Structure fingerprint: patch_hash, tile/stem counts, cycle_trace |
| **isolated** | Per-question incubation: `corpus_cycles=N` |
| **batch** | Single incubation, many questions (smoke only; test uses isolated) |

**Bodies**: `tile` or `stemcell` only (no triad fusion).

---

## 3. Structure (test)

| Body | patch_hash c1→c20 | Scale |
|------|-------------------|-------|
| **Tile** | **Unchanged** `2ff181b3…` | 177 tiles / 0 stem |
| **StemCell** | **Changes** (4 distinct hashes) | 0 tiles / 277 stem |

**Mechanism**:

- Tile: `has_fate_converged()` early-break after cycle 1 → c5–c20 are no-ops.
- StemCell: `evolve` drifts patch vector; cell count already at equilibrium.

---

## 4. QA (test · 145Q · isolated)

| Arm | acc | numeric | mcq | open | Δ c1→c20 |
|-----|-----|---------|-----|------|----------|
| tile | 34.5% | 57.9% | 28.3% | 24.6% | **+0.00 pp** |
| stemcell | 35.2% (c20) | 57.9% | 28.3% | 26.2% | **+0.69 pp** [0, 2.07] |

StemCell lift is **open-only**; CI includes zero.

---

## 5. Fair Benchmark context (same corpus 145Q)

| Arm | acc |
|-----|-----|
| baseline_no_corpus | 20.0% |
| **tile / stem isolated c1** | **34.5%** |
| triad_c1 | 35.9% |
| triad_c1_persistent | **40.7%** |
| patch_stemcell_legacy (Tier A) | **69.0%** |
| Qwen generate | 71.0% |

Extra cycles **do not** replace persistent session (+6.2 pp) or Tier A patch (+34.5 pp).

---

## 6. Smoke · batch

| Protocol | tile c1→c20 | stem c1→c20 |
|----------|-------------|-------------|
| isolated | 75.0% → 75.0% | 75.0% → 75.0% |
| batch | 83.3% → 83.3% | 83.3% → 83.3% |

Batch beats isolated (+8.3 pp); **cycles still flat within batch**.

---

## 7. Product takeaway

| Works | Does not |
|-------|----------|
| One-shot artifact, many queries | Blindly raising optimize_cycles |
| Persistent / batch session | Empty multi-cycle spins on single body |
| Tier A patch + generate | Expecting StemCell patch drift to move Tier B QA |

---

## 8. Reproduce

```bash
python3 tools/fair_benchmark/run_tile_stemcell_cycle_experiment.py \
  --phase test --protocols export,isolated \
  --artifact checkpoints/incubation_artifacts/fair_triad_c1/
```

JSON: `experiments/tile_stemcell_cycles_latest.json` · API: `GET /api/tile-stemcell-cycles`

---

*Rogue Intelligence LNC. · v1.7 · 2026-06-20*
