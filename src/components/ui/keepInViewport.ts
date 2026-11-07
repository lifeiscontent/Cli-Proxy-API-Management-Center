import { VIEWPORT_MARGIN } from './selectPosition';

/**
 * Horizontal shift (px) that moves a box spanning [left, right] inside
 * [VIEWPORT_MARGIN, viewportWidth - VIEWPORT_MARGIN]. A box wider than that
 * range keeps its left edge on the margin.
 */
export function horizontalShiftIntoViewport(
  left: number,
  right: number,
  viewportWidth: number
): number {
  if (left < VIEWPORT_MARGIN) return VIEWPORT_MARGIN - left;
  const maxRight = viewportWidth - VIEWPORT_MARGIN;
  if (right > maxRight) return Math.max(maxRight - right, VIEWPORT_MARGIN - left);
  return 0;
}

/**
 * Callback ref for a popover that CSS anchors to one side of its trigger.
 * When the trigger sits near the opposite screen edge, that anchor pushes the
 * popover off screen; this shifts it back and repeats on resize.
 */
export function keepInViewport(element: HTMLElement | null): (() => void) | void {
  if (!element) return;
  const place = () => {
    // Measure the layout box, not getBoundingClientRect(): entry animations
    // scale the popover, which would skew its measured edges.
    const parent = element.offsetParent;
    if (!parent) return;
    const left = parent.getBoundingClientRect().left + parent.clientLeft + element.offsetLeft;
    const shift = horizontalShiftIntoViewport(
      left,
      left + element.offsetWidth,
      document.documentElement.clientWidth
    );
    element.style.translate = shift ? `${shift}px 0` : '';
  };
  place();
  window.addEventListener('resize', place);
  return () => window.removeEventListener('resize', place);
}
