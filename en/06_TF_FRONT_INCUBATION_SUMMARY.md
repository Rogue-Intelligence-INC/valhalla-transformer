# TF-Front Cumulative Patch — Hub / Tile / StemCell Separate Report

**Latest Run**: `20260618_0231` · full patch · strength 0.02  
**JSON**: `experiments/tf_front_body_matrix_pilot_*.json`  
**Principle**: **Do not treat Valhalla as one monolith** — ingress, export, LLM surgery, and QA effects are reported **per Hub / Tile / StemCell pipeline**.

---

## Three-body roles (experiment design)

| Body | Ingress produces | Full patch targets on LLM |
|------|------------------|---------------------------|
| **Hub** | Fate quad routing `hub_routed`, prefs, `patch_vector` (**no** tiles / stem cells) | All dual LN × quad scale + prefs additive; embeds; lm_head |
| **Tile** | **93** completed tile signatures, per-layer additive pattern (**no** stem) | Dual LN × scale + **tile signature** additive; embeds; lm_head |
| **StemCell** | **193** cells, energy-weighted quad scales, stem signatures (**no** tiles) | Dual LN + stem sig; **mlp.gate_proj row 0**; embeds; lm_head |

Code: `Valhalla/tools/tier_a_tf_front/patch_full.py` · export: `valhalla_model_export --body hub|tile|stemcell`

---

## Hub

### Ingress signature (pilot corpus)

- `tile_count = 0`, `stem_cell_count = 0`
- `quad_layer_scales ≈ [0.99996, 1.00001, …]` — near-neutral Fate routing
- Most **global** signal: single `patch_vector` + quad prefs

### Three protocols × three runs

| Run | patch | s | tf_front_cum | direct_cum | fresh_reload |
|-----|-------|---|--------------|------------|--------------|
| 1234 | legacy | 0.08 | 50% · 0 | 50% · 0 | 50% · 0 |
| 0222 | full | 0.08 | **16.7% · -33.3** | 25% · -25 | 33.3% · -16.7 |
| 0231 | full | 0.02 | 33.3% · -16.7 | 33.3% · -16.7 | **50% · 0** |

### Hub progress (per-question QA)

**No `improved` flips on Hub across legacy / full runs.**

- GSM_03 stays `45` ❌ — Hub does **not** induce notebook/pen step reasoning
- Contrast with Tile/StemCell legacy +8.33 pp: **global Fate patch does not shift this decode path**

### Hub regression (per-question QA)

Full 0.08 `hub_tf_front_cumulative` (worst arm):

| ID | Ref | Baseline | Hub final | Pattern |
|----|-----|----------|-----------|---------|
| GSM_04 | 28 | `28` ✅ | `19` ❌ | short numeric drift |
| MATH_01 | 391 | `391` ✅ | `401` ❌ | product drift |
| MATH_02 | 12 | `12` ✅ | `10` ❌ | short numeric |
| MCQ_PHYS_01 | B | `B` ✅ | prose, no letter ❌ | MCQ format break |

Full 0.02 cumulative: GSM_04 (28→58), MATH_01 (391→561); **fresh_reload holds 50% like Tile/Stem**.

### Hub summary

| | |
|--|--|
| Ingress | Pure Fate global vector, no blocks/cells |
| legacy | **Flat** all protocols, no per-item gain |
| full | **Earliest, deepest** regression (global lm_head + LN) |
| Protocol | tf_front ≡ direct (LLM front **no Hub-specific lift**) |

---

## Tile

### Ingress signature

- `tile_count = 93`, `stem_cell_count = 0`
- `quad_layer_scales = [1.0, …]` (tile export does not lift quads)
- **33 block signatures** → per-layer input/post LN **differentiated additive** (full patch)

### Three protocols × three runs

| Run | patch | s | tf_front_cum | direct_cum | fresh_reload |
|-----|-------|---|--------------|------------|--------------|
| 1234 | legacy | 0.08 | **58.3% · +8.33** | **58.3% · +8.33** | 50% · 0 |
| 0222 | full | 0.08 | 33.3% · -16.7 | 25% · -25 | 41.7% · -8.3 |
| 0231 | full | 0.02 | 41.7% · -8.3 | 41.7% · -8.3 | **50% · 0** |

### Tile progress (per-question QA)

#### Main gain — GSM_03 (legacy 0.08 · direct & tf_front · +8.33 pp · **zero regression**)

**Prompt**: 5 notebooks × $3 + 2 pens × $1.50, total cost?

| | Baseline | After Tile patch |
|--|----------|------------------|
| Output | `45` | \(5×3=15\) + \(2×1.50=3\) → **18** |
| Protocols | — | `tile_direct_cumulative`, `tile_tf_front_cumulative` identical |

**Rounds** (`tile_direct_cumulative`): r0=45 → r1=46 → **r2=18** → r3=18

**Tile mechanism**: block signatures spread across layer LN — **local perturbation** flips decode from one number to two-step multiplication; `small` corpus has no prompt text → **structure-induced path alignment**.

#### Secondary — MCQ_PHYS_02 (full 0.08 · `tile_tf_front_cumulative`)

| | Baseline | Tile final |
|--|----------|------------|
| Output | long text, no letter | **B) 9.8 m/s²** ✅ |
| Net | — | same arm regresses GSM_04/MATH_01/MCQ_PHYS_01 → 33.3% |

### Tile regression

Full cumulative: **GSM_04** 28→54/58 (**round 3** flip; rounds 1–2 often still 50%)  
Full 0.08 direct: also MATH_01, MCQ_PHYS_01

### Tile summary

| | |
|--|--|
| Ingress | 93 blocks + per-layer signatures |
| legacy | **Stable +8.33 pp** (GSM_03); tf_front ≡ direct |
| full | **Latest** regression timeline; MCQ_PHYS_02 can flip |
| Protocol | fresh_reload 0.02 holds; cumulative is risk channel |

---

## StemCell

### Ingress signature

- `tile_count = 0`, `stem_cell_count = 193` (pilot ~144–193 per round)
- `quad_layer_scales ≈ [1.0015, …]` (**energy-weighted**, uniform lift)
- Stem signatures + **gate_proj row 0** (full patch only)

### Three protocols × three runs

| Run | patch | s | tf_front_cum | direct_cum | fresh_reload |
|-----|-------|---|--------------|------------|--------------|
| 1234 | legacy | 0.08 | **58.3% · +8.33** | **58.3% · +8.33** | 50% · 0 |
| 0222 | full | 0.08 | 33.3% · -16.7 | 33.3% · -16.7 | 41.7% · -8.3 |
| 0231 | full | 0.02 | 41.7% · -8.3 | 33.3% · -16.7 | **50% · 0** |

### StemCell progress (per-question QA)

#### Main gain — GSM_03 (legacy 0.08 · same shape as Tile)

| | Baseline | After StemCell patch |
|--|----------|----------------------|
| Output | `45` | step notebook/pen → **18** ✅ |
| Arms | — | `stemcell_direct_cumulative`, `stemcell_tf_front_cumulative` |

Same output **shape** as Tile (two products then sum) — different ingress (cell energy vs block sig) → **both pipelines can induce the same reasoning format**.

#### GSM_03 — full 0.08 `stemcell_tf_front_cumulative`

45→18 ✅ but regresses GSM_04/MATH_01/MCQ_PHYS_01 → net -16.7 pp.

#### MCQ_CHEM_02 — full 0.08 `stemcell_direct_cumulative`

| | Baseline | StemCell final |
|--|----------|----------------|
| Output | `ABCD` hallucination | **B. H2O** ✅ |
| Net | — | same arm regresses three items → 33.3% |

**Stem-specific**: chemical formula MCQ flip (Tile did not flip this item); aligns with **gate_proj + cell signatures** for formula-style outputs.

### StemCell regression

Like Tile: GSM_04 primary; full 0.02 direct also MATH_01 (391→561). Hub hurts MATH_01 more broadly than Stem.

### StemCell summary

| | |
|--|--|
| Ingress | 193 cells + energy micro-lift on quads |
| legacy | GSM_03 +8.33 pp, **ties Tile as best** |
| full | GSM_03 + MCQ_CHEM_02 gains; cumulative net negative |
| vs Tile | MCQ chem formula flips favor Stem; direct 0.02 slightly worse than Tile |

---

## Cross-body comparison

| Dimension | Hub | Tile | StemCell |
|-----------|-----|------|----------|
| Ingress structure | Fate global | 93 block sigs | 193 cells |
| legacy GSM_03 | ❌ | ✅ +8.33 pp | ✅ +8.33 pp |
| legacy best final | 50% | **58.3%** | **58.3%** |
| full worst final | **16.7%** | 25% | 33.3% |
| full item gains | none | MCQ_PHYS_02 | GSM_03 + MCQ_CHEM_02 |
| full main regression | 4 items | GSM_04 (latest) | GSM_04 + MATH_01 |
| fresh_reload 0.02 | 50% hold | 50% hold | 50% hold |
| LLM front vs direct | **same** | **same** | **same** |

**Shared baseline wrong items** (all three): GSM_01, GSM_02, MCQ_PHYS_02 (except Tile full single flip), MCQ_CHEM_01 — **gains do not generalize across bodies**.

---

## Per-body synthesis (not monolithic Valhalla)

1. **Hub**: global lm_head + Fate vector → breaks **short numeric / single-letter** baseline correct; **no** GSM_03 reasoning gain.
2. **Tile**: block signatures **spread across LN** → **stable legacy GSM_03 gain**; longest full-patch regression timeline.
3. **StemCell**: cells + gate_proj → **same math gain shape as Tile** + **unique MCQ chem formula** flip; energy quad lift adds slight global perturbation.
4. **Protocol (all three)**: cumulative compound > single-round full; fresh_reload holds; LLM front does not change body ranking.
5. **Corpus**: `small` has no GSM prompts — all body gains are **decode-path** effects, not prompt memorization.

---

*Rogue Intelligence LNC. · Hub / Tile / StemCell separate report · valhalla-transformer*
