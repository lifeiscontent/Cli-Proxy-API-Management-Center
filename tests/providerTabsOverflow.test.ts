import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const tabsStyles = readFileSync(
  'src/features/authFiles/components/ProviderTabs.module.scss',
  'utf8'
);
const quotaStyles = readFileSync('src/features/quota/QuotaPage.module.scss', 'utf8');
const mixins = readFileSync('src/styles/mixins.scss', 'utf8');
const scrollStrip = mixins.slice(mixins.indexOf('@mixin scroll-strip-x'));

describe('provider filter overflow', () => {
  test('constrains the strip and preserves native horizontal scrolling', () => {
    expect(tabsStyles).toMatch(/\.tabs\s*\{[^}]*min-width: 0;/);
    expect(tabsStyles).toMatch(/\.tabs\s*\{[^}]*max-width: 100%;/);
    expect(tabsStyles).toMatch(/\.tabs\s*\{[^}]*@include scroll-strip-x;/);
    expect(scrollStrip).toContain('overflow-x: auto;');
    expect(tabsStyles).toMatch(/\.tab\s*\{[^}]*flex-shrink: 0;/);
  });

  test('hides the scrollbar while using a cancellable local wheel listener', () => {
    expect(scrollStrip).toContain('scrollbar-width: none;');
    expect(scrollStrip).toMatch(/&::-webkit-scrollbar\s*\{[^}]*display: none/);
    const source = readFileSync('src/features/authFiles/components/ProviderTabs.tsx', 'utf8');
    expect(source).toContain("strip.addEventListener('wheel', onWheel, { passive: false })");
    expect(source).toContain("strip.removeEventListener('wheel', onWheel)");
  });

  test('allocates remaining quota toolbar width without shrinking the sort control', () => {
    expect(quotaStyles).toMatch(/> :first-child\s*\{\s*flex: 1 1 auto;\s*min-width: 0;/);
    expect(quotaStyles).toMatch(/\.sort\s*\{\s*flex: 0 0 auto;/);
  });
});
