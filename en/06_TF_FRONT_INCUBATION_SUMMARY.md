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

## Regression analysis (full architecture retained)

1. **Task misalignment**: pilot corpus is general STEM facts, not GSM/MATH prompts; patch optimizes Valhalla structure, not QA labels.
2. **Asymmetric failure**: full patch **breaks baseline-correct** items (GSM_04, MATH_01) rather than fixing GSM_01–03.
3. **Cumulative compound**: rounds 1–2 often flat at 50%; round 3 flips; fresh_reload holds baseline.
4. **Body asymmetry**: Hub most global, regresses earliest; Tile has 33 per-layer blocks, regresses latest.
5. **LLM front**: hub tf_front matches direct; cumulative enrich uses already-patched model (feedback loop).
6. **Small n**: 1 question = 8.33 pp; legacy +8.33 pp = single GSM_03 flip.

---

*Rogue Intelligence LNC. · valhalla-transformer*
