# Valhalla 融资 MVP 实验报告（200 题）

**版本**: 1.1 · **时间**: 20260616_1129 · **Rogue Intelligence LNC.**

> 完整 JSON：`experiments/fundraise_mvp_20260616_1129.json`

---

## 1. 为何需要 200 题

48 题 ±1 题 = ±2.08 pp，无法区分信号与噪声。融资 MVP 扩展至 **200 题**（59 numeric / 64 MCQ / 77 open），large 语料，并增加：

- Tier B 原生 vs **同题 Transformer 0.5B** 对标
- **Bootstrap 5000 次** 95% 置信区间（paired）

---

## 2. 总览

| 系统 | Acc | Correct |
|------|-----|---------|
| Tier B baseline（无语料） | **24.50%** | 49/200 |
| Tier B triad + large corpus | **24.50%** | 49/200 |
| **Qwen2.5-0.5B Transformer** | **68.00%** | 136/200 |

**语料孵化 Δ**: +0.00 pp · **95% CI**: [-2.00, +2.00] pp → **large 语料在 200Q 上无显著增益**

---

## 3. 分题型（关键发现）

| score_type | Tier B native | Transformer 0.5B | 解读 |
|------------|---------------|------------------|------|
| **numeric** | **61.02%** (36/59) | 71.19% (42/59) | **差距最小** — 规则/Cortex 路径在算题子集接近小模型 |
| mcq | 17.19% (11/64) | 32.81% (21/64) | 选项打分弱于 Transformer |
| open | 2.60% (2/77) | 94.81% (73/77) | 检索式解码 vs 生成式 — **最大鸿沟** |

---

## 4. 融资 MVP 判定

| 标准 | 结果 |
|------|------|
| 200Q + CI + Transformer 对标 | ✓ **范式 MVP 达标** |
| 整体替代 Transformer | ✗ 24.5% vs 68% |
| 语料孵化显著增益 | ✗ CI 含 0 |
| 投资人可讲「数值子域 61%」 | ✓ 诚实亮点 |
| 投资人可讲「已替代 Transformer」 | ✗ 禁止 |

---

## 5. 与 48 题实验关系

| 规模 | Tier B overall | 语料 Δ | 说明 |
|------|----------------|--------|------|
| 48Q standard | 25.00% | +2.08 pp | 小样本偶然 |
| **200Q fundraise** | 24.50% | **0 pp (CI±2)** | **更可信的整体估计** |

---

## 6. 复现

```bash
cd Valhalla
python3 tools/valhalla_model_bridge/build_fundraise_prompts.py
python3 tools/valhalla_model_bridge/run_fundraise_mvp.py
```

---

*Proprietary · Rogue Intelligence LNC.*
