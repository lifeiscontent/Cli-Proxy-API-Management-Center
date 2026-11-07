export function LoadingSpinner({
  size = 20,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    // Decorative: callers render the spinner inside a button or next to a visible
    // label, so the label, not the spinner, tells assistive tech what is loading.
    <span
      className={`loading-spinner${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size, borderWidth: size / 7 }}
      aria-hidden="true"
    />
  );
}
