# valhalla-transformer

**Valhalla vs Transformer** — AI incubation runtime documentation + test API + Vue viz (Rogue Intelligence LNC.)

| | |
|--|--|
| **Version** | 1.3 (Test API + Vue viz + clearer intros) |
| **Date** | 2026-06-16 |
| **Main codebase** | [Rogue-Intelligence-INC/Valhalla](https://github.com/Rogue-Intelligence-INC/Valhalla) (proprietary) |
| **License** | **Proprietary — NOT open source** · [LICENSE](./LICENSE) |

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
| 3 | 03_商业计划书_BP.md | 本地维护，不随本仓库推送 |
| 4 | 04_技术白皮书.md | 本地维护，不随本仓库推送 |

## English

| # | Document |
|---|----------|
| ★ | [**02_INTRO_DETAILED.md**](./en/02_INTRO_DETAILED.md) |
| 1 | [01_INTRO_BRIEF.md](./en/01_INTRO_BRIEF.md) |
| **5** | [**05_FUNDRAISE_MVP_REPORT.md**](./en/05_FUNDRAISE_MVP_REPORT.md) |

---

## Core conclusion

| 中文 | English |
|------|---------|
| **进步**：200Q 范式、body 分离、Tier B 闭环、numeric 楔子、结构优于 random。**退步**：整体 24.5% vs 68%、open 2.6%、语料 0pp、48Q +2.08pp 作废。 | **Progress**: methodology, E2E Tier B, numeric wedge, structure > random. **Regression**: 24.5% vs 68%, open 2.6%, corpus 0pp. |

---

## Repository layout

```
api/           REST test interface (experiments, bodies, QA)
viz/           Vue 3 dashboard
experiments/   JSON runs + body_internals.json
zh/ en/        Intro docs (01, 02, 05 pushed; 03, 04 local)
scripts/       start-dev.sh
```

---

## Reproduce experiments (Valhalla monorepo)

```bash
git clone https://github.com/Rogue-Intelligence-INC/Valhalla.git
cd Valhalla
RUSTFLAGS='-L /opt/cuda/lib64' cargo build -p hub-f64 --release --bin valhalla_native_qa
python3 tools/valhalla_model_bridge/run_fundraise_mvp.py
```

---

*Rogue Intelligence LNC. · v1.3 · Proprietary*
