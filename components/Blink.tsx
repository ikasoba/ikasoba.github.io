import { JSX } from "npm:preact";
import { ComponentChildren } from "npm:preact";

export default function Blink(
  { duration, children, style }: {
    duration?: string;
    style?: JSX.CSSProperties;
    children: ComponentChildren;
  },
) {
  return (
    <span
      style={{
        ...style,
        animation: `${duration} linear 0s infinite running blink`,
      }}
    >
      {children}
    </span>
  );
}
