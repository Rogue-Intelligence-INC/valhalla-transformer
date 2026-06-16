# Valhalla vs Transformer: Brief Introduction

**Version**: 1.0 · **Date**: 2026-06-16 · **Rogue Intelligence LNC.**

---

## What We Are

**Valhalla** is a deployable **AI incubation runtime**: text and corpora are encoded as f64 signals, evolved through **Hub (routing) · Tile (block memory) · StemCell (self-organizing structure) · Fate (convergence coordination)**, producing observable structural state used either to **steer model behavior** or **decode answers natively**.

**Transformers** dominate today’s language AI: large-scale pretraining, self-attention, gradient fine-tuning. Valhalla **does not deny** Transformer strength on general reasoning; we offer a **parallel path**—**structure growth and field convergence** as the core mechanism for **vertical AI incubation**, instead of backprop-only weight updates.

---

## Two Tiers: Tier A and Tier B

```
┌─────────────────────────────────────────────────────────────┐
│  Tier B (North star) — Valhalla is the compute body; no HF    │
│  Corpus + question → Ingress → Hub/Tile/StemCell → decode   │
└─────────────────────────────────────────────────────────────┘
                              ↑ roadmap
┌─────────────────────────────────────────────────────────────┐
│  Tier A (Proxy today) — structure export → patch 0.5B model   │
│  Corpus → Valhalla → patch → Qwen generate → measure Δacc   │
└─────────────────────────────────────────────────────────────┘
```

| | Tier A | Tier B |
|--|--------|--------|
| **Compute** | Qwen2.5-0.5B Transformer | Hub + Tile + StemCell + Fate |
| **Incubation** | Structural patch on weights | Structure evolution + retrieval/rule decode |
| **Status** | ✓ 48Q strict experiment | ✓ `valhalla_native_qa` 48Q |
| **Accuracy** | ~69% baseline; patch **no net gain** | ~23% baseline; triad **25%** |

---

## Experiment Summary (2026-06-16, honest)

**Benchmark**: 48 prompts × 13 domains; **strict MCQ** scoring.

### Tier A — Patch External Transformer

| Method | Δacc (strict) | Meaning |
|--------|---------------|---------|
| Valhalla triad patch | **-2.08 pp** | Best Valhalla arm; slight drop |
| prompt_only | -6.25 pp | Corpus in prompt alone insufficient |
| random_patch | **-14.58 pp** | Valhalla **beats random** |
| logit_kd (3B→0.5B) | **+22.92 pp** | Supervised upper bound (different paradigm) |

**Safe claim**: Valhalla patches **change outputs** (~90% change rate) and are **not arbitrary noise**; under strict scoring we **cannot** claim benchmark accuracy gains on the small model.

### Tier B — Native Valhalla (no HF)

| Arm | Acc | Δ vs no corpus |
|-----|-----|----------------|
| baseline_no_corpus | 22.92% | — |
| triad_c1 | **25.00%** | **+2.08 pp** |
| Numeric (GSM/MATH) | **8/9** | word_problem + Cortex direct math |

**Safe claim**: Native path **runs end-to-end**; numeric subset shows signal; **overall still far below Transformer**—not a replacement yet.

---

## Positioning

> **Valhalla is an ownable, auditable structure-incubation runtime; Transformers remain the strong general-language base. Tier A grafts Valhalla structure onto Transformers to prove reachability; Tier B moves inference onto Valhalla itself—the goal is an AI incubation platform, not another chat API wrapper.**

---

## Who Should Use It

| Customer | Use Valhalla for | Do not use for |
|----------|------------------|----------------|
| Regulated enterprise | Private routing + auditable checkpoints | GPT-4-class general chat |
| Vertical SaaS | Corpus → accumulated structure → domain behavior | Zero-shot SOTA benchmarks |
| Labs | Tier B native + Val-OS full-stack demo | Closed API only |

---

## Read Next

- [02_INTRO_DETAILED.md](./02_INTRO_DETAILED.md)
- [03_BUSINESS_PLAN.md](./03_BUSINESS_PLAN.md)
- [04_TECHNICAL_WHITEPAPER.md](./04_TECHNICAL_WHITEPAPER.md)
- 中文版：[../zh/01_简介_简明版.md](../zh/01_简介_简明版.md)
