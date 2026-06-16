<script setup>
import { ref } from "vue";

const body = ref("triad");
const scoreType = ref("open");
const question = ref("What is 12 + 30?");
const corpus = ref("Valhalla encodes text as f64 signals.\nHub routes to four quads.");
const loading = ref(false);
const result = ref(null);
const error = ref(null);

async function runQa() {
  loading.value = true;
  error.value = null;
  result.value = null;
  try {
    const r = await fetch("/api/qa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body: body.value,
        cycles: 1,
        score_type: scoreType.value,
        question: question.value,
        corpus: corpus.value.split("\n").filter(Boolean),
      }),
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || r.statusText);
    result.value = j;
  } catch (e) {
    error.value = String(e.message || e);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="panel">
    <h2>POST /api/qa — Tier B 原生测试</h2>
    <div class="form-row">
      <label>body</label>
      <select v-model="body">
        <option value="hub">hub</option>
        <option value="tile">tile</option>
        <option value="stemcell">stemcell</option>
        <option value="triad">triad</option>
      </select>
    </div>
    <div class="form-row">
      <label>score_type</label>
      <select v-model="scoreType">
        <option value="numeric">numeric</option>
        <option value="mcq">mcq</option>
        <option value="open">open</option>
      </select>
    </div>
    <div class="form-row">
      <label>question</label>
      <input v-model="question" />
    </div>
    <div class="form-row">
      <label>corpus（每行一条）</label>
      <textarea v-model="corpus" />
    </div>
    <button class="btn" :disabled="loading" @click="runQa">{{ loading ? "运行中…" : "运行 QA" }}</button>
    <p v-if="error" style="color: var(--regress)">{{ error }}</p>
    <pre v-if="result" class="result">{{ JSON.stringify(result, null, 2) }}</pre>
  </div>
</template>
