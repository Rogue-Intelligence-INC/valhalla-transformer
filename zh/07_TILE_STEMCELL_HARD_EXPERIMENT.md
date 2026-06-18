# Tile / StemCell 高难度多维度实验

**Run**: `20260619_0213` · 79 题 · medium 语料 56 行 · 3 轮  
**JSON**: `experiments/tile_stemcell_hard_20260619_0213.json`  
**范围**: 仅 **Tile**、**StemCell**（不含 Hub / 单体 Valhalla）

---

## 评测设计（5 切片）

| 切片 | 难度 | 题数 | 内容 |
|------|------|------|------|
| `core_pilot` | 对照 | 12 | pilot 核心题 |
| `math_word_all` | hard | 31 | 全部应用题 GSM + GSM_F |
| `math_numeric_hard` | hard | 20 | MATH + MATH_F01–F16 |
| `mcq_science` | medium | 16 | 物理/化学/生物 + MCQ_F01–10 |
| `mcq_cross_domain` | medium | 12 | 史地经 CS 哲学等 MCQ |

**对照协议**: `direct_cumulative` · `tf_front_fresh_reload`  
**对照 patch**: legacy@0.08 vs full@0.02

**Baseline（全集 79 题）**: **54.43%**（43/79）

---

## Tile

### Ingress

- `tile_count = 93` · `stem_cell_count = 0` · quad scales ≈ 1.0

### 全集 acc

| 协议 | patch | Final | Δ | Improved | Regressed |
|------|-------|-------|---|----------|-----------|
| direct_cumulative | **legacy 0.08** | **55.70%** | **+1.27 pp** | GSM_03, GSM_F26, MATH_F03, MCQ_F03, MCQ_PHIL_01 | MATH_F02, MCQ_F07, MCQ_F09, MCQ_F10 |
| fresh_reload | legacy 0.08 | 53.16% | -1.27 pp | GSM_F26 | MCQ_F07, MCQ_F10 |
| direct_cumulative | full 0.02 | 51.90% | -2.53 pp | GSM_F26, MATH_F09 | GSM_04, GSM_05, MCQ_BIO_01, MCQ_F10 |
| fresh_reload | full 0.02 | 51.90% | -2.53 pp | — | MCQ_F07, MCQ_F10 |

### 切片 Δ（direct · pp）

| patch | core | math_word | math_num | mcq_sci | mcq_xdom |
|-------|------|-----------|----------|---------|----------|
| legacy 0.08 | **+8.3** | **+6.5** | 0.0 | **-12.5** | **+8.3** |
| full 0.02 | -8.3 | -3.2 | **+5.0** | -12.5 | 0.0 |

### Tile 进步 QA（legacy direct 代表）

| ID | 题干要点 | Baseline → Final |
|----|----------|------------------|
| **GSM_03** | 5 本 $3 + 2 笔 $1.50 | `45` → 分步推理 **18** ✅ |
| **GSM_F26** | 高难度应用题 | 错 → 对 ✅ |
| **MATH_F03** | 纯算 | 错 → 对 ✅ |
| **MCQ_F03** | 理科 MCQ | 错 → 对 ✅ |
| **MCQ_PHIL_01** | 跨域 MCQ | 错 → 对 ✅ |

### Tile 小结

- **legacy 累积**在 hard 集上仍 **+1.27 pp**，core 切片 **+8.3 pp**（与 pilot 一致方向）
- **math_word +6.5 pp** — 块签名对应用题有扩散增益
- **mcq_science -12.5 pp** — 理科 MCQ 大面积退步（MCQ_F07/F09/F10）
- **full 0.02** 全集退步，但 **math_numeric +5 pp**

---

## StemCell

### Ingress

- `tile_count = 0` · `stem_cell_count ≈ 193` · quad scales ≈ 1.0015

### 全集 acc

| 协议 | patch | Final | Δ | Improved | Regressed |
|------|-------|-------|---|----------|-----------|
| direct_cumulative | **legacy 0.08** | 54.43% | 0.00 pp | GSM_03, GSM_F26, MATH_F03, MATH_F14 | MATH_F02, MCQ_F05, MCQ_F07, MCQ_F09 |
| fresh_reload | legacy 0.08 | 54.43% | 0.00 pp | GSM_F26 | MCQ_F07 |
| direct_cumulative | **full 0.02** | 54.43% | 0.00 pp | GSM_F06, GSM_F26, MATH_F09, MCQ_F03 | GSM_04, MCQ_F07, MCQ_F09, MCQ_F10 |
| fresh_reload | full 0.02 | 53.16% | -1.27 pp | GSM_F26 | MCQ_F07, MCQ_F10 |

### 切片 Δ（direct · pp）

| patch | core | math_word | math_num | mcq_sci | mcq_xdom |
|-------|------|-----------|----------|---------|----------|
| legacy 0.08 | **+8.3** | **+6.5** | **+5.0** | -18.8 | 0.0 |
| full 0.02 | -8.3 | **+3.2** | **+5.0** | -12.5 | 0.0 |

### StemCell 进步 QA（legacy direct）

| ID | 说明 |
|----|------|
| **GSM_03** | 同 Tile：`45` → **18** 分步推理 |
| **GSM_F26** | 高难度应用题翻正 |
| **MATH_F03** | 纯算翻正 |
| **MATH_F14** | 纯算翻正（**Stem 独有**，Tile 未 flip） |

### StemCell 小结

- legacy 全集持平但 **切片分化**：core +8.3、math_word +6.5、**math_num +5.0**
- **比 Tile 多 MATH_F14、MATH 切片 +5 pp** — 细胞+energy 对纯算更友好
- mcq_science legacy **-18.8 pp** 差于 Tile（-12.5）
- **full 0.02 direct** 全集 hold 54.43%，math_word **+3.2 pp**（优于 Tile full）

---

## Tile vs StemCell 横向（高难度 79 题）

| 维度 | Tile | StemCell |
|------|------|----------|
| legacy direct 全集 | **55.70%** (+1.27) | 54.43% (0) |
| legacy core 切片 | +8.3 pp | +8.3 pp |
| legacy math_word | +6.5 pp | +6.5 pp |
| legacy math_num | 0 pp | **+5.0 pp** |
| legacy mcq_sci | -12.5 pp | **-18.8 pp** |
| full direct 全集 | 51.90% (-2.53) | **54.43% (0)** |
| full math_num | +5.0 pp | +5.0 pp |
| 共有进步题 | GSM_03, GSM_F26 | 同 + MATH_F14 |
| 共有退步 MCQ | MCQ_F07, MCQ_F09/F10 | 同 |

**结论（hard 集）**：

1. **应用题**：两体 legacy 均在 math_word 上 **+6.5 pp**，GSM_03 推理链可复现。
2. **纯算**：StemCell **更强**（legacy/full 均 math_num +5 pp；MATH_F14 仅 Stem 翻正）。
3. **理科 MCQ**：两体 **均大幅退步** — hard MCQ 是当前 patch 最弱维度。
4. **全集**：Tile legacy 微增；Stem full direct **hold baseline**；full patch 对 Tile 更伤。

---

## 复现

```bash
cd Valhalla
python3 -m venv .venv-tier-a && .venv-tier-a/bin/pip install torch transformers accelerate
HF_HUB_OFFLINE=1 .venv-tier-a/bin/python tools/tier_a_tf_front/run_tile_stemcell_hard_experiment.py --compare-both
```

---

*Rogue Intelligence LNC. · Tile / StemCell only · 20260619_0213*
