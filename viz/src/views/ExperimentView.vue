<script setup>
import { ref, onMounted, computed } from "vue";

const data = ref(null);
const diff = ref(null);

const arms = computed(() => {
  if (!data.value?.tier_b) return [];
  const tb = data.value.tier_b;
  const items = [
    { key: "baseline", label: "baseline", acc: tb.baseline?.summary?.acc ?? 0, color: "#8b9cb3" },
    { key: "hub_c1", label: "hub", acc: tb.hub_c1?.summary?.acc ?? 0, color: "#e6b450" },
    { key: "tile_c1", label: "tile", acc: tb.tile_c1?.summary?.acc ?? 0, color: "#56b6c2" },
    { key: "stemcell_c1", label: "stem", acc: tb.stemcell_c1?.summary?.acc ?? 0, color: "#c678dd" },
    { key: "triad_c1", label: "triad", acc: tb.triad_c1?.summary?.acc ?? 0, color: "#61afef" },
  ];
  const tf = data.value.transformer_baseline?.summary?.acc;
  if (tf != null) items.push({ key: "tf", label: "Transformer", acc: tf, color: "#f07178" });
  return items;
});

const scoreTypes = computed(() => {
  if (!data.value?.tier_b?.triad_c1?.by_score_type) return [];
  const triad = data.value.tier_b.triad_c1.by_score_type;
  const tf = data.value.transformer_baseline?.by_score_type || {};
  return Object.keys(triad).map((st) => ({
    type: st,
    triad: (triad[st]?.acc ?? 0) * 100,
    tf: (tf[st]?.acc ?? 0) * 100,
  }));
});

onMounted(async () => {
  const [exp, bd] = await Promise.all([
    fetch("/api/experiments/fundraise_mvp_20260616_1143").then((r) => r.json()),
    fetch("/api/body-diff").then((r) => r.json()),
  ]);
  data.value = exp;
  diff.value = bd;
});
</script>

<template>
  <div v-if="!data" class="panel">加载实验数据…</div>
  <template v-else>
    <div class="panel">
      <h2>200Q 各臂准确率（fundraise_mvp_20260616_1143）</h2>
      <div v-for="a in arms" :key="a.key" class="bar-row">
        <span>{{ a.label }}</span>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: a.acc * 100 + '%', background: a.color }" />
        </div>
        <span>{{ (a.acc * 100).toFixed(1) }}%</span>
      </div>
      <p style="color: var(--muted); font-size: 0.85rem; margin: 0.75rem 0 0">
        triad + corpus Δ 0pp（CI [-2,+2]）· 单 body -1pp · numeric 四臂均为 61.02%
      </p>
    </div>

    <div class="panel">
      <h2>分题型：Tier B triad vs Transformer</h2>
      <div v-for="s in scoreTypes" :key="s.type" class="bar-row">
        <span>{{ s.type }}</span>
        <div class="bar-track" style="display: flex; gap: 2px; background: transparent">
          <div class="bar-fill" :style="{ width: s.triad + '%', background: '#61afef', flex: 1 }" />
          <div class="bar-fill" :style="{ width: s.tf + '%', background: '#f07178', flex: 1, opacity: 0.7 }" />
        </div>
        <span>{{ s.triad.toFixed(0) }} / {{ s.tf.toFixed(0) }}</span>
      </div>
      <p style="color: var(--muted); font-size: 0.8rem">蓝=triad · 红=Transformer</p>
    </div>

    <div class="panel" v-if="diff">
      <h2>Body 分歧题（16 / 200）</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>type</th><th>base</th><th>hub</th><th>tile</th><th>stem</th><th>triad</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="q in diff.questions" :key="q.id">
            <td>{{ q.id }}</td>
            <td>{{ q.type }}</td>
            <td>{{ q.baseline ? "✓" : "✗" }}</td>
            <td>{{ q.hub_c1 ? "✓" : "✗" }}</td>
            <td>{{ q.tile_c1 ? "✓" : "✗" }}</td>
            <td>{{ q.stemcell_c1 ? "✓" : "✗" }}</td>
            <td>{{ q.triad_c1 ? "✓" : "✗" }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
</template>
