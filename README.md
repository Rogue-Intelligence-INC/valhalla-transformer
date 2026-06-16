# valhalla-transformer

**Valhalla vs Transformer** — AI incubation runtime documentation (Rogue Intelligence LNC.)

**Valhalla 与 Transformer** — AI 孵化运行时文档集（游侠智能）

| | |
|--|--|
| **Version** | 1.2 (Fundraise MVP 200Q + body separation) |
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
| **5** | [**05_融资MVP实验报告.md**](./zh/05_融资MVP实验报告.md) | **200Q + CI + Transformer 对标** |

## English · Detailed intro

| # | Document | Description |
|---|----------|-------------|
| ★ | [**02_INTRO_DETAILED.md**](./en/02_INTRO_DETAILED.md) | **Technical + experimental deep dive** |
| 1 | [01_INTRO_BRIEF.md](./en/01_INTRO_BRIEF.md) | 1–2 page brief |
| 3 | [03_BUSINESS_PLAN.md](./en/03_BUSINESS_PLAN.md) | Business plan |
| 4 | [04_TECHNICAL_WHITEPAPER.md](./en/04_TECHNICAL_WHITEPAPER.md) | Experiment-driven whitepaper |
| **5** | [**05_FUNDRAISE_MVP_REPORT.md**](./en/05_FUNDRAISE_MVP_REPORT.md) | **200Q + CI + Transformer benchmark** |

---

## One-line conclusion / 核心结论

| 中文 | English |
|------|---------|
| Valhalla **不是**整体击败 Transformer；**200Q 融资 MVP**：原生 **24.5%** vs 0.5B **68%**；**Body 分离** hub/tile/stem **23.5%**，triad **24.5%**；语料 Δ **0 pp（CI±2）**；数值 **61% vs 71%**；Tier A patch **优于 random**；KD **+22.92 pp** 为不同范式上限。 | **200Q fundraise MVP**: native **24.5%** vs **68%** — no overall replacement; **body split** hub/tile/stem **23.5%**, triad **24.5%**; corpus Δ **0 pp (CI±2)**; numeric **61% vs 71%**; Tier A beats random; KD **+22.92 pp** upper bound. |

---

## Experiment data (Valhalla monorepo)

Raw reports and JSON live in the main [Valhalla](https://github.com/Rogue-Intelligence-INC/Valhalla) repository:

| Experiment | Report |
|------------|--------|
| **Fundraise MVP 200Q** | [05 融资 MVP](./zh/05_融资MVP实验报告.md) · `experiments/fundraise_mvp_20260616_1143.json` |
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
python3 tools/valhalla_model_bridge/run_fundraise_mvp.py   # 200Q fundraise MVP
```

---

## 授权 / License

**Proprietary — NOT open source / 专有 · 非开源**

| 中文 | English |
|------|---------|
| 本文档集版权归 Rogue Intelligence LNC. 所有。未获书面许可不得复制、分发或开源发布。 | No open-source license is granted. See [LICENSE](./LICENSE). |

---

*Rogue Intelligence LNC. · valhalla-transformer v1.0 · **Proprietary / 非开源***
