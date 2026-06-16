import { describe, it } from "node:test";
import assert from "node:assert/strict";
import request from "node:http";

import app from "../server.js";

function httpGet(port, path) {
  return new Promise((resolve, reject) => {
    const req = request.get({ hostname: "127.0.0.1", port, path }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.on("error", reject);
  });
}

describe("valhalla-transformer API", () => {
  let server;
  let port;

  it("setup", () => {
    server = app.listen(0);
    port = server.address().port;
  });

  it("GET /api/health", async () => {
    const { status, body } = await httpGet(port, "/api/health");
    assert.equal(status, 200);
    assert.equal(body.ok, true);
  });

  it("GET /api/experiments", async () => {
    const { status, body } = await httpGet(port, "/api/experiments");
    assert.equal(status, 200);
    assert.ok(Array.isArray(body.experiments));
    assert.ok(body.experiments.length >= 1);
  });

  it("GET /api/bodies", async () => {
    const { status, body } = await httpGet(port, "/api/bodies");
    assert.equal(status, 200);
    assert.ok(body.modules.hub);
    assert.ok(body.modules.triad);
  });

  it("GET /api/progress", async () => {
    const { status, body } = await httpGet(port, "/api/progress");
    assert.equal(status, 200);
    assert.ok(body.progress.length > 0);
    assert.ok(body.regression.length > 0);
  });

  it("teardown", () => {
    server.close();
  });
});
