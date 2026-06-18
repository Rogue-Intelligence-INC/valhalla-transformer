# Tile / StemCell Hard Multi-Slice Experiment

**Run**: `20260619_0213` · 79 prompts · medium corpus 56 lines · 3 rounds  
**JSON**: `experiments/tile_stemcell_hard_20260619_0213.json`  
**Scope**: **Tile** and **StemCell** only (not Hub / monolithic Valhalla)

---

## Evaluation design (5 slices)

| Slice | Difficulty | Count | Content |
|-------|------------|-------|---------|
| `core_pilot` | baseline | 12 | pilot core |
| `math_word_all` | hard | 31 | all GSM + GSM_F word problems |
| `math_numeric_hard` | hard | 20 | MATH + MATH_F01–F16 |
| `mcq_science` | medium | 16 | phys/chem/bio + MCQ_F01–10 |
| `mcq_cross_domain` | medium | 12 | history/geo/econ/CS/phil MCQ |

**Protocols**: `direct_cumulative` · `tf_front_fresh_reload`  
**Patch compare**: legacy@0.08 vs full@0.02

**Baseline (79 prompts)**: **54.43%** (43/79)

---

## Tile

### Ingress

- `tile_count = 93` · `stem_cell_count = 0` · quad scales ≈ 1.0

### Full-set accuracy

| Protocol | patch | Final | Δ | Improved | Regressed |
|----------|-------|-------|---|----------|-----------|
| direct_cumulative | **legacy 0.08** | **55.70%** | **+1.27 pp** | GSM_03, GSM_F26, MATH_F03, MCQ_F03, MCQ_PHIL_01 | MATH_F02, MCQ_F07, MCQ_F09, MCQ_F10 |
| fresh_reload | legacy 0.08 | 53.16% | -1.27 pp | GSM_F26 | MCQ_F07, MCQ_F10 |
| direct_cumulative | full 0.02 | 51.90% | -2.53 pp | GSM_F26, MATH_F09 | GSM_04, GSM_05, MCQ_BIO_01, MCQ_F10 |
| fresh_reload | full 0.02 | 51.90% | -2.53 pp | — | MCQ_F07, MCQ_F10 |

### Slice Δ (direct · pp)

| patch | core | math_word | math_num | mcq_sci | mcq_xdom |
|-------|------|-----------|----------|---------|----------|
| legacy 0.08 | **+8.3** | **+6.5** | 0.0 | **-12.5** | **+8.3** |
| full 0.02 | -8.3 | -3.2 | **+5.0** | -12.5 | 0.0 |

### Tile progress QA (legacy direct)

| ID | Note |
|----|------|
| **GSM_03** | `45` → step reasoning **18** ✅ |
| **GSM_F26** | hard word problem flip |
| **MATH_F03** | numeric flip |
| **MCQ_F03** | science MCQ flip |
| **MCQ_PHIL_01** | cross-domain MCQ flip |

---

## StemCell

### Ingress

- `tile_count = 0` · `stem_cell_count ≈ 193` · quad scales ≈ 1.0015

### Full-set accuracy

| Protocol | patch | Final | Δ | Improved | Regressed |
|----------|-------|-------|---|----------|-----------|
| direct_cumulative | legacy 0.08 | 54.43% | 0.00 pp | GSM_03, GSM_F26, MATH_F03, MATH_F14 | MATH_F02, MCQ_F05, MCQ_F07, MCQ_F09 |
| fresh_reload | legacy 0.08 | 54.43% | 0.00 pp | GSM_F26 | MCQ_F07 |
| direct_cumulative | **full 0.02** | **54.43%** | 0.00 pp | GSM_F06, GSM_F26, MATH_F09, MCQ_F03 | GSM_04, MCQ_F07, MCQ_F09, MCQ_F10 |
| fresh_reload | full 0.02 | 53.16% | -1.27 pp | GSM_F26 | MCQ_F07, MCQ_F10 |

### Slice Δ (direct · pp)

| patch | core | math_word | math_num | mcq_sci | mcq_xdom |
|-------|------|-----------|----------|---------|----------|
| legacy 0.08 | **+8.3** | **+6.5** | **+5.0** | -18.8 | 0.0 |
| full 0.02 | -8.3 | **+3.2** | **+5.0** | -12.5 | 0.0 |

### StemCell-specific

- **MATH_F14** flip (Tile did not)
- **math_numeric +5 pp** on both legacy and full direct
- **full 0.02 direct** holds 54.43% full set; **math_word +3.2 pp**

---

## Tile vs StemCell (hard 79)

| Dimension | Tile | StemCell |
|-----------|------|----------|
| legacy direct full set | **55.70%** (+1.27) | 54.43% (0) |
| legacy math_num slice | 0 pp | **+5.0 pp** |
| legacy mcq_sci slice | -12.5 pp | **-18.8 pp** |
| full direct full set | 51.90% (-2.53) | **54.43% (0)** |

1. **Word problems**: both legacy +6.5 pp on math_word; GSM_03 gain reproduces.  
2. **Numeric**: StemCell stronger (+5 pp; MATH_F14 only on Stem).  
3. **Science MCQ**: both regress heavily on hard MCQ.  
4. **Full patch**: hurts Tile more; Stem full direct holds baseline.

---

*Rogue Intelligence LNC. · Tile / StemCell only · 20260619_0213*
