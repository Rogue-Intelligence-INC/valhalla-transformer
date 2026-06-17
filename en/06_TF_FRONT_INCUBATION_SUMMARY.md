# TF-Front 累积 Patch 实验（Body 分离 + LLM 前置 · this run only）

**Run ID**: `20260618_0231`

## 设计

hub / tile / stemcell **各 3 协议**（full patch 模式）：

| 协议 | 语料路径 | 模型 |
|------|----------|------|
| `tf_front_cumulative` | 语料 → **LLM 扩写** → Valhalla | **累积** patch |
| `direct_cumulative` | 语料 → Valhalla | **累积** patch |
| `tf_front_fresh_reload` | 语料 → LLM → Valhalla | **每轮 reload** |

12 题 · 24 行 · 3 轮 · strength 0.02

## Full matrix

| Arm | Final | Δ |
|-----|-------|---|
| hub_tf_front_cumulative | 33.33% | -16.67 pp |
| hub_direct_cumulative | 33.33% | -16.67 pp |
| hub_tf_front_fresh_reload | 50.00% | +0.00 pp |
| tile_tf_front_cumulative | 41.67% | -8.33 pp |
| tile_direct_cumulative | 41.67% | -8.33 pp |
| tile_tf_front_fresh_reload | 50.00% | +0.00 pp |
| stemcell_tf_front_cumulative | 41.67% | -8.33 pp |
| stemcell_direct_cumulative | 33.33% | -16.67 pp |
| stemcell_tf_front_fresh_reload | 50.00% | +0.00 pp |

## Conclusion

- **最高 acc 臂**: `hub_tf_front_fresh_reload` → 50.00%
- **对→错倒退**: 有
- `hub_tf_front_cumulative` 新增错误: GSM_04, MATH_01
- `hub_direct_cumulative` 新增错误: GSM_04, MATH_01
- `tile_tf_front_cumulative` 新增错误: GSM_04
- `tile_direct_cumulative` 新增错误: GSM_04
- `stemcell_tf_front_cumulative` 新增错误: GSM_04
- `stemcell_direct_cumulative` 新增错误: GSM_04, MATH_01