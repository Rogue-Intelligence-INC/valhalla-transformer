# TF-Front Cumulative Patch — Body Split + LLM Front (this run only)

**Run ID**: `20260617_1234`

## Design

**4 bodies × 3 protocols = 12 arms** (hub / tile / stemcell / triad):

- `tf_front_cumulative` — corpus → **LLM paraphrase** → Valhalla → **cumulative** patch  
- `direct_cumulative` — corpus → Valhalla → **cumulative** patch  
- `tf_front_fresh_reload` — corpus → LLM → Valhalla → **reload each round**

12 prompts · 24-line small corpus · 3 rounds · strength 0.08

## Final results

| Arm | Final | Δ |
|-----|-------|---|
| hub (all 3) | 50% | 0 |
| tile/stem direct + tile/stem tf_front cumulative | **58.33%** | **+8.33 pp** |
| triad direct | **58.33%** | **+8.33 pp** |
| triad tf_front cumulative | 50% | 0 |
| all fresh_reload | 50% | 0 |

## Conclusion (this run)

- **Progress**: tile / stem / triad **direct cumulative** +1 Q (GSM_03); **tile/stem LLM-front cumulative** also 58.33%  
- **Flat**: hub all arms; triad LLM-front; all fresh_reload  
- **Regression vs baseline**: none (no correct→incorrect flips)  
- **Issue**: hub arms hit 58.33% at round 2 then **dropped back** to 50% at round 3  

JSON: `experiments/tf_front_body_matrix_pilot_20260617_1234.json`
