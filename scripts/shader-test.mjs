// Standalone shader harness: same FRAG as ember-field, rendered on a blank page.
import { chromium } from "playwright";
import fs from "node:fs";

const ember = fs.readFileSync("src/components/ui/ember-field.tsx", "utf8");
const frag = ember.match(/const FRAG = `\n([\s\S]*?)`;/)?.[1];
if (!frag) throw new Error("FRAG not found");

const html = `<!doctype html><html><body style="margin:0">
<canvas id="c" width="600" height="400"></canvas>
<script>
const VERT = "attribute vec2 aPos; void main() { gl_Position = vec4(aPos, 0.0, 1.0); }";
const FRAG = ${JSON.stringify(frag)};
const gl = document.getElementById("c").getContext("webgl");
window.addEventListener("error", (e) => console.log("GLERR", e.message));
const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.log("SHADER LOG:", gl.getShaderInfoLog(s)); return null; } return s; };
const v = compile(gl.VERTEX_SHADER, VERT), f = compile(gl.FRAGMENT_SHADER, FRAG);
const p = gl.createProgram(); gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p);
if (!gl.getProgramParameter(p, gl.LINK_STATUS)) console.log("LINK:", gl.getProgramInfoLog(p));
gl.useProgram(p);
const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
const loc = gl.getAttribLocation(p, "aPos");
gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
const uRes = gl.getUniformLocation(p, "uRes"); const uTime = gl.getUniformLocation(p, "uTime");
const uMouse = gl.getUniformLocation(p, "uMouse"); const uScroll = gl.getUniformLocation(p, "uScroll");
gl.uniform2f(uRes, 600, 400); gl.uniform1f(uTime, 5); gl.uniform2f(uMouse, 0.3, 0.2); gl.uniform1f(uScroll, 0);
gl.drawArrays(gl.TRIANGLES, 0, 3);
const px = new Uint8Array(4); gl.readPixels(300, 200, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
console.log("PIXEL:", Array.from(px).join(","));
// loseContext → re-getContext (simulates React strict-mode double mount)
const lose = gl.getExtension("WEBGL_lose_context");
lose.loseContext();
const gl2 = document.getElementById("c").getContext("webgl");
console.log("REGET same:", gl2 === gl, "isContextLost:", gl2.isContextLost());
try { gl2.drawArrays(gl.TRIANGLES, 0, 3); console.log("draw on lost ctx ok"); } catch (e) { console.log("draw err", e.message); }
</script></body></html>`;

fs.writeFileSync("/tmp/shader-test.html", html);
const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage();
page.on("console", (m) => console.log("[console]", m.text()));
await page.goto("file:///tmp/shader-test.html");
await page.waitForTimeout(1500);
await page.screenshot({ path: "/tmp/shader-test.png" });
await browser.close();
console.log("done");