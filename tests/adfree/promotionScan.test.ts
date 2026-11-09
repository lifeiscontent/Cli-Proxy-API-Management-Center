import { expect, test } from 'bun:test';
import { findPromotions } from '../../scripts/check-promotions.mjs';

const allowed = new Set(['api.example-provider.com', 'vendor.com']);
const reasons = (text: string) => findPromotions(text, allowed).map((item) => item.reason);

test('flags referral links, signup paths, and hosts that nobody reviewed', () => {
  expect(reasons('"https://vendor.com/?aff=AKCPA"')).toEqual(['referral parameter']);
  expect(reasons('"https://vendor.com/register?invitecode=X1"')).toEqual(['referral parameter']);
  expect(reasons('"https://vendor.com/activities/double11"')).toEqual(['signup or campaign path']);
  expect(reasons('"https://s.short.link/miI73q"')).toEqual(['host not reviewed']);
});

test('passes reviewed hosts and local or placeholder URLs', () => {
  const bundle = [
    '"https://api.example-provider.com/v1"',
    '`https://vendor.com/dashboard`',
    '"http://127.0.0.1:8317"',
    '"http://www.w3.org/2000/svg"',
    '"https://example.com"',
    '"http://${host}"',
  ].join(';');
  expect(findPromotions(bundle, allowed)).toEqual([]);
});
