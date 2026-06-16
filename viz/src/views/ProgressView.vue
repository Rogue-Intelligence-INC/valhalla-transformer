<script setup>
import { ref, onMounted } from "vue";

const pr = ref(null);

onMounted(async () => {
  pr.value = await fetch("/api/progress").then((r) => r.json());
});
</script>

<template>
  <div v-if="!pr" class="panel">加载…</div>
  <div v-else class="grid2">
    <div class="panel">
      <h2><span class="tag progress">进步</span> 可以对外说的</h2>
      <ul>
        <li v-for="(p, i) in pr.progress" :key="i">
          <strong>{{ p.area }}</strong> — {{ p.detail }}
        </li>
      </ul>
    </div>
    <div class="panel">
      <h2><span class="tag regress">退步 / 未达成</span> 必须诚实披露的</h2>
      <ul>
        <li v-for="(r, i) in pr.regression" :key="i">
          <strong>{{ r.area }}</strong> — {{ r.detail }}
        </li>
      </ul>
    </div>
    <div class="panel" style="grid-column: 1 / -1">
      <h2>为什么「进步」和「退步」可以同时成立</h2>
      <p style="margin: 0; color: var(--muted); font-size: 0.9rem">
        Valhalla 的进步在<strong>范式</strong>（可测、可分离、可复现、有结构信息）；
        退步在<strong>能力</strong>（整体 acc、open 生成、语料稳定增益）。
        Tier A 证明 patch 不是随机噪声；Tier B 证明原生路径能跑，但 numeric 楔子 61% 远不足以替代 68% 的 0.5B。
        48Q +2.08pp 是样本噪声，200Q CI 已把它排除。
      </p>
    </div>
  </div>
</template>
