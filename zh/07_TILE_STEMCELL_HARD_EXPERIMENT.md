# Tile / StemCell 高难度多维度实验

**Run**: `20260619_0226` · patch legacy@0.08, full@0.02, total@0.015
**全集**: 79 题 · 语料 medium 56 行 · 3 轮

## 评测切片

| 切片 | 难度 | 题数 | 说明 |
|------|------|------|------|
| `core_pilot` | baseline | 12 | 核心 12 题（pilot 对照） |
| `math_word_all` | hard | 31 | 应用题全集（31） |
| `math_numeric_hard` | hard | 20 | 纯算高难度（20） |
| `mcq_science` | medium | 16 | 理科 MCQ（16） |
| `mcq_cross_domain` | medium | 12 | 跨域 MCQ（12） |

## 按 Body × 协议（全集 acc）

| Arm | patch | Baseline | Final | Δ |
|-----|-------|----------|-------|---|
| tile_direct_cumulative | legacy | 54.43% | 55.70% | +1.27 pp |
| tile_tf_front_fresh_reload | legacy | 54.43% | 53.16% | -1.27 pp |
| stemcell_direct_cumulative | legacy | 54.43% | 54.43% | +0.00 pp |
| stemcell_tf_front_fresh_reload | legacy | 54.43% | 54.43% | +0.00 pp |
| tile_direct_cumulative | full | 54.43% | 51.90% | -2.53 pp |
| tile_tf_front_fresh_reload | full | 54.43% | 51.90% | -2.53 pp |
| stemcell_direct_cumulative | full | 54.43% | 54.43% | +0.00 pp |
| stemcell_tf_front_fresh_reload | full | 54.43% | 53.16% | -1.27 pp |
| tile_direct_cumulative | total | 54.43% | 53.16% | -1.27 pp |
| tile_tf_front_fresh_reload | total | 54.43% | 51.90% | -2.53 pp |
| stemcell_direct_cumulative | total | 54.43% | 54.43% | +0.00 pp |
| stemcell_tf_front_fresh_reload | total | 54.43% | 53.16% | -1.27 pp |

## 按切片 Δ（pp）— direct_cumulative · full

| Body | core | math_word | math_num | mcq_sci | mcq_xdom |
|------|------|-----------|----------|---------|----------|
| tile | -8.3 | -3.2 | +5.0 | -12.5 | +0.0 |
| stemcell | -8.3 | +3.2 | +5.0 | -12.5 | +0.0 |

## 按切片 Δ（pp）— direct_cumulative · total

| Body | core | math_word | math_num | mcq_sci | mcq_xdom |
|------|------|-----------|----------|---------|----------|
| tile | -8.3 | -3.2 | +5.0 | -12.5 | +8.3 |
| stemcell | -8.3 | +3.2 | +5.0 | -12.5 | +0.0 |

## 按切片 Δ（pp）— direct_cumulative · legacy

| Body | core | math_word | math_num | mcq_sci | mcq_xdom |
|------|------|-----------|----------|---------|----------|
| tile | +8.3 | +6.5 | +0.0 | -12.5 | +8.3 |
| stemcell | +8.3 | +6.5 | +5.0 | -18.8 | +0.0 |

## 进步 / 退步（全集）

- **tile_direct_cumulative**: improved ['GSM_03', 'GSM_F26', 'MATH_F03', 'MCQ_F03', 'MCQ_PHIL_01'] · regressed ['MATH_F02', 'MCQ_F07', 'MCQ_F09', 'MCQ_F10']
- **tile_tf_front_fresh_reload**: improved ['GSM_F26'] · regressed ['MCQ_F07', 'MCQ_F10']
- **stemcell_direct_cumulative**: improved ['GSM_03', 'GSM_F26', 'MATH_F03', 'MATH_F14'] · regressed ['MATH_F02', 'MCQ_F05', 'MCQ_F07', 'MCQ_F09']
- **stemcell_tf_front_fresh_reload**: improved ['GSM_F26'] · regressed ['MCQ_F07']
- **tile_direct_cumulative**: improved ['GSM_F26', 'MATH_F09'] · regressed ['GSM_04', 'GSM_05', 'MCQ_BIO_01', 'MCQ_F10']
- **tile_tf_front_fresh_reload**: improved — · regressed ['MCQ_F07', 'MCQ_F10']
- **stemcell_direct_cumulative**: improved ['GSM_F06', 'GSM_F26', 'MATH_F09', 'MCQ_F03'] · regressed ['GSM_04', 'MCQ_F07', 'MCQ_F09', 'MCQ_F10']
- **stemcell_tf_front_fresh_reload**: improved ['GSM_F26'] · regressed ['MCQ_F07', 'MCQ_F10']
- **tile_direct_cumulative**: improved ['GSM_F26', 'MATH_F09', 'MCQ_F14'] · regressed ['GSM_04', 'GSM_05', 'MCQ_BIO_01', 'MCQ_F10']
- **tile_tf_front_fresh_reload**: improved — · regressed ['MCQ_F07', 'MCQ_F10']
- **stemcell_direct_cumulative**: improved ['GSM_F06', 'GSM_F26', 'MATH_F09', 'MCQ_F03'] · regressed ['GSM_04', 'MCQ_F07', 'MCQ_F09', 'MCQ_F10']
- **stemcell_tf_front_fresh_reload**: improved ['GSM_F26'] · regressed ['MCQ_F07', 'MCQ_F10']

---

## 三模式对照 Run 20260619_0226

（direct_cumulative）

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
