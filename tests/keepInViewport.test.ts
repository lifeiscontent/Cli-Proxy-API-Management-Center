import { describe, expect, test } from 'bun:test';
import { horizontalShiftIntoViewport } from '../src/components/ui/keepInViewport';
import { VIEWPORT_MARGIN } from '../src/components/ui/selectPosition';

describe('horizontalShiftIntoViewport', () => {
  test('leaves a popover that fits alone', () => {
    expect(horizontalShiftIntoViewport(67, 283, 390)).toBe(0);
  });

  test('moves a popover that starts off the left edge back to the margin', () => {
    expect(horizontalShiftIntoViewport(-42, 178, 360)).toBe(VIEWPORT_MARGIN + 42);
  });

  test('moves a popover that ends off the right edge back to the margin', () => {
    expect(horizontalShiftIntoViewport(200, 420, 390)).toBe(390 - VIEWPORT_MARGIN - 420);
  });

  test('keeps the left edge visible when the popover is wider than the viewport', () => {
    expect(horizontalShiftIntoViewport(100, 500, 320)).toBe(VIEWPORT_MARGIN - 100);
  });
});
