<script setup>
import { ref, onMounted, computed } from "vue";

const runs = ref([]);
const selectedId = ref("");
const data = ref(null);
const spec = ref(null);

const tracks = computed(() => {
  if (!data.value?.results) return {};
  const out = { memory_tier_b: [], patch_tier_a: [], generate_baseline: [] };
  for (const r of data.value.results) {
    const t = r.track || "memory_tier_b";
    if (out[t]) out[t].push(r);
  }
  return out;
});

async function loadRun(id) {
  selectedId.value = id;
  data.value = await fetch(`/api/fair-benchmark/${id}`).then((r) => r.json());
}

onMounted(async () => {
  const [list, sp] = await Promise.all([
    fetch("/api/fair-benchmark").then((r) => r.json()),
    fetch("/api/fair-benchmark/spec").then((r) => r.json()).catch(() => null),
  ]);
  runs.value = list.runs || [];
  spec.value = sp;
  if (runs.value.length) await loadRun(runs.value[0].id);
});
</script>

<template>
  <div v-if="!runs.length" class="panel">
    <h2>Fair Benchmark</h2>
    <p style="color: var(--muted)">
      无 fair_benchmark_*.json — 在 Valhalla 运行
      <code>python tools/fair_benchmark/run_fair_benchmark.py --phase test --full</code>
    </p>
  </div>
  <template v-else>
    <div class="panel">
      <h2>Fair Benchmark · 实验选择</h2>
      <select v-model="selectedId" @change="loadRun(selectedId)" style="max-width: 100%">
        <option v-for="r in runs" :key="r.id" :value="r.id">
          {{ r.id }} — {{ r.phase }} · {{ r.prompt_count }}Q · acc mem={{ r.memory_acc ?? "—" }}
        </option>
      </select>
      <p v-if="data?.meta" style="color: var(--muted); font-size: 0.85rem; margin-top: 0.5rem">
        split={{ data.meta.split }} · corpus={{ data.meta.corpus_tier }} ({{ data.meta.corpus_lines }} lines)
        · clean={{ data.meta.corpus_clean }}
        · tracks: mem {{ data.meta.with_memory }} / patch {{ data.meta.with_patch }} / gen {{ data.meta.with_transformer }}
      </p>
    </div>

    <div v-for="(arms, trackName) in tracks" :key="trackName" class="panel">
      <h2>{{ trackName }}</h2>
      <div v-for="a in arms" :key="a.arm" class="bar-row">
        <span>{{ a.arm }}</span>
        <div class="bar-track">
          <div
            class="bar-fill"
            :style="{
              width: (a.summary?.acc ?? a.acc ?? 0) * 100 + '%',
              background: trackName === 'generate_baseline' ? '#f07178' : trackName === 'patch_tier_a' ? '#c678dd' : '#61afef',
            }"
          />
        </div>
        <span>{{ ((a.summary?.acc ?? a.acc ?? 0) * 100).toFixed(1) }}%</span>
      </div>
    </div>

    <div class="panel" v-if="spec">
      <h2>协议摘要</h2>
      <pre style="white-space: pre-wrap; font-size: 0.8rem; color: var(--muted)">{{ spec.summary }}</pre>
    </div>
  </template>
</template>
