"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

// Ember field: domain-warped fbm smoke in the brand palette, a god-ray
// spotlight that trails the cursor, and sparse dust sparkles.
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    v += noise(p) * amp;
    p = p * 2.02 + vec2(1.7, 9.2);
    amp *= 0.5;
  }
  return v;
}

void main() {
  float t = uTime * 0.05 + uScroll * 0.00008;
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = uv;
  p.x *= uRes.x / uRes.y;

  vec2 m = uMouse;

  vec2 q = vec2(fbm(p * 1.4 + t), fbm(p * 1.6 - t));
  float f = fbm(p * 2.1 + q * 1.35 + m * 0.12 + vec2(0.0, -t * 0.55));

  vec3 base = vec3(0.031, 0.027, 0.024);
  vec3 oxblood = vec3(0.408, 0.184, 0.176);
  vec3 copper = vec3(0.788, 0.529, 0.384);
  vec3 cream = vec3(0.953, 0.929, 0.890);

  vec3 col = base;
  col = mix(col, oxblood * 0.42, smoothstep(0.32, 0.62, f) * 0.6);
  col = mix(col, copper * 0.72, smoothstep(0.55, 0.85, f) * 0.45);
  col = mix(col, copper * 1.05, smoothstep(0.78, 0.98, f) * 0.35);

  // god-ray spotlight: upper-left anchor, eased toward the cursor
  vec2 light = vec2(0.24, 0.92) + m * vec2(0.06, -0.04);
  float beam = smoothstep(0.95, 0.0, distance(p * vec2(0.75, 1.0), light * vec2(0.75, 1.0)));
  col += copper * beam * beam * 0.20 + cream * pow(beam, 4.0) * 0.16;

  // drifting dust sparkles that catch the light
  vec2 cell = floor(gl_FragCoord.xy * 0.55);
  float twinkle = step(0.9975, hash(cell + floor(uTime * 1.6)));
  col += cream * twinkle * (0.25 + beam * 0.5);

  // slow scroll evolution
  col *= 0.92 + 0.08 * sin(uScroll * 0.0006);

  // vignette
  float vig = smoothstep(1.25, 0.35, distance(uv, vec2(0.5, 0.42)));
  col *= vig;

  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * Full-viewport GLSL atmosphere layer. Fixed, pointer-transparent, renders at
 * 2/3 resolution, pauses when the tab is hidden, and freezes on reduced motion.
 */
export function EmberField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn("EmberField: shader compile failed", gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    };

    const prog = gl.createProgram();
    if (!prog) return;
    const vert = compile(gl.VERTEX_SHADER, VERT);
    const frag = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vert || !frag) return;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("EmberField: shader link failed", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uScroll = gl.getUniformLocation(prog, "uScroll");

    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const resize = () => {
      const w = Math.max(1, Math.floor(window.innerWidth * dpr * 0.66));
      const h = Math.max(1, Math.floor(window.innerHeight * dpr * 0.66));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    resize();

    const target = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (1 - e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    let pageVisible = true;
    const start = performance.now();
    const frame = () => {
      if (!pageVisible || document.hidden) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
      const t = (performance.now() - start) / 1000;
      mouse.x += (target.x - mouse.x) * 0.045;
      mouse.y += (target.y - mouse.y) * 0.045;
      gl.uniform1f(uTime, reduced ? 20 : t);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uScroll, window.scrollY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(frame);

    const io = new IntersectionObserver(
      ([entry]) => {
        pageVisible = entry.isIntersecting;
        if (pageVisible && !raf) raf = requestAnimationFrame(frame);
      },
      { rootMargin: "80px" },
    );
    io.observe(canvas);
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    const onHidden = () => {
      if (!document.hidden && !raf) raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onHidden);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onHidden);
      // No loseContext here: React strict mode remounts the effect on the same
      // canvas, and a lost context can never be revived — the canvas would
      // render white forever. GC reclaims the context with the canvas.
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 h-full w-full ${className}`}
    />
  );
}

export default EmberField;