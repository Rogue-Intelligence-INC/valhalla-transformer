# Valhalla Fundraise MVP Report (200 Questions)

**Version**: 1.1 · **Date**: 20260616_1129 · **Rogue Intelligence LNC.**

> Summary JSON: `experiments/fundraise_mvp_20260616_1129.json`

---

## 1. Why 200 Questions

48Q gives ±2.08 pp per question — too noisy for investors. Fundraise MVP scales to **200Q** (59 numeric / 64 MCQ / 77 open), large corpus, plus:

- Tier B native vs **same-question Transformer 0.5B**
- **Bootstrap 5000×** paired 95% CI

---

## 2. Overview

| System | Acc | Correct |
|--------|-----|---------|
| Tier B baseline (no corpus) | **24.50%** | 49/200 |
| Tier B triad + large corpus | **24.50%** | 49/200 |
| **Qwen2.5-0.5B Transformer** | **68.00%** | 136/200 |

**Corpus gain**: +0.00 pp · **95% CI**: [-2.00, +2.00] pp — **not significant at 200Q**

---

## 3. By Question Type

| score_type | Tier B native | Transformer 0.5B |
|------------|---------------|------------------|
| **numeric** | **61.02%** | 71.19% |
| mcq | 17.19% | 32.81% |
| open | 2.60% | 94.81% |

**Key insight**: smallest gap on **numeric** (rule/Cortex path); largest on **open** (retrieval vs generation).

---

## 4. Fundraise MVP Verdict

| Criterion | Met? |
|-----------|------|
| 200Q + CI + Transformer benchmark | ✓ |
| Overall Transformer replacement | ✗ |
| Significant corpus incubation gain | ✗ |
| Honest pitch: "61% numeric native" | ✓ |
| Claim "replaced Transformer" | ✗ |

---

## Reproduce

```bash
python3 tools/valhalla_model_bridge/build_fundraise_prompts.py
python3 tools/valhalla_model_bridge/run_fundraise_mvp.py
```

---

*Proprietary · Rogue Intelligence LNC.*
