import { ComponentChildren } from "npm:preact";

export default function Marquee(
  { duration, children, className }: {
    duration: string;
    className?: string;
    children: ComponentChildren;
  },
) {
  return (
    <div style={{ overflow: "hidden" }} className={className}>
      <div
        style={{ animation: `${duration} linear 0s infinite running marquee` }}
      >
        {children}
      </div>
    </div>
  );
}
