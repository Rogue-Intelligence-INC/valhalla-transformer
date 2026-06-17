# TF-Front Cumulative Patch — This Experiment Only

**Run ID**: `20260617_1150`  
**JSON**: [`experiments/tf_front_cumulative_pilot_20260617_1150.json`](../experiments/tf_front_cumulative_pilot_20260617_1150.json)

---

## 1. Design

**Protocol**: corpus batch → LLM paraphrase → Valhalla export → **cumulative patch on one Qwen2.5-0.5B instance** (no reload) → strict eval.

**Scale**: 12 prompts · 24-line small corpus · **3 rounds** · triad · strength 0.08

| Arm | Corpus path | Model |
|-----|---------------|-------|
| `tf_front_cumulative` | corpus → **LLM** → Valhalla | cumulative patch |
| `valhalla_direct_cumulative` | corpus **direct** → Valhalla | cumulative patch |
| `tf_front_fresh_reload` | corpus → LLM → Valhalla | **reload each round** |

---

## 2. Progress or regression?

| Arm | Baseline | Final | Verdict |
|-----|----------|-------|---------|
| tf_front_cumulative | 50% (6/12) | 50% | **Flat** |
| **valhalla_direct_cumulative** | 50% | **58.33% (7/12)** | **+1 question** |
| tf_front_fresh_reload | 50% | 50% | **Flat** |

- **No regression**: no correct→incorrect flips.
- **Progress**: direct cumulative arm only, after **round 2** patch.

---

## 3. Highlights

1. Full E2E: 3 rounds × 3 arms; patch L2 ≈ 0.36; no crash or full collapse.
2. **GSM_03 flip**: direct arm round 2 fixes one word problem (ref 18).
3. Previously correct items stay correct (MATH_01–04, GSM_04, MCQ_PHYS_01).
4. LLM paraphrases are semantically faithful.

---

## 4. Problems

1. **Both LLM-front arms: zero gain** (50% throughout).
2. **LLM front underperforms direct** on same cumulative protocol (50% vs 58.33%).
3. **GSM weak**: best 6/8 numeric; GSM_01/02 still wrong.
4. **MCQ unchanged**: 1/4; missing valid `ANSWER: X` on most.
5. **Round 3 marginal zero**: all direct gain in round 2.
6. **Ultra-short wrong numerics** on some word items (e.g. GSM_03 → "46").

---

## 5. Final by type (direct arm)

| Type | Score |
|------|-------|
| numeric (8) | **6/8** |
| mcq (4) | 1/4 |

---

## 6. Run conclusion

| | |
|--|--|
| **Progress** | direct cumulative +1 Q; pipeline reproducible |
| **Regression** | none |
| **Flat** | both LLM-front arms |
| **Finding** | **Direct corpus → Valhalla cumulative patch beats LLM-front on this 12Q pilot** |

---

*20260617_1150 · pilot only*
