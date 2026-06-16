# Valhalla vs Transformer: AI Incubation Technical Whitepaper

**Document type**: Experiment-driven technical whitepaper  
**Version**: 1.0  
**Date**: 2026-06-16  
**Publisher**: Rogue Intelligence LNC.  
**Scope**: Tier A proxy incubation · Tier B native incubation · Transformer/KD controls · reproduction protocol  
**Audience**: Architects, ML systems engineers, third-party auditors

> Engineering architecture: [VALHALLA_TECHNICAL_WHITEPAPER.md](https://github.com/Rogue-Intelligence-INC/Valhalla/blob/main/docs/whitepapers/VALHALLA_TECHNICAL_WHITEPAPER.md).  
> Raw JSON: [Valhalla `reports/body_experiments/`](https://github.com/Rogue-Intelligence-INC/Valhalla/tree/main/reports/body_experiments).

---

## Abstract

This whitepaper answers: **What is Valhalla as an AI incubation runtime relative to Transformers? What do experiments prove—and not prove?**

**Summary**:

1. **Tier A** (Valhalla structure → patch Qwen2.5-0.5B): **no net strict accuracy gain** on 48Q; Valhalla triad patch (**-2.08 pp**) **beats** same-strength random patch (**-14.58 pp**); output change rate 79–92%.
2. **Tier B** (`valhalla_native_qa`, no HF forward): 48Q accuracy 22.92%→25.00% (triad + corpus, **+2.08 pp**); numeric subset **8/9**; **overall far below** Transformer baseline ~69%.
3. **KD control** (Qwen2.5-3B → 0.5B lm_head SFT): **+22.92 pp** (68.75%→91.67%)—supervised gradient **upper bound** on the same benchmark; **not comparable** to no-backprop Valhalla as a single “incubation gain.”

**Non-goal**: Claim Valhalla replaces Transformers on general benchmarks.

---

## 1. Terminology

| Term | Definition |
|------|------------|
| **Incubation** | Corpus/questions → Valhalla ingress → structure evolution → measurable behavior change |
| **Tier A (proxy)** | Structure exported as `model_patch` applied to external Transformer weights |
| **Tier B (native)** | Structure evolution + native decode; no `model.generate()` |
| **strict MCQ** | Must extract `ANSWER: X` or final-line letter; no substring fallback |
| **Body** | `hub` / `tile` / `stemcell` / `triad` — subsystems enabled at export |

---

## 2. Benchmark Design

### 2.1 Prompt suite

- **File**: `tools/valhalla_model_bridge/incubation_benchmark_suite.json`
- **Size**: 48 prompts, 13 domains
- **Scoring**: `numeric`, `mcq` (strict), `open`

### 2.2 Corpus tiers

| Tier | Lines | Phase |
|------|-------|-------|
| small | 22 | pilot |
| medium | 56 | standard |
| large | 110 | full (planned) |

### 2.3 Tier A control arms

| Arm | Mechanism |
|-----|-----------|
| hub_c1 / stemcell_c1 / triad_c1 | Valhalla export → patch @ 0.08 |
| random_patch | Same-geometry random LayerNorm + embed (seed=20260616) |
| prompt_only | Corpus in system prompt, weights unchanged |
| logit_kd | 3B teacher labels → 0.5B lm_head CE, 3 epochs |

### 2.4 Tier B arms

| Arm | corpus | cycles |
|-----|--------|--------|
| baseline_no_corpus | no | 1 |
| hub_c1 / stemcell_c1 / triad_c1 | yes | 1 |
| triad_c10 | yes | 10 |

---

## 3. Tier A: Implementation & Results

### 3.1 Patch geometry

`apply_valhalla_patch` (Python):

- 4 groups of `input_layernorm.weight` scaled by `quad_layer_scales`
- Prompt-token embeddings perturbed by projected `patch_vector`
- strength=0.08 (default)

**Protocol**: **Fresh model load per prompt**; no cumulative patch (collapse at 0.08).

### 3.2 Results (strict_incubation_standard_20260616_0802)

| Arm | Acc after | Gain (pp) | Change rate |
|-----|-----------|-----------|-------------|
| triad_c1 | 66.67% | **-2.08** | ~88% |
| stemcell_c1 | 64.58% | -4.17 | ~92% |
| hub_c1 | 58.33% | -10.42 | ~88% |
| prompt_only | 62.50% | -6.25 | — |
| random_patch | 54.17% | **-14.58** | — |

### 3.3 Methodology correction

Early Hub/Stem **+4.17 pp** came from loose MCQ:

```python
# Disallowed under strict (default):
hit = ref_letter.lower() in low  # "B" in "about" → false positive
```

**Authority**: `reports/VALHALLA_EXPERIMENT_RECORD_CORRECTIONS_20260616.md`

### 3.4 Verifiable claims (Tier A)

| Claim | Evidence | Status |
|-------|----------|--------|
| Patch changes outputs | change_rate 79–92% | ✓ |
| Structure beats random | triad -2.08 vs random -14.58 | ✓ |
| Strict net acc gain | All Valhalla arms ≤ 0 | ✓ none |
| No Valhalla hallucination on external Q | 0 keyword hits | ✓ |

---

## 4. Tier B: Implementation & Results

### 4.1 Native decode stack

**Binary**: `valhalla_native_qa`  
**Source**: `manifestsys/hub-f64/src/native_qa.rs`

```
corpus[] + question → TriadSession.feed (NormalizedF64)
                   → finalize_with_cycles(N)
                   → hub_prefs + patch_vector + tile/stem signatures
                   → decode_mcq | decode_numeric | decode_open
```

**v2 numeric decode**:

- `try_direct_math`, `try_word_problem`, `cortex_numeric_candidates`
- Fate-weighted `score_memories`

### 4.2 Results (tier_b_native_standard_20260616_0847)

| Arm | Correct | Acc | Δ vs baseline |
|-----|---------|-----|---------------|
| baseline_no_corpus | 11/48 | 22.92% | — |
| triad_c1 | 12/48 | 25.00% | +2.08 pp |
| triad_c10 | 12/48 | 25.00% | +2.08 pp |

**Numeric subset (triad_c1)**: **8/9** correct (GSM_01–04, MATH_01–04; GSM_05 miss)

### 4.3 Convergence

`triad_c10` ≡ `triad_c1` on accuracy — consistent with Tier A: Tile/Stem 1-cycle Fate convergence; extra cycles **no benefit**.

---

## 5. KD Control Experiment

### 5.1 Protocol

- **Teacher**: Qwen/Qwen2.5-3B-Instruct, labels on 48Q
- **Student**: Qwen/Qwen2.5-0.5B-Instruct, **lm_head only** trainable
- **Training**: fp32, 3 epochs, lr=1e-5, grad clip 1.0
- **Script**: `tools/valhalla_model_bridge/run_kd_distill.py`

### 5.2 Results

| Metric | Value |
|--------|-------|
| Acc before | 68.75% (33/48) |
| Acc after | **91.67%** (44/48) |
| Gain | **+22.92 pp** |

### 5.3 Side-by-side with Valhalla

| Dimension | Valhalla Tier A (best) | KD |
|-----------|------------------------|-----|
| Gradients | No | Yes |
| Teacher | No | 3B |
| 48Q strict Δ | -2.08 pp | +22.92 pp |

---

## 6. Limits & Future Work

| Limit | Note |
|-------|------|
| Sample size | 48Q; ±1 Q ≈ ±2.08 pp |
| Tier B generation | Retrieval + rules, not autoregressive |
| Corpus | 56-line medium tier |
| Multi-cycle | No gain; needs new ingress signals |

**Roadmap**: speak.rs integration · 200+ Q benchmark · vertical POC native decode

---

## 7. Reproduction

```bash
RUSTFLAGS='-L /opt/cuda/lib64' cargo build -p hub-f64 --release \
  --bin valhalla_model_export --bin valhalla_native_qa

export HF_ENDPOINT=https://hf-mirror.com
python3 tools/valhalla_model_bridge/run_strict_incubation_experiment.py --phase standard
python3 tools/valhalla_model_bridge/run_tier_b_incubation.py --phase standard
.venv-llm/bin/python tools/valhalla_model_bridge/run_kd_distill.py --phase standard --train
```

---

## 8. References

| Document | Role |
|----------|------|
| VALHALLA_TECHNICAL_WHITEPAPER.md | Hub/Tile/Stem engineering |
| VALHALLA_AI_INCUBATION_BENCHMARK_DESIGN.md | Benchmark design |
| VALHALLA_EXPERIMENT_RECORD_CORRECTIONS_20260616.md | Authoritative corrections |

---

*Rogue Intelligence LNC. · Whitepaper v1.0 · 2026-06-16*
