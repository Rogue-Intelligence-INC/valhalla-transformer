# TF-Front Cumulative Patch — Experiment Summary

**Latest Run**: `20260618_0231` · full patch · strength 0.02  
**JSON**: `experiments/tf_front_body_matrix_pilot_*.json`

---

## Run sequence

| Run ID | Patch | strength | Summary |
|--------|-------|----------|---------|
| `20260617_1234` | legacy (input LN + anchor embed) | 0.08 | tile/stem/triad **direct +8.33 pp** (GSM_03); hub flat |
| `20260618_0222` | **full** (LN+embed+lm_head+stem gate) | 0.08 | all 9 arms **regressed**; hub cumulative worst 16.67% |
| `20260618_0231` | **full** | 0.02 | fresh_reload arms **hold 50%**; cumulative still slightly down |

---

## Progress: per-question detail

### A. Main gain — GSM_03 (legacy 0.08 · +8.33 pp · 5 arms)

**Prompt** (GSM_03 · math_word):

> A store sells 5 notebooks at $3 each and 2 pens at $1.50 each. What is the total cost? Answer with the final number.

**Reference**: `18`

| Stage | Model output | Extracted | Verdict |
|-------|--------------|-----------|---------|
| **Baseline** | `45` (single wrong number, no reasoning) | 45 | ❌ |
| **After patch** (final) | The total cost for the notebooks is \(5×3=15\) dollars, and the total cost for the pens is \(2×1.50=3\) dollars. Therefore, the combined total cost is \(15+3=18\) dollars. | 18 | ✅ |

**Arms with this improvement** (zero regression):

| Arm | Final acc | Δ |
|-----|-----------|---|
| `tile_tf_front_cumulative` | 58.33% | +8.33 pp |
| `tile_direct_cumulative` | 58.33% | +8.33 pp |
| `stemcell_tf_front_cumulative` | 58.33% | +8.33 pp |
| `stemcell_direct_cumulative` | 58.33% | +8.33 pp |
| `triad_direct_cumulative` | 58.33% | +8.33 pp |

**Round trajectory** (`tile_direct_cumulative`):

| Round | GSM_03 extracted | Verdict | Note |
|-------|------------------|---------|------|
| 0 baseline | 45 | ❌ | No multiplication steps |
| 1 | 46 | ❌ | Still wrong |
| 2 | 18 | ✅ | Notebook/pen step-by-step reasoning appears |
| 3 | 18 | ✅ | Stable correct |

**Mechanism**: `small` corpus has no notebook prompt text; gain comes from **LayerNorm scale shifting decode path** so 0.5B moves from “one wrong number” to “two products then sum” — **path alignment**, not corpus memorization. Hub arms never flip GSM_03 (all flat at 50%).

---

### B. Single-question gains under full patch 0.08 (net still negative)

Full patch also flips individual items **wrong→correct**, but breaks baseline-correct items in the same arm.

#### B1. GSM_03 — `stemcell_tf_front_cumulative` (full 0.08)

| | Output | Extracted |
|--|--------|-----------|
| Baseline | `45` | 45 ❌ |
| Final | notebook \(5×3=15\) + pen \(2×1.50=3\) → 18 | 18 ✅ |

Same arm regresses: `GSM_04` 28→54, `MATH_01` 391→561, `MCQ_PHYS_01` B→no letter → **final 33.33% (-16.67 pp)**.

#### B2. MCQ_PHYS_02 — `tile_tf_front_cumulative` (full 0.08)

**Prompt**:

> The acceleration due to gravity on Earth is approximately: A) 1.6 m/s² B) 9.8 m/s² C) 20 m/s² D) 98 m/s²

| | Output | Extracted |
|--|--------|-----------|
| Baseline | Long explanation, no option letter | None ❌ |
| Final | …Therefore, the correct answer is: **B) 9.8 m/s².** | B ✅ |

Same arm regresses: `GSM_04`, `MATH_01`, `MCQ_PHYS_01` → **final 33.33% (-16.67 pp)**.

#### B3. MCQ_CHEM_02 — `stemcell_direct_cumulative` (full 0.08)

**Prompt**:

> Water's chemical formula is: A) CO2 B) H2O C) O2 D) NaCl

| | Output | Extracted |
|--|--------|-----------|
| Baseline | formula is **ABCD** | None ❌ |
| Final | empirical formula H2O → **B. H2O** | B ✅ |

Same arm regresses: `GSM_04`, `MATH_01`, `MCQ_PHYS_01` → **final 33.33% (-16.67 pp)**.

---

### C. Baseline wrong items never fixed (gain did not spread)

Items **still wrong** after patch across legacy/full runs:

| ID | Prompt gist | Ref | Typical baseline output |
|----|-------------|-----|-------------------------|
| GSM_01 | Natalia clips April+May | 72 | May only = 24 |
| GSM_02 | Janet duck eggs revenue | 18 | `$48` |
| GSM_03 | 5 notebooks + 2 pens | 18 | `45` (**legacy tile/stem/triad only fixed**) |
| MCQ_PHYS_02 | Earth gravity options | B | explanation, no letter |
| MCQ_CHEM_01 | atom subatomic particles | C | `A` (hallucinated multi-choice) |
| MCQ_CHEM_02 | water formula options | B | `ABCD` or None |

Gain is **question-specific** (GSM_03 multiplication total); no cross-GSM or cross-MCQ systematic lift.

---

### D. Regression contrast — baseline-correct items broken (full patch risk)

| ID | Ref | Baseline | Typical full 0.02 final (hub cumulative) |
|----|-----|----------|------------------------------------------|
| GSM_04 | 28 | `24-6+10=28` ✅ | `58` ❌ |
| MATH_01 | 391 | `391` ✅ | `561` ❌ |
| MCQ_PHYS_01 | B | `B` ✅ | prose “Newton”, no letter ❌ |

Regression pattern: **short numeric / single-letter** outputs destabilize first; contrasts with GSM_03 gain (long reasoning chain).

---

## Full patch: three bodies fully modify LLM

| Body | Weight targets |
|------|----------------|
| **Hub** | All input/post LN × Fate quad scale; prefs additive; corpus token embeds; lm_head all rows |
| **Tile** | Dual LN × scale + Tile signature additive; corpus embeds; lm_head |
| **StemCell** | Dual LN × scale + Stem signature; mlp.gate_proj row 0; corpus embeds; lm_head |

Code: Valhalla monorepo `tools/tier_a_tf_front/patch_full.py`

---

## Latest matrix (20260618_0231 · 3 bodies × 3 protocols)

| Arm | Final | Δ |
|-----|-------|---|
| hub_tf_front_cumulative | 33.33% | -16.67 pp |
| hub_direct_cumulative | 33.33% | -16.67 pp |
| hub_tf_front_fresh_reload | 50.00% | +0.00 pp |
| tile_tf_front_cumulative | 41.67% | -8.33 pp |
| tile_direct_cumulative | 41.67% | -8.33 pp |
| tile_tf_front_fresh_reload | 50.00% | +0.00 pp |
| stemcell_tf_front_cumulative | 41.67% | -8.33 pp |
| stemcell_direct_cumulative | 33.33% | -16.67 pp |
| stemcell_tf_front_fresh_reload | 50.00% | +0.00 pp |

12 prompts · small corpus 24 lines · 3 rounds · strict MCQ

---

## Synthesis (full architecture retained)

1. **Task misalignment**: pilot corpus is general STEM facts, not GSM/MATH prompts.
2. **Asymmetric gain/loss**: progress on GSM_03 / select MCQ format; regression on fragile baseline-correct items.
3. **Cumulative compound**: round 2 often still 50%; round 3 flips GSM_04; fresh_reload holds.
4. **Body asymmetry**: Hub most global; Tile 33 per-layer blocks, latest GSM_03 timeline.
5. **LLM front**: hub tf_front matches direct; cumulative enrich uses patched model (feedback loop).
6. **Small n**: ±8.33 pp = 1 question; legacy +8.33 pp = **GSM_03 only**.

---

*Rogue Intelligence LNC. · valhalla-transformer*
