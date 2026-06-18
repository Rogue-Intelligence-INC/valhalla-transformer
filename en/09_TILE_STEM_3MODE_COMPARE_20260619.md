# Tile / StemCell 三模式对照（79 题 · 20260619_0226）

**Run**: `20260619_0226` · legacy@0.08 · full@0.02 · **total@0.015**  
**Baseline**: 54.43%（43/79）

## 全集 acc（direct_cumulative）

| Body | legacy | full | **total** |
|------|--------|------|-----------|
| **Tile** | **55.70% (+1.27)** | 51.90% (-2.53) | 53.16% (-1.27) |
| **StemCell** | 54.43% (0) | 54.43% (0) | 54.43% (0) |

**结论**：**legacy 仍最佳**（Tile +1.27 pp）；**total 未超越 legacy**，与 full 接近；Stem 三模式全集持平。

## 切片 Δ（direct · pp）

| Body | 切片 | legacy | full | total |
|------|------|--------|------|-------|
| Tile | core | **+8.3** | -8.3 | -8.3 |
| Tile | math_word | **+6.5** | -3.2 | -3.2 |
| Tile | math_num | 0 | **+5.0** | **+5.0** |
| Tile | mcq_sci | -12.5 | -12.5 | -12.5 |
| Tile | mcq_xdom | **+8.3** | 0 | **+8.3** |
| Stem | core | **+8.3** | -8.3 | -8.3 |
| Stem | math_word | **+6.5** | +3.2 | +3.2 |
| Stem | math_num | **+5.0** | **+5.0** | **+5.0** |
| Stem | mcq_sci | -18.8 | -12.5 | -12.5 |

**total 改写全 decoder** 后：core 切片仍 **-8.3 pp**（打掉短答案）；math_num **+5 pp** 与 full 同；**未复现 legacy 的 math_word +6.5 pp**。

## Tile direct 进步题（按模式）

| mode | improved | regressed |
|------|----------|-----------|
| legacy | GSM_03, GSM_F26, MATH_F03, MCQ_F03, MCQ_PHIL_01 | 4 |
| full | GSM_F26, MATH_F09 | 4 |
| total | GSM_F26, MATH_F09, MCQ_F03 | 4 |

GSM_03（45→18）仅在 **legacy** 翻正；total/full 未 flip GSM_03。

## 解读

1. **完全改模型（total）≠ 更好 QA**：attn+MLP+全词表 embed 扰动后，全集不如 legacy 轻量 patch。
2. **legacy 优势在应用题**：math_word +6.5 pp 仅 legacy 保持；total/full 伤 core 短答案。
3. **纯算一致**：三模式 math_numeric 均 **+5 pp**（Stem legacy/full/total 同）。
4. **理科 MCQ 全崩**：三模式 mcq_science 均为负（-12.5 ~ -18.8 pp）。

JSON: `experiments/tile_stemcell_hard_20260619_0226.json`
