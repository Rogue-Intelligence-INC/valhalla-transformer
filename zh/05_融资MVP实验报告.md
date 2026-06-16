# Valhalla Fundraise MVP 实验报告

**时间**: 20260616_1143  |  **题数**: 200  |  **语料**: large
**Body 分离**: hub / tile / stemcell / triad（各 + large corpus, c1）

## 1. 总览（200Q）

| Arm | Body | Corpus | Acc | Correct | Δ vs baseline | 95% CI |
|-----|------|--------|-----|---------|---------------|--------|
| baseline_no_corpus | triad | no | 24.50% | 49/200 | — | — |
| hub_c1 | hub | yes | 23.50% | 47/200 | **-1.00 pp** | [-4.50, +2.50] |
| tile_c1 | tile | yes | 23.50% | 47/200 | **-1.00 pp** | [-3.50, +1.50] |
| stemcell_c1 | stemcell | yes | 23.50% | 47/200 | **-1.00 pp** | [-3.50, +1.50] |
| triad_c1 | triad | yes | 24.50% | 49/200 | **+0.00 pp** | [-2.00, +2.00] |
| **transformer_0.5b** | HF | — | **68.00%** | 136/200 | — | — |

## 2. 分题型（各 Body vs Transformer）

| score_type | baseline | hub | tile | stem | triad | Transformer |
|------------|----------|-----|------|------|-------|-------------|
| mcq | 17.19% | 14.06% | 14.06% | 14.06% | 17.19% | 32.81% |
| numeric | 61.02% | 61.02% | 61.02% | 61.02% | 61.02% | 71.19% |
| open | 2.60% | 2.60% | 2.60% | 2.60% | 2.60% | 94.81% |

## 3. 融资 MVP 结论

- **Body 分离已跑**: Hub / Tile / StemCell / Triad 各自 ingress + 原生解码
- **baseline** 仍为 triad 无语料（与 48Q 协议一致）
- **替代 Transformer ✗**；**数值子域**见上表 numeric 行

JSON: `/home/jouly/AI/Valhalla/reports/body_experiments/fundraise_mvp_20260616_1143.json`
