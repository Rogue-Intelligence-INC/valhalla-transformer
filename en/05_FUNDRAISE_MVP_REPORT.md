# Valhalla Fundraise MVP Experiment Report

**Date**: 20260616_1143  |  **N**: 200  |  **Corpus**: large
**Bodies**: hub / tile / stemcell / triad (each + large corpus, c1)

## Summary (200Q)

| Arm | Body | Acc | Δ vs baseline | 95% CI |
|-----|------|-----|---------------|--------|
| baseline | triad | 24.50% | — | — |
| hub_c1 | hub | 23.50% | **-1.00 pp** | [-4.50, +2.50] |
| tile_c1 | tile | 23.50% | **-1.00 pp** | [-3.50, +1.50] |
| stemcell_c1 | stemcell | 23.50% | **-1.00 pp** | [-3.50, +1.50] |
| triad_c1 | triad | 24.50% | **+0.00 pp** | [-2.00, +2.00] |
| transformer_0.5b | HF | **68.00%** | — | — |

## By score_type

| score_type | baseline | hub | tile | stem | triad | Transformer |
|------------|----------|-----|------|------|-------|-------------|
| mcq | 17.19% | 14.06% | 14.06% | 14.06% | 17.19% | 32.81% |
| numeric | 61.02% | 61.02% | 61.02% | 61.02% | 61.02% | 71.19% |
| open | 2.60% | 2.60% | 2.60% | 2.60% | 2.60% | 94.81% |

## Fundraise MVP verdict

- **Body separation complete**: hub / tile / stemcell / triad each with native ingress + decode
- Baseline remains triad without corpus (same protocol as 48Q)
- Transformer replacement — **not met**; numeric wedge see table above

JSON: `experiments/fundraise_mvp_20260616_1143.json`
