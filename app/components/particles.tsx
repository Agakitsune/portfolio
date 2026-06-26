"use client";

import React, { useRef, useEffect, useState } from "react";
import { useMousePosition } from "@/util/mouse";
import { mat4 } from "gl-matrix";
import { resolve4 } from "dns";

interface ParticlesProps {
	className?: string;
	quantity?: number;
	staticity?: number;
	ease?: number;
	refresh?: boolean;
}

export default function Particles({
	className = "",
	quantity = 30,
	staticity = 50,
	ease = 50,
	refresh = false,
}: ParticlesProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const canvasContainerRef = useRef<HTMLDivElement>(null);
	const context = useRef<WebGL2RenderingContext | null>(null);
  const program = useRef<WebGLProgram | null>(null);
  const vao = useRef<WebGLVertexArrayObject | null>(null);
  const vbo = useRef<WebGLBuffer | null>(null);
  const ibo = useRef<WebGLBuffer | null>(null);
  const star_ebo = useRef<WebGLBuffer | null>(null);
  const tri_program = useRef<WebGLProgram | null>(null);
  const tri_vao = useRef<WebGLVertexArrayObject | null>(null);
  const tri_ebo = useRef<WebGLBuffer | null>(null);
  const proj = useRef<mat4>(mat4.create());
	const points = useRef<any[]>([]);
	const mousePosition = useMousePosition();
	const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
	const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

	useEffect(() => {
		if (canvasRef.current) {
			context.current = canvasRef.current.getContext("webgl2");
		}
		initCanvas();
		animate();
		window.addEventListener("resize", initCanvas);

		return () => {
			window.removeEventListener("resize", initCanvas);
		};
	}, []);

	useEffect(() => {
		onMouseMove();
	}, [mousePosition.x, mousePosition.y]);

	useEffect(() => {
		initCanvas();
	}, [refresh]);

	const initCanvas = () => {
		resizeCanvas();
    initResources();
		drawParticles();
	};

	const onMouseMove = () => {
		if (canvasRef.current) {
			const rect = canvasRef.current.getBoundingClientRect();
			const { w, h } = canvasSize.current;
			const x = mousePosition.x - rect.left - w / 2;
			const y = mousePosition.y - rect.top - h / 2;
			const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
			if (inside) {
				mouse.current.x = x;
				mouse.current.y = y;
			}
		}
	};

	type Triangle = {
		a: number;
		b: number;
		c: number;
	};

	type Circle = {
		x: number;
		y: number;
		r: number;
	};

	type Point = {
		x: number,
		y: number,
		translateX: number;
		translateY: number;
		size: number;
		alpha: number;
		targetAlpha: number;
		dx: number;
		dy: number;
		magnetism: number;
    rot: number;
	};

	const circumCircle = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number): Circle => {
		const D = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
		if (Math.abs(D) < 1e-10) return { x: 0, y: 0, r: 0 }; // Degenerate case
		const ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / D;
		const uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / D;
		const r = Math.sqrt((ax - ux) ** 2 + (ay - uy) ** 2);
		return { x: ux, y: uy, r };
	}

	const bowyerWatson = (points: Point[]): Triangle[] => {
		if (points.length < 3) return [];

		type Edge = [number, number];
		type Pos = { x: number; y: number };

		const W = 1e5;
		const superTriangle: Pos[] = [
			{ x: -W * 3, y: -W },
			{ x: 0, y: W * 3 },
			{ x: W * 3, y: -W },
		];
		const pts = [...superTriangle, ...points];
		let triangles: Triangle[] = [{ a: 0, b: 1, c: 2 }];

		for (let pi = 3; pi < pts.length; pi++) {
			const px = pts[pi].x;
			const py = pts[pi].y;
			const badTriangles: Triangle[] = [];
			const edges: Edge[] = [];

			for (const tri of triangles) {
				const cc = circumCircle(
					pts[tri.a].x,
					pts[tri.a].y,
					pts[tri.b].x,
					pts[tri.b].y,
					pts[tri.c].x,
					pts[tri.c].y
				);
				if (cc && (px - cc.x) ** 2 + (py - cc.y) ** 2 <= cc.r ** 2 + 1e-6) {
					badTriangles.push(tri);
					edges.push([tri.a, tri.b], [tri.b, tri.c], [tri.c, tri.a]);
				}
			}

			const boundary = edges.filter(([a, b]) =>
				edges.filter(([c, d]) => (a === c && b === d) || (a === d && b === c)).length === 1
			);

			triangles = triangles.filter(t => !badTriangles.includes(t));
			for (const [a, b] of boundary) {
				triangles.push({ a, b, c: pi });
			}
		}

		const superIds = new Set([0, 1, 2]);
		return triangles
			.filter(t => !superIds.has(t.a) && !superIds.has(t.b) && !superIds.has(t.c))
			.map(t => ({
				a: t.a - 3,
				b: t.b - 3,
				c: t.c - 3,
			}));
	}

  const constellation = (points: Point[]): { a: number, b: number }[] => {
    // k-neighbours

    const k = 2;

    const edges: { a: number, b: number }[] = [];

    for (let i = 0; i < points.length; i++) {
      const distances: { index: number, distance: number }[] = [];

      for (let j = 0; j < points.length; j++) {
        if (i !== j) {
          const distance = Math.sqrt(
            (points[i].x - points[j].x) ** 2 +
            (points[i].y - points[j].y) ** 2
          );
          distances.push({ index: j, distance });
        }
      }

      distances.sort((a, b) => a.distance - b.distance);

      for (let n = 0; n < k && n < distances.length; n++) {
        edges.push({ a: i, b: distances[n].index });
      }
    }

    // return edges;

    // const delaunays = clusters.map((cluster: Point[]): Triangle[] => {
    //   return bowyerWatson(cluster).filter((t: Triangle) => {
    //     const cc = circumCircle(
    //       cluster[t.a].x,
    //       cluster[t.a].y,
    //       cluster[t.b].x,
    //       cluster[t.b].y,
    //       cluster[t.c].x,
    //       cluster[t.c].y,
    //     );
    //     return cc.r < 70.0;
    //   });
    // });
    //
    // const lines = delaunays.map((triangles: Triangle[]): { a: number, b: number }[] => {
    // // prune edges that are shared by two triangles
    //
    //  const edges: { a: number, b: number }[] = [];
    //   triangles.forEach((tri: Triangle) => {
    //     edges.push({ a: tri.a, b: tri.b });
    //     edges.push({ a: tri.b, b: tri.c });
    //     edges.push({ a: tri.c, b: tri.a });
    //   });
    //
      const uniqueEdges = edges.filter((edge, index, self) =>
        self.findIndex(e => (e.a === edge.a && e.b === edge.b) || (e.a === edge.b && e.b === edge.a)) === index
      );
    //
    //   return uniqueEdges;
    // });
    //
    // return lines.map((lineSet: { a: number, b: number }[]) => {
    //   // Remove line that exceeds the length threshold
      const threshold = 150; // Adjust this value as needed
      return uniqueEdges.filter((line: { a: number, b: number }) => {
        const pointA = points[line.a];
        const pointB = points[line.b];
        if (!pointA || !pointB) return false;
        const distance = Math.sqrt(
          (pointA.x + - (pointB.x)) ** 2 +
          (pointA.y + - (pointB.y)) ** 2
        );
        return distance <= threshold;
      });
    // }).flat();
  };

	const resizeCanvas = () => {
		if (canvasContainerRef.current && canvasRef.current && context.current) {
			points.current.length = 0;
			canvasSize.current.w = canvasContainerRef.current.offsetWidth;
			canvasSize.current.h = canvasContainerRef.current.offsetHeight;
			canvasRef.current.width = canvasSize.current.w * dpr;
			canvasRef.current.height = canvasSize.current.h * dpr;
			canvasRef.current.style.width = `${canvasSize.current.w}px`;
			canvasRef.current.style.height = `${canvasSize.current.h}px`;

			context.current.viewport(0, 0, canvasSize.current.w * dpr, canvasSize.current.h * dpr);

      mat4.ortho(proj.current, 0, canvasSize.current.w * dpr, canvasSize.current.h * dpr, 0, -1, 1);
		}
	};

  const createShader = (type: number, source: string): WebGLShader | null => {
    if (context.current) {
      const shader = context.current.createShader(type);
      if (!shader) return null;
      context.current.shaderSource(shader, source);
      context.current.compileShader(shader);

      if (!context.current.getShaderParameter(shader, context.current.COMPILE_STATUS)) {
        console.error(context.current.getShaderInfoLog(shader));
        context.current.deleteShader(shader);
        return null;
      }

      return shader;
	}
	return null;
  }

  const initResources = () => {
    if (context.current) {
      const vertexSource = `#version 300 es
      in vec2 a_position;

      in vec2 a_instanceTranslate;
      in float a_instanceSize;
      in float a_instanceAlpha;
      in float a_instanceRot;

      uniform mat4 proj;

      out float f_alpha;

      vec2 rotate(vec2 a) {
          vec2 trig = vec2(cos(a_instanceRot), sin(a_instanceRot));
          return vec2(
              a.x * trig.x - a.y * trig.y,
              a.x * trig.y + a.y * trig.x
          );
      }

      void main() {
          vec2 rotated = rotate(a_position * a_instanceSize);
          gl_Position = proj * vec4((a_instanceTranslate + rotated), 0.0, 1.0);

          f_alpha = a_instanceAlpha;
      }
      `;

      const fragmentSource = `#version 300 es
      precision mediump float;

      in float f_alpha;

      out vec4 outColor;

      void main() {
          outColor = vec4(vec3(1.0), f_alpha);
      }
      `;

      const triVertexSource = `#version 300 es
      in vec2 a_translate;
      in float a_alpha;

      uniform mat4 proj;

      out float f_alpha;

      void main() {
          gl_Position = proj * vec4(a_translate, 0.0, 1.0);

          f_alpha = a_alpha * 0.35;
      }
      `;

      const vertexShader = createShader(
        context.current.VERTEX_SHADER,
        vertexSource
      );

      const fragmentShader = createShader(
        context.current.FRAGMENT_SHADER,
        fragmentSource
      );

      const triVertexShader = createShader(
        context.current.VERTEX_SHADER,
        triVertexSource
      );

      if (!vertexShader || !fragmentShader) return;
      if (!triVertexShader) return;

      program.current = context.current.createProgram();
      context.current.attachShader(program.current, vertexShader);
      context.current.attachShader(program.current, fragmentShader);
      context.current.linkProgram(program.current);

      tri_program.current = context.current.createProgram();
      context.current.attachShader(tri_program.current, triVertexShader);
      context.current.attachShader(tri_program.current, fragmentShader);
      context.current.linkProgram(tri_program.current);

      if (!context.current.getProgramParameter(program.current, context.current.LINK_STATUS)) {
        console.error(context.current.getProgramInfoLog(program.current));
      }
      if (!context.current.getProgramParameter(tri_program.current, context.current.LINK_STATUS)) {
        console.error(context.current.getProgramInfoLog(tri_program.current));
      }

      const star_data = new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        0.25, 0.25,
        0.0, 1.0,
        -0.25, 0.25,
        -1.0, 0.0,
        -0.25, -0.25,
        0.0, -1.0,
        0.25, -0.25
      ]);

      const star_id = new Int32Array([
        0, 1, 2,
        0, 2, 3,
        0, 3, 4,
        0, 4, 5,
        0, 5, 6,
        0, 6, 7,
        0, 7, 8,
        0, 8, 1
      ]);

      vbo.current = context.current.createBuffer();
      context.current.bindBuffer(context.current.ARRAY_BUFFER, vbo.current);
      context.current.bufferData(context.current.ARRAY_BUFFER, star_data, context.current.STATIC_DRAW);

      star_ebo.current = context.current.createBuffer();
      context.current.bindBuffer(context.current.ELEMENT_ARRAY_BUFFER, star_ebo.current);
      context.current.bufferData(context.current.ELEMENT_ARRAY_BUFFER, star_id, context.current.STATIC_DRAW);

      ibo.current = context.current.createBuffer();
      tri_ebo.current = context.current.createBuffer();

      const posLoc = context.current.getAttribLocation(program.current, "a_position");
      const transLoc = context.current.getAttribLocation(program.current, "a_instanceTranslate");
      const sizeLoc = context.current.getAttribLocation(program.current, "a_instanceSize");
      const alphaLoc = context.current.getAttribLocation(program.current, "a_instanceAlpha");
      const rotLoc = context.current.getAttribLocation(program.current, "a_instanceRot");

      vao.current = context.current.createVertexArray();
      context.current.bindVertexArray(vao.current);

      context.current.bindBuffer(context.current.ARRAY_BUFFER, vbo.current);
      context.current.enableVertexAttribArray(posLoc);
      context.current.vertexAttribPointer(
        posLoc,
        2,
        context.current.FLOAT,
        false,
        0,
        0
      );

      context.current.bindBuffer(context.current.ARRAY_BUFFER, ibo.current);
      context.current.enableVertexAttribArray(transLoc);
      context.current.vertexAttribPointer(
        transLoc,
        2,
        context.current.FLOAT,
        false,
        20,
        0
      );
      context.current.vertexAttribDivisor(transLoc, 1);
      context.current.enableVertexAttribArray(sizeLoc);
      context.current.vertexAttribPointer(
        sizeLoc,
        1,
        context.current.FLOAT,
        false,
        20,
        8
      );
      context.current.vertexAttribDivisor(sizeLoc, 1);
      context.current.enableVertexAttribArray(alphaLoc);
      context.current.vertexAttribPointer(
        alphaLoc,
        1,
        context.current.FLOAT,
        false,
        20,
        12
      );
      context.current.vertexAttribDivisor(alphaLoc, 1);
      context.current.enableVertexAttribArray(rotLoc);
      context.current.vertexAttribPointer(
        rotLoc,
        1,
        context.current.FLOAT,
        false,
        20,
        16
      );
      context.current.vertexAttribDivisor(rotLoc, 1);

      const triTransLoc = context.current.getAttribLocation(tri_program.current, "a_translate");
      const triAlphaLoc = context.current.getAttribLocation(tri_program.current, "a_alpha");

      tri_vao.current = context.current.createVertexArray();
      context.current.bindVertexArray(tri_vao.current);

      context.current.bindBuffer(context.current.ARRAY_BUFFER, ibo.current);
      context.current.enableVertexAttribArray(triTransLoc);
      context.current.vertexAttribPointer(
        triTransLoc,
        2,
        context.current.FLOAT,
        false,
        20,
        0
      );
      context.current.enableVertexAttribArray(triAlphaLoc);
      context.current.vertexAttribPointer(
        triAlphaLoc,
        1,
        context.current.FLOAT,
        false,
        20,
        12
      );

      context.current.bindVertexArray(null);

      context.current.enable(context.current.BLEND);
      context.current.blendEquation(context.current.FUNC_ADD);
      context.current.blendFunc(context.current.SRC_ALPHA, context.current.ONE_MINUS_SRC_ALPHA);
    }
  };

	const pointParams = (): Point => {
		const x = Math.floor(Math.random() * canvasSize.current.w);
		const y = Math.floor(Math.random() * canvasSize.current.h);
		const translateX = 0;
		const translateY = 0;
		const size = Math.floor(Math.random() * 4 + 6) + 0.1;
		const alpha = 0;
		const targetAlpha = parseFloat((Math.random() * 0.6 + 0.2).toFixed(1));
		const dx = (Math.random() - 0.5) * 0.1;
		const dy = (Math.random() - 0.5) * 0.1;
		const magnetism = 0.1 + Math.random() * 4;
    const rot = Math.random() * Math.PI;
		return {
			x,
			y,
			translateX,
			translateY,
			size,
			alpha,
			targetAlpha,
			dx,
			dy,
			magnetism,
      rot
		};
	};

	const drawPoint = (point: Point, update = false) => {
		if (context.current) {
			// const { x, y, translateX, translateY, size, alpha } = point;
			// context.current.translate(translateX, translateY);
			// context.current.beginPath();
			// context.current.bezierCurveTo(
			// 	x + size, y,
			// 	x, y,
			// 	x, y + size
			// )
			// context.current.bezierCurveTo(
			// 	x, y + size,
			// 	x, y,
			// 	x - size, y
			// )
			// context.current.bezierCurveTo(
			// 	x - size, y,
			// 	x, y,
			// 	x, y - size
			// )
			// context.current.bezierCurveTo(
			// 	x, y - size,
			// 	x, y,
			// 	x + size, y
			// )
			// context.current.fillStyle = `rgba(255, 255, 255, ${alpha})`;
			// context.current.fill();
			// context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
			//
			// if (!update) {
			// 	points.current.push(point);
			// }
		}
	};

	const clearContext = () => {
		if (context.current) {
      context.current.viewport(0, 0, canvasSize.current.w, canvasSize.current.h);
      context.current.clearColor(0, 0, 0, 0.0)
      context.current.clear(context.current.COLOR_BUFFER_BIT);
			// context.current.clearRect(
			// 	0,
			// 	0,
			// 	canvasSize.current.w,
			// 	canvasSize.current.h,
			// );
		}
	};

	const drawParticles = () => {
		clearContext();
		const particleCount = quantity;
		for (let i = 0; i < particleCount; i++) {
			const point = pointParams();
      points.current.push(point);
			// drawPoint(point);
		}
	};

	const remapValue = (
		value: number,
		start1: number,
		end1: number,
		start2: number,
		end2: number,
	): number => {
		const remapped =
			((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
		return remapped > 0 ? remapped : 0;
	};

	const animate = () => {
		clearContext();

    const instance_data = new Float32Array(
      quantity * 5
    );

		points.current.forEach((point: Point, i: number) => {
			// Handle the alpha value
			const edge = [
				point.x + point.translateX - point.size, // distance from left edge
				canvasSize.current.w - point.x - point.translateX - point.size, // distance from right edge
				point.y + point.translateY - point.size, // distance from top edge
				canvasSize.current.h - point.y - point.translateY - point.size, // distance from bottom edge
			];
			const closestEdge = edge.reduce((a, b) => Math.min(a, b));
			const remapClosestEdge = parseFloat(
				remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
			);
			if (remapClosestEdge > 1) {
				point.alpha += 0.02;
				if (point.alpha > point.targetAlpha) {
					point.alpha = point.targetAlpha;
				}
			} else {
				point.alpha = point.targetAlpha * remapClosestEdge;
			}
			point.x += point.dx;
			point.y += point.dy;
			point.translateX +=
				(mouse.current.x / (staticity / point.magnetism) - point.translateX) /
				ease;
			point.translateY +=
				(mouse.current.y / (staticity / point.magnetism) - point.translateY) /
				ease;
			// point gets out of the canvas
			if (
				point.x < -point.size ||
				point.x > canvasSize.current.w + point.size ||
				point.y < -point.size ||
				point.y > canvasSize.current.h + point.size
			) {
				// remove the point from the array
				points.current.splice(i, 1);
				// create a new point
				const newPoint = pointParams();
        points.current.push(newPoint);
				// drawPoint(newPoint);
				// update the point position
			}
				// drawPoint(
				// 	{
				// 		...point,
				// 		x: point.x,
				// 		y: point.y,
				// 		translateX: point.translateX,
				// 		translateY: point.translateY,
				// 		alpha: point.alpha,
				// 	},
				// 	true,
				// );
      instance_data[i * 5] = point.x + point.translateX;
      instance_data[i * 5 + 1] = point.y + point.translateY;
      instance_data[i * 5 + 2] = point.size;
      instance_data[i * 5 + 3] = point.alpha;
      instance_data[i * 5 + 4] = point.rot;
		});
    // Generate clusters
    // const clusters = points.current.reduce((acc: Point[][], point: Point) => {
    //   const clusterIndex = acc.findIndex((cluster: Point[]) => {
    //     return cluster.some((p: Point) => {
    //       const distance = Math.sqrt(
    //         (point.x - (p.x)) ** 2 +
    //         (point.y - (p.y)) ** 2
    //       );
    //       return distance < 300; // Adjust this threshold as needed
    //     });
    //   });

    //   if (clusterIndex !== -1) {
    //     acc[clusterIndex].push(point);
    //   } else {
    //     acc.push([point]);
    //   }

    //   return acc;
    // }, []);

		// const triangles = bowyerWatson(points.current);
    // const lines = constellation(clusters);
    const lines = constellation(points.current);

    const tri_data = new Int32Array(lines.length * 2);

    lines.forEach((edge: { a: number, b: number }, i: number) => {
      tri_data[i * 2] = edge.a;
      tri_data[i * 2 + 1] = edge.b;
    });

    if (context.current && program.current && tri_program.current) {
      context.current.bindBuffer(context.current.ARRAY_BUFFER, ibo.current);
      context.current.bufferData(context.current.ARRAY_BUFFER, instance_data, context.current.DYNAMIC_DRAW);

      context.current.bindBuffer(context.current.ELEMENT_ARRAY_BUFFER, tri_ebo.current);
      context.current.bufferData(context.current.ELEMENT_ARRAY_BUFFER, tri_data, context.current.DYNAMIC_DRAW);

      context.current.useProgram(program.current);
      context.current.bindVertexArray(vao.current);
      context.current.bindBuffer(context.current.ELEMENT_ARRAY_BUFFER, star_ebo.current);
      context.current.bindBuffer(context.current.ARRAY_BUFFER, vbo.current);

      const loc = context.current.getUniformLocation(program.current, "proj");
      context.current.uniformMatrix4fv(loc, false, proj.current);

      context.current.drawElementsInstanced(
        context.current.TRIANGLES,
        24,
        context.current.UNSIGNED_INT,
        0,
        quantity
      );

      context.current.useProgram(tri_program.current);
      context.current.bindVertexArray(tri_vao.current);
      context.current.bindBuffer(context.current.ELEMENT_ARRAY_BUFFER, tri_ebo.current);
      context.current.bindBuffer(context.current.ARRAY_BUFFER, ibo.current);

      const triLoc = context.current.getUniformLocation(tri_program.current, "proj");
      context.current.uniformMatrix4fv(triLoc, false, proj.current);

      context.current.drawElements(
        context.current.LINES,
        lines.length * 2,
        context.current.UNSIGNED_INT,
        0
      );
    }

		window.requestAnimationFrame(animate);
	};

	return (
		<div className={className} ref={canvasContainerRef} aria-hidden="true">
			<canvas ref={canvasRef} />
		</div>
	);
}
