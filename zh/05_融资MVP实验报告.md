# Valhalla Fundraise MVP 实验报告（详版）

**时间**: 20260616_1143  
**题数**: 200（fundraise phase，`incubation_benchmark_suite.json` 扩展集）  
**语料**: large（143 行，含 speak 对话注入）  
**协议**: Tier B 原生 · strict MCQ · 五臂 body 分离  
**JSON**: `reports/body_experiments/fundraise_mvp_20260616_1143.json`

---

## 0. 一句话结论

**范式与证据链进步了**（200Q、body 分离、CI、同题 Transformer 对标）；**整体能力未进步**（24.5% vs 68%）。数值子域有结构解码信号（61%），open 几乎不可用（2.6%）。48Q 上 triad +2.08pp 语料增益在 200Q **不复现**——是小样本噪声，不是产品能力。

---

## 1. 总览（200Q）

| Arm | Body | Corpus | Acc | Correct | Δ vs baseline | 95% CI |
|-----|------|--------|-----|---------|---------------|--------|
| baseline_no_corpus | triad | no | 24.50% | 49/200 | — | — |
| hub_c1 | hub | yes | 23.50% | 47/200 | **-1.00 pp** | [-4.50, +2.50] |
| tile_c1 | tile | yes | 23.50% | 47/200 | **-1.00 pp** | [-3.50, +1.50] |
| stemcell_c1 | stemcell | yes | 23.50% | 47/200 | **-1.00 pp** | [-3.50, +1.50] |
| triad_c1 | triad | yes | 24.50% | 49/200 | **+0.00 pp** | [-2.00, +2.00] |
| **transformer_0.5b** | HF | — | **68.00%** | 136/200 | — | — |

### 1.1 与历史跑次对照

| 跑次 | 规模 | 臂数 | baseline | triad+corpus | 说明 |
|------|------|------|----------|--------------|------|
| Tier B standard | 48Q | 5 | 22.92% | **25.00% (+2.08pp)** | v2 numeric decode |
| Fundraise 1129 | 200Q | 2 | 24.50% | 24.50% (0pp) | 仅 baseline+triad |
| **Fundraise 1143** | **200Q** | **5** | **24.50%** | **24.50% (0pp)** | **+ body 分离** |

**为何 200Q baseline (24.5%) 高于 48Q (22.9%)？**  
不是「变聪明了」，而是题集组成不同：200Q 含更多可结构化解的 numeric（59/200），且 `direct_math` / `word_problem` 路径在扩展题上仍 100% 命中；48Q 子集更严、MCQ/open 占比相对更高。

---

## 2. 哪里进步了

### 2.1 实验范式（融资可陈述）

| 进步点 | 证据 | 为什么重要 |
|--------|------|------------|
| **200Q 规模 + Bootstrap CI** | triad Δ 0pp，CI [-2,+2] | 比 48Q 更有统计说服力；增益声明需带区间 |
| **Body 分离首次在 200Q 跑通** | hub/tile/stem/triad 各 200 题 | 可回答「triad 是不是三个 body 简单相加」 |
| **同题 Transformer 对标** | Qwen2.5-0.5B 68% | 诚实锚点，避免自嗨 |
| **Tier B 端到端闭环** | 无 HF forward，`valhalla_native_qa` | 证明「脑体即算力」路径可运行，非 patch 补丁 |
| **严格评分** | strict MCQ，末行 `ANSWER: X` | 早期 +4.17pp 假阳性已排除 |

### 2.2 能力子域（有限但可量化）

**数值 decode 是真实信号，不是凑数：**

| decode_path | baseline 命中 | 说明 |
|-------------|---------------|------|
| `direct_math` | **26/26 (100%)** | 纯算式 → 结构 ingress + 算术解码 |
| `word_problem` | **4/4 (100%)** | GSM 类应用题 |
| `cortex` | 6/29 (20.7%) | 复杂 numeric，检索+规则不足 |
| **numeric 合计** | **36/59 (61.0%)** | vs Transformer **71.2%** |

按领域（baseline）：

| 领域 | Acc | 解读 |
|------|-----|------|
| math_numeric | **75.0%** (21/28) | 结构数学最强 |
| math_word | 48.4% (15/31) | 应用题部分走 cortex，拉低 |
| physics / geo / CS 等 | 7–20% | 靠 MCQ 检索，弱 |

**相对 Transformer 的「楔子」**：numeric 差距约 **10pp**（61 vs 71），远小于 open（2.6 vs 94.8）。融资叙事应打 **「结构化推理子域」**，不打「通用 QA」。

### 2.3 结构信息（Tier A 侧，本报告不重复跑）

48Q strict Tier A 已证明：**Valhalla triad patch (-2.08pp) 显著优于 random patch (-14.58pp)**。说明 export 的 patch **含结构信息**，不是同强度随机噪声。Tier B 200Q 在此基础上证明：**不 patch Transformer 也能跑**，但 acc 低。

---

## 3. 哪里没进步 / 为什么

### 3.1 整体 acc：24.5% vs 68%

**原因（架构层面，不是 bug）：**

1. **Tier B 没有生成式 LM**  
   open 题走 `open_retrieval`：从语料/记忆里拼答案，**2/77 (2.6%)**。Transformer 用 0.5B 自回归生成，open **73/77 (94.8%)**。差距主要来自这里（open 占 200 题中 77 题）。

2. **MCQ 靠选项匹配，无 deep reasoning**  
   `mcq_option` 路径 11/64 (17.2%) vs Transformer 32.8%。语料检索对「四选一字母」帮助有限，且 strict 评分不允许子串假阳性。

3. **0.5B 已在预训练里见过大量知识**  
   Valhalla Tier B 当前 = ingress 信号 + Fate 加权检索 + 规则 decode，**参数量与知识库不对等**。

### 3.2 语料孵化：200Q 上 Δ = 0pp

**triad_c1 与 baseline 在 196/200 题上完全一致**，仅 4 题翻转：

| 题号 | baseline | triad+corpus | 类型 |
|------|----------|--------------|------|
| ZH_03 | ✗ | ✓ | open |
| OPEN_F25 | ✗ | ✓ | open |
| OPEN_F13 | ✓ | ✗ | open |
| OPEN_F45 | ✓ | ✗ | open |

+2 −2 = **净 0**。large 语料（143 行）改变了检索排序，但**对 numeric/MCQ 几乎无影响**（numeric 59 题全相同）。

**为什么 48Q 有 +2.08pp 而 200Q 没有？**

- 48Q 子集小，triad 语料碰巧多命中 1 题 → 12/48 vs 11/48  
- Bootstrap CI [-2,+2] 说明 **真实效应量在 ±2pp 以内**  
- **结论**：不能把 48Q +2.08pp 写进 BP 当稳定产品增益

### 3.3 单 Body 略差于 Triad（-1pp）

hub/tile/stem 各 47/200，比 baseline/triad 少 2 题。

**16 道题在不同 body 间结果不同**（12 MCQ + 4 open），典型模式：

- **Hub 单独**：MCQ 翻转最多（hub vs baseline 差 14 题次），Fate `hub_prefs` 改变检索权重 → 一些 MCQ 对、一些错  
- **Tile / Stem 单独**：各 6 题次翻转，与 baseline 同向  
- **Triad**：仅 4 题与 baseline 不同（= 语料效应），**MCQ 与 baseline 完全一致**

**机制解释（Triad = Hub + Tile + StemCell 同时 ingress）：**

```
corpus + question
    → TriadSession::with_body(hub|tile|stem|triad)
    → Tile/Stem 签名 + Hub Fate 亲和力
    → 结构加权 memory 检索
    → decode_numeric | mcq_option | open_retrieval
```

- **Triad** 三路信号同时参与检索，MCQ 路由与 baseline（triad 无语料）一致 → acc 不掉  
- **单 body** 缺少 Tile/Stem 或 Hub 互补 → MCQ 选项分错 2 题净损失  
- **不是**「hub 比 triad 强」——48Q Tier A 里 hub patch 最差 (-10.42pp)

### 3.4 Body 分离「有差异但不够显著」

统计上 -1pp 的 CI 均含 0，**不能声称「triad 显著优于单 body」**，只能声称：

- 工程上 body export / ingress **可分离、可复现**  
- 200Q 上 triad **≥ 任一单 body**（24.5% vs 23.5%）  
- 差异集中在 MCQ/open，numeric **四臂完全相同**（61.02%）

---

## 4. 分题型详表

| score_type | n | baseline | hub | tile | stem | triad | Transformer | 差距主因 |
|------------|---|----------|-----|------|------|-------|-------------|----------|
| numeric | 59 | **61.02%** | 61.02% | 61.02% | 61.02% | 61.02% | 71.19% | cortex 弱；direct_math 满 |
| mcq | 64 | 17.19% | 14.06% | 14.06% | 14.06% | 17.19% | 32.81% | 检索选 letter；单 hub 更差 |
| open | 77 | 2.60% | 2.60% | 2.60% | 2.60% | 2.60% | 94.81% | 无 LM 生成 |

---

## 5. 融资 MVP 判定

| 维度 | 状态 | 依据 |
|------|------|------|
| 范式 MVP | **✓** | 200Q + 5 臂 + CI + Transformer 对标 + 可复现脚本 |
| Body 分离证据 | **✓** | hub/tile/stem/triad 各跑 200 题，JSON 含 per-row |
| Transformer 替代 | **✗** | 24.5% ≪ 68%，且 open 子域崩盘 |
| 语料产品增益 | **✗（200Q）** | Δ 0pp，CI 含 0；48Q +2.08pp 作废 |
| 数值楔子 | **△** | 61% vs 71%，可演示，非 SOTA |
| KD 上限（不同范式） | 参考 | 3B→0.5B lm_head **+22.92pp**（91.67%） |

---

## 6. 对外怎么说 / 怎么说不得

**可以说：**

- Valhalla Tier B 原生路径 200 题闭环，Hub/Tile/Stem/Triad 可分离实验  
- 结构化数值 decode：`direct_math` / `word_problem` 满命中；numeric 61% vs 0.5B 71%  
- Tier A：结构 patch 优于 random（-2.08 vs -14.58 pp）  
- 语料效应在 200Q 上不显著（诚实 + CI）  
- Triad = 三 body **同时** ingress，非简单拼接

**不能说：**

- 「孵化语料 +2.08pp 稳定增益」（48Q 噪声）  
- 「Valhalla 替代 Transformer」（整体 acc）  
- 「Hub 单独最强」（Tier A/B 均不支持）  
- 「200Q 证明 corpus 有效」

---

## 7. 下一步（与 gap 对应）

| Gap | 方向 | 目标指标 |
|-----|------|----------|
| open 2.6% | Tier B + 轻量生成头 / 模板扩展 | open >15% on POC |
| cortex 20.7% | Fate 迭代 + 多 cycle（c10≡c1 已知） | numeric >65% |
| 语料 0pp | 领域语料 + 检索对齐 | triad Δ CI 下界 >0 |
| 整体 acc | 垂直 POC（仅 math_numeric 子集） | native >30% subset |
| 产品化 | Docker / systemd 安装器 | 设计伙伴 LOI |

---

## 8. 复现

```bash
cd Valhalla
RUSTFLAGS='-L /opt/cuda/lib64' cargo build -p hub-f64 --release --bin valhalla_native_qa
python3 tools/valhalla_model_bridge/build_fundraise_prompts.py
python3 tools/valhalla_model_bridge/run_fundraise_mvp.py
# 已有 Transformer 结果时可 --skip-transformer
```

---

*Rogue Intelligence LNC. · Fundraise MVP 详版 · 20260616_1143*
