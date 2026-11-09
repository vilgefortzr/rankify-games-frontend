import { useRef } from "react";

export default function HoloSurface({ as: Tag = "div", active, className = "", children, ...rest }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    if (!active) return;
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  const handleLeave = () => {
    ref.current?.style.removeProperty("--mx");
    ref.current?.style.removeProperty("--my");
  };

  return (
    <Tag
      ref={ref}
      className={`${className} ${active ? "is-holo" : ""}`}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...rest}
    >
      {children}
    </Tag>
  );
}
