export function ChamferBreak({ edge }: { edge: "top" | "bottom" }) {
  return <div className="chamfer" data-edge={edge} aria-hidden="true" />;
}
