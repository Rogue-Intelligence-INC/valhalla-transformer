<script setup>
import { ref, onMounted } from "vue";

const bodies = ref(null);

onMounted(async () => {
  const r = await fetch("/api/bodies");
  bodies.value = (await r.json()).modules;
});
</script>

<template>
  <div v-if="!bodies" class="panel">加载…</div>
  <template v-else>
    <div class="panel">
      <h2>语料进入 Body 后发生什么</h2>
      <p style="color: var(--muted); font-size: 0.9rem; margin: 0 0 1rem">
        每行语料 → f64 编码 → <code>TriadSession::with_body(hub|tile|stemcell|triad)</code>
        → feed → finalize_with_cycles(1) → patch_vector + 解码
      </p>
      <div
        v-for="(mod, key) in bodies"
        :key="key"
        class="body-card"
        :class="key"
      >
        <h3>{{ mod.label }}（{{ mod.metaphor }}）</h3>
        <p style="margin: 0; font-size: 0.85rem"><strong>Ingress:</strong> {{ mod.ingress }}</p>
        <ul>
          <li v-for="(line, i) in mod.internal" :key="i">{{ line }}</li>
        </ul>
        <p style="font-size: 0.8rem; color: var(--muted); margin: 0.5rem 0 0">
          导出: {{ mod.exports.join(", ") }} · 单 body 效应: {{ mod.single_body_effect }}
        </p>
      </div>
    </div>

    <div class="panel">
      <h2>Tier B 解码路径（200Q baseline）</h2>
      <table>
        <thead><tr><th>路径</th><th>命中</th><th>说明</th></tr></thead>
        <tbody>
          <tr><td>direct_math</td><td>26/26</td><td>纯算式，结构 decode 满命中</td></tr>
          <tr><td>word_problem</td><td>4/4</td><td>GSM 应用题</td></tr>
          <tr><td>cortex</td><td>6/29</td><td>复杂 numeric，检索不足</td></tr>
          <tr><td>mcq_option</td><td>11/64</td><td>hub_prefs 加权选项</td></tr>
          <tr><td>open_retrieval</td><td>2/77</td><td>无 LM 生成，几乎不可用</td></tr>
        </tbody>
      </table>
    </div>
  </template>
</template>
