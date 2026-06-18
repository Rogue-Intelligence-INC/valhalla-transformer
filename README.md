# valhalla-transformer

> ⚠️ **非开源 · NOT OPEN SOURCE** — 专有资产，仅供授权尽调/演示。详见 [**NON_OPEN_SOURCE.md**](./NON_OPEN_SOURCE.md) · [LICENSE](./LICENSE)

**Valhalla vs Transformer** — AI incubation runtime documentation + test API + Vue viz (Rogue Intelligence LNC.)

| | |
|--|--|
| **Version** | 1.5 (TF-front full patch · hub/tile/stemcell) |
| **Date** | 2026-06-18 |
| **Main codebase** | [Rogue-Intelligence-INC/Valhalla](https://github.com/Rogue-Intelligence-INC/Valhalla) (proprietary) |
| **License** | **Proprietary — NOT open source** · [NON_OPEN_SOURCE.md](./NON_OPEN_SOURCE.md) · [LICENSE](./LICENSE) |
| **Scope** | 文档 + 实验 JSON + 演示 API/Viz · **不含** Val-OS 硬件调度接口 |

---

## Quick start — Viz & test API

```bash
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh
```

| Service | URL |
|---------|-----|
| **Vue dashboard** | http://127.0.0.1:5173 |
| **REST API** | http://127.0.0.1:8780/api/health |
| **API docs** | [api/README.md](./api/README.md) |

Set `VALHALLA_NATIVE_QA=/path/to/valhalla_native_qa` for live Tier B QA (otherwise mock).

---

## 中文 · 详解优先

| # | 文档 | 说明 |
|---|------|------|
| ★ | [**02_简介_详解版.md**](./zh/02_简介_详解版.md) | 进步/退步、Hub/Tile/Stem 内部、实验 |
| 1 | [01_简介_简明版.md](./zh/01_简介_简明版.md) | 1–2 页简明 |
| **5** | [**05_融资MVP实验报告.md**](./zh/05_融资MVP实验报告.md) | 200Q 详版 |
| **6** | [**06_TF前置与孵化实验总结.md**](./zh/06_TF前置与孵化实验总结.md) | Hub / Tile / StemCell 分体 QA 与矩阵 |
| **7** | [**07_TILE_STEMCELL_HARD_EXPERIMENT.md**](./zh/07_TILE_STEMCELL_HARD_EXPERIMENT.md) | Tile/Stem **79 题** 高难度 5 切片（20260619_0213） |

## English

| # | Document |
|---|----------|
| ★ | [**02_INTRO_DETAILED.md**](./en/02_INTRO_DETAILED.md) |
| 1 | [01_INTRO_BRIEF.md](./en/01_INTRO_BRIEF.md) |
| **5** | [**05_FUNDRAISE_MVP_REPORT.md**](./en/05_FUNDRAISE_MVP_REPORT.md) |
| **6** | [**06_TF_FRONT_INCUBATION_SUMMARY.md**](./en/06_TF_FRONT_INCUBATION_SUMMARY.md) |
| **7** | [**07_TILE_STEMCELL_HARD_EXPERIMENT.md**](./en/07_TILE_STEMCELL_HARD_EXPERIMENT.md) |

---

## Core conclusion（Hub / Tile / StemCell 分体 · 20260618_0231）

| Body | legacy 0.08 | full 0.02 | 进步 QA（代表） |
|------|-------------|-----------|----------------|
| **Hub** | 50% 全持平 | fresh_reload 50% hold | **无**单题 flip |
| **Tile** | **58.3%** GSM_03 +8.33 pp | fresh_reload 50% | GSM_03 45→18 分步推理 |
| **StemCell** | **58.3%** 同 Tile | fresh_reload 50% | GSM_03 + full 时 MCQ_CHEM_02 |

详见 [06_TF前置与孵化实验总结.md](./zh/06_TF前置与孵化实验总结.md) — **按三体分章，不把 Valhalla 当作整体**。

---

## Repository layout

```
api/           REST test interface (experiments, bodies, QA)
viz/           Vue 3 dashboard
experiments/   JSON runs + tf_front_body_matrix_*.json
zh/ en/        Intro docs (01, 02, 05, 06 pushed; 03, 04 local)
scripts/       start-dev.sh
```

---

## Reproduce experiments (Valhalla monorepo)

```bash
git clone https://github.com/Rogue-Intelligence-INC/Valhalla.git
cd Valhalla
RUSTFLAGS='-L /opt/cuda/lib64' cargo build -p hub-f64 --release --bin valhalla_model_export
python3 tools/tier_a_tf_front/run_cumulative_experiment.py --phase pilot --rounds 3
```

---

*Rogue Intelligence LNC. · v1.5 · Proprietary*
