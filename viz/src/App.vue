<script setup>
import { ref, onMounted } from "vue";
import ExperimentView from "./views/ExperimentView.vue";
import BodyInternalsView from "./views/BodyInternalsView.vue";
import ProgressView from "./views/ProgressView.vue";
import QaPlayground from "./views/QaPlayground.vue";

const tab = ref("experiment");
const health = ref(null);

onMounted(async () => {
  try {
    const r = await fetch("/api/health");
    health.value = await r.json();
  } catch {
    health.value = { ok: false };
  }
});
</script>

<template>
  <div class="app">
    <header>
      <h1>Valhalla vs Transformer</h1>
      <p>
        200Q 实验可视化 · Body 内部机制 · Tier B QA 测试接口
        <span v-if="health?.native_qa === 'available'" style="color: var(--progress)"> · native_qa 已连接</span>
        <span v-else style="color: var(--muted)"> · mock QA（设置 VALHALLA_NATIVE_QA 启用实跑）</span>
      </p>
    </header>

    <nav>
      <button :class="{ active: tab === 'experiment' }" @click="tab = 'experiment'">200Q 实验</button>
      <button :class="{ active: tab === 'bodies' }" @click="tab = 'bodies'">Hub / Tile / Stem</button>
      <button :class="{ active: tab === 'progress' }" @click="tab = 'progress'">进步 / 退步</button>
      <button :class="{ active: tab === 'qa' }" @click="tab = 'qa'">QA 测试</button>
    </nav>

    <ExperimentView v-if="tab === 'experiment'" />
    <BodyInternalsView v-if="tab === 'bodies'" />
    <ProgressView v-if="tab === 'progress'" />
    <QaPlayground v-if="tab === 'qa'" />
  </div>
</template>
