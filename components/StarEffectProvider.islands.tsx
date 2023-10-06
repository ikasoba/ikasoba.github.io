import { useEffect, useRef } from "npm:preact/hooks";

type Star = {
  x: number;
  y: number;
  time: number;
  radius: number;
  lifespan: number;
};

export default function StarEffectProvider() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d")!;
    const stars: Star[] = [];

    const setCanvasSize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = document.body.clientWidth;
      canvasRef.current.height = document.body.clientHeight;
    };

    setCanvasSize();

    const drawStar = (
      x: number,
      y: number,
      radius: number,
      size: number,
      corners = 5,
    ) => {
      ctx.beginPath();
      let r = radius;

      ctx.moveTo(x, y);

      for (let i = 0; i < corners * 5; i++) {
        const m = i % 2 == 0 ? size / 2 : size;

        ctx.lineTo(x + Math.cos(r) * m, y + Math.sin(r) * m);

        r += Math.PI * 2 / corners;
      }

      ctx.closePath();
      ctx.fill();
    };

    let tick = 0;
    const listener = (e: MouseEvent) => {
      if (tick < 10) {
        tick++;
        return;
      }

      stars.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        time: 0,
        lifespan: 3,
      });

      tick = 0;
    };

    let prevDrawTime = Date.now();
    const draw = () => {
      const fps = 1000 / (Date.now() - prevDrawTime);
      prevDrawTime = Date.now();

      ctx.clearRect(
        0,
        0,
        canvasRef.current?.width!,
        canvasRef.current?.height!,
      );

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        ctx.fillStyle = `rgba(255, 255, 0, ${1 - star.time / star.lifespan})`;

        drawStar(
          star.x,
          star.y += 100 / fps,
          star.radius += Math.PI * 2 / (3 * fps),
          15,
        );
        if (star.time >= star.lifespan) {
          stars.splice(i--, 1);
          continue;
        }

        star.time += 1 / fps;
      }

      requestAnimationFrame(draw);
    };

    draw();

    document.addEventListener("mousemove", listener);
    document.body.addEventListener("resize", setCanvasSize);

    return () => {
      document.removeEventListener("mousemove", listener);
      document.body.addEventListener("resize", setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        opacity: 0.25,
      }}
    >
    </canvas>
  );
}
