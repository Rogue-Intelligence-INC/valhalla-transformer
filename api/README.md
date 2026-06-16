# Valhalla-Transformer Test API

REST interface for experiment data, body internals, and optional Tier B QA.

## Start

```bash
cd api && npm install && npm start
# → http://127.0.0.1:8780
```

Full stack (API + Vue):

```bash
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh
```

## Environment

| Variable | Default | Purpose |
|----------|---------|---------|
| `VT_API_PORT` | 8780 | API listen port |
| `VALHALLA_NATIVE_QA` | auto-detect | Path to `valhalla_native_qa` binary |
| `VALHALLA_DASHBOARD_URL` | http://127.0.0.1:8765 | Smoke proxy target |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Service status |
| GET | `/api/experiments` | List fundraise JSON runs |
| GET | `/api/experiments/:id` | Full experiment payload |
| GET | `/api/bodies` | Hub/Tile/Stem/Triad internals |
| GET | `/api/progress` | Progress vs regression summary |
| GET | `/api/body-diff` | 16 questions where bodies disagree |
| POST | `/api/qa` | Tier B native QA (or mock) |
| GET | `/api/smoke` | Proxy Valhalla dashboard smoke |

### POST /api/qa

```json
{
  "body": "triad",
  "cycles": 1,
  "score_type": "numeric",
  "question": "What is 12 + 30?",
  "corpus": ["line1", "line2"]
}
```

## Tests

```bash
cd api && npm test
```
