export function Logo({
  withTagline = false,
  tone = "dark",
  variant = "serif",
  className = "",
}: {
  withTagline?: boolean;
  tone?: "dark" | "light";
  variant?: "serif" | "sans";
  className?: string;
}) {
  const color = tone === "light" ? "text-arena" : "text-tinta";
  const wordmark =
    variant === "sans"
      ? "font-sans font-medium tracking-[0.22em]"
      : "font-display font-medium tracking-[0.3em]";
  return (
    <span className={`inline-flex flex-col items-center leading-none ${color} ${className}`}>
      {/* Wordmark con la diéresis dorada como sello de marca */}
      <span className={wordmark}>
        R
        <span className="relative">
          O
          <span
            className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 gap-[0.16em]"
            style={{ top: "-0.2em" }}
            aria-hidden="true"
          >
            <i className="block rounded-full bg-dorado" style={{ width: "0.11em", height: "0.11em" }} />
            <i className="block rounded-full bg-dorado" style={{ width: "0.11em", height: "0.11em" }} />
          </span>
        </span>
        A
      </span>

      {withTagline && (
        <span className="mt-3 flex items-center gap-2.5 text-[0.26em]">
          <span className="h-px w-6 bg-current opacity-40" />
          <span className="font-sans uppercase tracking-[0.55em] opacity-70">Home &amp; Style</span>
          <span className="h-px w-6 bg-current opacity-40" />
        </span>
      )}
    </span>
  );
}
