# valhalla-transformer

**Valhalla vs Transformer** — AI incubation runtime documentation (Rogue Intelligence LNC.)

**Valhalla 与 Transformer** — AI 孵化运行时文档集（游侠智能）

| | |
|--|--|
| **Version** | 1.0 |
| **Date** | 2026-06-16 |
| **Main codebase** | [Rogue-Intelligence-INC/Valhalla](https://github.com/Rogue-Intelligence-INC/Valhalla) (proprietary) |
| **License / 授权** | **Proprietary — NOT open source** · see [LICENSE](./LICENSE) |

---

## 中文 · 详解优先

| # | 文档 | 说明 |
|---|------|------|
| ★ | [**02_简介_详解版.md**](./zh/02_简介_详解版.md) | **技术 + 实验详解**（Tier A/B、对照臂、复现） |
| 1 | [01_简介_简明版.md](./zh/01_简介_简明版.md) | 1–2 页简明介绍 |
| 3 | [03_商业计划书_BP.md](./zh/03_商业计划书_BP.md) | 商业计划书 |
| 4 | [04_技术白皮书.md](./zh/04_技术白皮书.md) | 实验驱动白皮书 |

## English · Detailed intro

| # | Document | Description |
|---|----------|-------------|
| ★ | [**02_INTRO_DETAILED.md**](./en/02_INTRO_DETAILED.md) | **Technical + experimental deep dive** |
| 1 | [01_INTRO_BRIEF.md](./en/01_INTRO_BRIEF.md) | 1–2 page brief |
| 3 | [03_BUSINESS_PLAN.md](./en/03_BUSINESS_PLAN.md) | Business plan |
| 4 | [04_TECHNICAL_WHITEPAPER.md](./en/04_TECHNICAL_WHITEPAPER.md) | Experiment-driven whitepaper |

---

## One-line conclusion / 核心结论

| 中文 | English |
|------|---------|
| Valhalla **不是**已在通用 benchmark 上击败 Transformer；它是 **无 backprop 的结构孵化运行时**——Tier A 结构 patch **优于随机噪声**；Tier B 原生路径已跑通（~25% MVP）；KD **+22.92 pp** 为 **不同范式** 的上限参照。 | Valhalla **does not** claim SOTA over Transformers; it is a **no-backprop structure-incubation runtime**—Tier A beats random noise; Tier B runs end-to-end (~25% MVP); KD **+22.92 pp** is a **different-paradigm** upper bound. |

---

## Experiment data (Valhalla monorepo)

Raw reports and JSON live in the main [Valhalla](https://github.com/Rogue-Intelligence-INC/Valhalla) repository:

| Experiment | Report |
|------------|--------|
| Tier A Strict (48Q) | [strict incubation report](https://github.com/Rogue-Intelligence-INC/Valhalla/blob/main/reports/VALHALLA_STRICT_INCUBATION_REPORT_standard_20260616_0802.md) |
| Tier B Native v2 (48Q) | [Tier B report](https://github.com/Rogue-Intelligence-INC/Valhalla/blob/main/reports/VALHALLA_TIER_B_NATIVE_REPORT_standard_20260616_0847.md) |
| KD control (3B→0.5B) | [KD report](https://github.com/Rogue-Intelligence-INC/Valhalla/blob/main/reports/VALHALLA_KD_CONTROL_REPORT_standard_20260616_0905.md) |
| Corrections | [experiment corrections](https://github.com/Rogue-Intelligence-INC/Valhalla/blob/main/reports/VALHALLA_EXPERIMENT_RECORD_CORRECTIONS_20260616.md) |

---

## Reproduce

```bash
git clone https://github.com/Rogue-Intelligence-INC/Valhalla.git
cd Valhalla
RUSTFLAGS='-L /opt/cuda/lib64' cargo build -p hub-f64 --release \
  --bin valhalla_model_export --bin valhalla_native_qa
export HF_ENDPOINT=https://hf-mirror.com
python3 tools/valhalla_model_bridge/run_strict_incubation_experiment.py --phase standard
python3 tools/valhalla_model_bridge/run_tier_b_incubation.py --phase standard
```

---

*Rogue Intelligence LNC. · valhalla-transformer v1.0 · **Proprietary / 非开源***
