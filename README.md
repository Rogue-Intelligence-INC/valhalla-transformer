# valhalla-transformer

> ⚠️ **非开源 · NOT OPEN SOURCE** — 专有资产，仅供授权尽调/演示。详见 [**NON_OPEN_SOURCE.md**](./NON_OPEN_SOURCE.md) · [LICENSE](./LICENSE)

**Valhalla vs Transformer** — AI incubation runtime documentation + test API + Vue viz (Rogue Intelligence LNC.)

| | |
|--|--|
| **Version** | **2.0** (Hybrid unified product hybrid-2.0 · fair-1.2 · hub-f64 1.1.0) |
| **Date** | 2026-06-22 |
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

**Fair Benchmark** Viz tab: `experiments/fair_benchmark_*.json` via `/api/fair-benchmark`.

**Hybrid unified (hybrid-2.0)**: `experiments/hybrid_unified_latest.json` · **80.0%** test · open **95.1%** · mcq **54.4%** · `/api/hybrid-unified`

**VPB Potential**: `experiments/vpb_forecast_latest.json` · PFI **0.81**

---

## 中文 · 详解优先

| # | 文档 | 说明 |
|---|------|------|
| ★ | [**02_简介_详解版.md**](./zh/02_简介_详解版.md) | 进步/退步、Hub/Tile/Stem 内部、实验 |
| 1 | [01_简介_简明版.md](./zh/01_简介_简明版.md) | 1–2 页简明 |
| **5** | [**05_融资MVP实验报告.md**](./zh/05_融资MVP实验报告.md) | 200Q 详版 |
| **6** | [**06_TF前置与孵化实验总结.md**](./zh/06_TF前置与孵化实验总结.md) | Hub / Tile / StemCell 分体 QA 与矩阵 |
| **10** | [**10_FAIR_BENCHMARK_SPEC.md**](./zh/10_FAIR_BENCHMARK_SPEC.md) | 公正 benchmark 协议 (fair-1.1) |
| **11** | [**11_TILE_STEMCELL_CYCLE_EXPERIMENT.md**](./zh/11_TILE_STEMCELL_CYCLE_EXPERIMENT.md) | Tile/Stem 多轮 cycle（145Q test） |
| **12** | [**12_VPB_POTENTIAL_BENCHMARK.md**](./zh/12_VPB_POTENTIAL_BENCHMARK.md) | VPB 潜力 benchmark（PFI 0.81 · hybrid 77%） |
| **13** | [**13_HYBRID_UNIFIED_PRODUCT.md**](./zh/13_HYBRID_UNIFIED_PRODUCT.md) | **Hybrid 统一产品 hybrid-2.0**（80% · open 95% · mcq 54%） |
| **14** | [**14_MCQ_FAIR_BENCHMARK_SUMMARY.md**](./zh/14_MCQ_FAIR_BENCHMARK_SUMMARY.md) | MCQ 实验与公平基准总结（中英） |
| **7** | [**07_TILE_STEMCELL_HARD_EXPERIMENT.md**](./zh/07_TILE_STEMCELL_HARD_EXPERIMENT.md) | Tile/Stem 79 题高难度 |

## English

| # | Document |
|---|----------|
| ★ | [**02_INTRO_DETAILED.md**](./en/02_INTRO_DETAILED.md) |
| 1 | [01_INTRO_BRIEF.md](./en/01_INTRO_BRIEF.md) |
| **5** | [**05_FUNDRAISE_MVP_REPORT.md**](./en/05_FUNDRAISE_MVP_REPORT.md) |
| **6** | [**06_TF_FRONT_INCUBATION_SUMMARY.md**](./en/06_TF_FRONT_INCUBATION_SUMMARY.md) |
| **10** | [**10_FAIR_BENCHMARK_SPEC.md**](./en/10_FAIR_BENCHMARK_SPEC.md) |
| **11** | [**11_TILE_STEMCELL_CYCLE_EXPERIMENT.md**](./en/11_TILE_STEMCELL_CYCLE_EXPERIMENT.md) |
| **12** | [**12_VPB_POTENTIAL_BENCHMARK.md**](./en/12_VPB_POTENTIAL_BENCHMARK.md) |
| **13** | [**13_HYBRID_UNIFIED_PRODUCT.md**](./en/13_HYBRID_UNIFIED_PRODUCT.md) |
| **14** | [**14_MCQ_FAIR_BENCHMARK_SUMMARY.md**](./en/14_MCQ_FAIR_BENCHMARK_SUMMARY.md) |
| **7** | [**07_TILE_STEMCELL_HARD_EXPERIMENT.md**](./en/07_TILE_STEMCELL_HARD_EXPERIMENT.md) |

---

## Core conclusion（Hybrid unified · hybrid-2.0 · 20260622）

| Metric | Hybrid unified (145Q test) |
|--------|--------------------------|
| **Total** | **80.0%** (116/145) |
| open | **95.1%** |
| mcq | **54.4%** (~25/46) |
| numeric | **86.8%** |

**Policy**: open → patch LM · mcq → best(Tile+Fate, Triad) · numeric → max(all). 详见 [13_HYBRID_UNIFIED_PRODUCT.md](./zh/13_HYBRID_UNIFIED_PRODUCT.md)。

---

## Core conclusion（Tile/Stem 多轮 cycle · 20260620_1032）

| Body | c1→c20 structure | QA Δ (145Q isolated) | 解释 |
|------|------------------|----------------------|------|
| **Tile** | patch_hash **不变** · 177 tiles | **+0.00 pp** | Fate 第 1 轮收敛早停 |
| **StemCell** | patch_hash **变化** · 277 stem | **+0.69 pp** (open only) | patch 演化 ≠ Tier B 解码变化 |

**有效杠杆**：persistent session 40.7% · Tier A patch 69% · **非** 盲目加 cycle。详见 [11_TILE_STEMCELL_CYCLE_EXPERIMENT.md](./zh/11_TILE_STEMCELL_CYCLE_EXPERIMENT.md)。

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

*Rogue Intelligence LNC. · v1.8 · Proprietary*
