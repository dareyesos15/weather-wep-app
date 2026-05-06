export function StatChip({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "accent";
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 ${
        tone === "accent"
          ? "border-sky-300/20 bg-sky-300/10"
          : "border-white/10 bg-white/5"
      }`}
    >
      <p className="text-xs tracking-[0.2em] text-slate-400 uppercase">{label}</p>
      <p className="mt-2 line-clamp-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}
