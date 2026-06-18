# Tile / StemCell Total Patch（完全改写原模型）

**模式**: `patch_mode=total` · 代码 `tools/tier_a_tf_front/patch_total.py`

仅 **Tile**、**StemCell** — 在 `full` 之上再改 **整条 decoder 权重路径**：

| 组件 | full | **total** |
|------|------|-----------|
| input/post LN | ✅ | ✅ + 更强签名加性 |
| self_attn q/k/v/o | ❌ | ✅ **24 层全投影** |
| MLP gate/up/down | Stem 仅 gate 首行 | ✅ **每层全 MLP** |
| embed_tokens | 语料 token | ✅ **全词表行** + 语料加强 |
| lm_head | 全词表 | ✅ |
| model.norm | ❌ | ✅ |

**Ingress 仍分体**：Tile 用 93 块签名驱动各层；StemCell 用 193 细胞 + energy 分层强度。

## 用法

```bash
cd Valhalla
# 高难度 79 题多切片实验
HF_HUB_OFFLINE=1 .venv-tier-a/bin/python tools/tier_a_tf_front/run_tile_stemcell_hard_experiment.py \
  --patch-mode total --strength 0.015

# 累积 patch 矩阵（仅 tile/stem）
python tools/tier_a_tf_front/run_cumulative_experiment.py \
  --bodies tile,stemcell --patch-mode total --strength 0.015 --phase pilot --rounds 3
```

默认 strength 建议 **0.015**（全路径扰动面大，高于 full 的 0.02 易崩）。

## Smoke（2026-06-19）

| body | mode | weight_delta_norm | attn 层 | mlp 层 | 全词表 embed |
|------|------|-------------------|---------|--------|--------------|
| tile | full | 3.13 | — | — | — |
| tile | **total** | 3.34 | 24 | 24 | ✅ |
| stemcell | **total** | 3.59 | 24 | 24 | ✅ |

*Rogue Intelligence LNC.*
