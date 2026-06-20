# Tile / StemCell 多轮 Cycle 优化实验

**Run**: `20260620_1032` (test 145Q) · `20260620_1027` (smoke 12Q)  
**语料**: Fair ingest_clean 49 行 · Artifact `3beed48570c4`  
**详版报告**: Valhalla 主仓 `reports/VALHALLA_TILE_STEMCELL_MULTI_CYCLE_EXPERIMENT_20260620.md`

---

## 1. 实验问题

增加 `optimize_cycles`（1→5→10→20）是否提升 **Tile / StemCell** 的结构质量与 QA 准确率？

在 **Fair Benchmark 去污染语料** 上系统回答，并与 triad / patch / Transformer 对照。

---

## 2. 协议

| 协议 | 说明 |
|------|------|
| **export** | 结构指纹：patch_hash、tile/stem 计数、cycle_trace |
| **isolated** | 每题独立孵化：`corpus_cycles=N` |
| **batch** | 一次孵化多题（smoke 已跑；test 主报告用 isolated） |

**Body**: 仅 `tile` 或 `stemcell`（非 triad 融合）。

---

## 3. 结构结果（test）

| Body | patch_hash c1→c20 | 规模 |
|------|-------------------|------|
| **Tile** | **不变** `2ff181b3…` | 177 tiles / 0 stem |
| **StemCell** | **变化**（4 档不同 hash） | 0 tiles / 277 stem |

**解释**：

- Tile：`has_fate_converged()` 在第 1 轮早停 → c5–c20 空转。
- StemCell：`evolve` 改写 patch 向量，但细胞数已达平衡。

---

## 4. QA 结果（test · 145Q · isolated）

| Arm | acc | numeric | mcq | open | Δ c1→c20 |
|-----|-----|---------|-----|------|----------|
| tile | 34.5% | 57.9% | 28.3% | 24.6% | **+0.00 pp** |
| stemcell | 35.2% (c20) | 57.9% | 28.3% | 26.2% | **+0.69 pp** [0, 2.07] |

StemCell 微弱提升 **仅 open**，CI 含 0。

---

## 5. Fair Benchmark 对照（同语料 145Q）

| Arm | acc |
|-----|-----|
| baseline_no_corpus | 20.0% |
| **tile / stem isolated c1** | **34.5%** |
| triad_c1 | 35.9% |
| triad_c1_persistent | **40.7%** |
| patch_stemcell_legacy (Tier A) | **69.0%** |
| Qwen generate | 71.0% |

**要点**：

- 多 cycle **不能**替代 persistent session（+6.2 pp）或 Tier A patch（+34.5 pp）。
- 单 body ≈ triad isolated；triad 融合仅 +1.4 pp。

---

## 6. Smoke · batch 补充

| 协议 | tile c1→c20 | stem c1→c20 |
|------|-------------|-------------|
| isolated | 75.0% → 75.0% | 75.0% → 75.0% |
| batch | 83.3% → 83.3% | 83.3% → 83.3% |

batch 高于 isolated（+8.3 pp），但 **batch 内多 cycle 仍无增益**。

---

## 7. 产品结论

| 有效杠杆 | 无效杠杆 |
|----------|----------|
| Artifact 一次孵化、多次查询 | 盲目增加 optimize_cycles |
| Persistent session / batch | 单 body 多轮空转 |
| Tier A patch + generate | 指望 StemCell patch 微变提升 Tier B |

**推荐路径**：fair corpus → **triad artifact** → **persistent memory**（MCQ 楔子）+ **patch Tier A**（open/numeric）。

---

## 8. 复现

```bash
cd Valhalla
python3 tools/fair_benchmark/run_tile_stemcell_cycle_experiment.py \
  --phase test --protocols export,isolated \
  --artifact checkpoints/incubation_artifacts/fair_triad_c1/
```

JSON: `experiments/tile_stemcell_cycles_latest.json` · API: `GET /api/tile-stemcell-cycles`

---

*Rogue Intelligence LNC. · v1.7 · 2026-06-20*
