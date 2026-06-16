# Valhalla Fundraise MVP Experiment Report (Detailed)

**Date**: 20260616_1143 · **N**: 200 · **Corpus**: large (143 lines)  
**Protocol**: Tier B native · strict MCQ · 5-arm body separation  
**JSON**: `reports/body_experiments/fundraise_mvp_20260616_1143.json`

---

## Executive summary

**Paradigm and evidence chain progressed** (200Q, body split, CI, Transformer benchmark). **Overall capability did not** (24.5% vs 68%). Numeric subdomain shows structural decode signal (61%); open is effectively unusable (2.6%). The 48Q triad +2.08pp corpus gain **does not replicate** at 200Q — small-sample noise, not product capability.

---

## 1. Results (200Q)

| Arm | Body | Acc | Δ vs baseline | 95% CI |
|-----|------|-----|---------------|--------|
| baseline_no_corpus | triad | 24.50% | — | — |
| hub_c1 | hub | 23.50% | -1.00 pp | [-4.50, +2.50] |
| tile_c1 | tile | 23.50% | -1.00 pp | [-3.50, +1.50] |
| stemcell_c1 | stemcell | 23.50% | -1.00 pp | [-3.50, +1.50] |
| triad_c1 | triad | 24.50% | 0 pp | [-2.00, +2.00] |
| transformer_0.5b | HF | **68.00%** | — | — |

---

## 2. Where we progressed

### Methodology (fundraise-ready)

- **200Q + bootstrap CI** — triad Δ 0pp, CI [-2,+2]; stronger than 48Q claims  
- **Body separation at scale** — hub/tile/stem/triad each 200Q (first time)  
- **Same-prompt Transformer anchor** — Qwen2.5-0.5B 68%  
- **Tier B end-to-end** — no HF forward; `valhalla_native_qa`  
- **Strict scoring** — early +4.17pp MCQ false positives eliminated  

### Capability wedge: numeric

| decode_path | baseline |
|-------------|----------|
| direct_math | **26/26 (100%)** |
| word_problem | **4/4 (100%)** |
| cortex | 6/29 (20.7%) |
| **numeric total** | **36/59 (61.0%)** vs Transformer **71.2%** |

Numeric gap ~10pp; open gap ~92pp. Narrative: **structured reasoning subdomain**, not general QA.

### Tier A (48Q reference)

Valhalla triad patch (-2.08pp) beats random patch (-14.58pp) — structure carries information.

---

## 3. Where we did not / why

### Overall 24.5% vs 68%

1. **No generative LM in Tier B** — open 2/77 (2.6%) vs Transformer 94.8%  
2. **MCQ via retrieval** — 17.2% vs 32.8%  
3. **Knowledge scale mismatch** — 0.5B pretraining vs ingress+retrieve+rules  

### Corpus Δ 0pp at 200Q

triad_c1 identical to baseline on **196/200** questions. Four open flips (+2/-2 = 0). Large corpus shifts retrieval but not numeric/MCQ.

48Q +2.08pp = **small-sample noise** (CI includes zero at 200Q).

### Single body -1pp vs triad

16 questions differ across bodies (12 MCQ, 4 open). Hub alone flips most MCQ (Fate-weighted retrieval). Triad preserves baseline MCQ; numeric identical across all bodies.

---

## 4. By score_type

| type | n | Tier B triad | Transformer |
|------|---|--------------|-------------|
| numeric | 59 | 61.02% | 71.19% |
| mcq | 64 | 17.19% | 32.81% |
| open | 77 | 2.60% | 94.81% |

---

## 5. Fundraise verdict

| Dimension | Status |
|-----------|--------|
| Paradigm MVP | ✓ |
| Body separation | ✓ |
| Transformer replacement | ✗ |
| Stable corpus gain | ✗ at 200Q |
| Numeric wedge | △ demonstrable |

---

## 6. Say / do not say

**Say:** 200Q native loop; body separation; numeric 61% vs 71%; Tier A beats random; honest CI on corpus.

**Do not say:** stable +2.08pp gain; Transformer replacement; hub-alone is best.

---

*Rogue Intelligence LNC. · 20260616_1143*
