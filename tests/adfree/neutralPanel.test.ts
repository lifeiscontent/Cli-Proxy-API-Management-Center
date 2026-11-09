import { describe, expect, test } from 'bun:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { createInstance } from 'i18next';
import { OAuthPage } from '@/features/oauth/OAuthPage';
import { BrandPanel } from '@/features/providers/components/BrandPanel';
import { ProviderPicker } from '@/features/providers/components/ProviderPicker';
import { buildProviderGroups } from '@/features/providers/useProviderWorkbench';
import { PROVIDER_BRAND_ORDER } from '@/features/providers/descriptors';
import { ProxyUrlField } from '@/features/config/components/fields/sharedFields';
import type { VisualConfigValues } from '@/types/visualConfig';
import { LANGUAGE_ORDER } from '@/utils/constants';

const noop = () => {};
const externalLink = /<a\b[^>]*href="https?:/;

for (const language of LANGUAGE_ORDER) {
  describe(`ad-free panel (${language})`, () => {
    const render = async (element: ReturnType<typeof createElement>) => {
      const i18n = createInstance();
      const translation = (await import(`../../src/i18n/locales/${language}.json`)).default;
      await i18n.init({ lng: language, resources: { [language]: { translation } } });
      return renderToStaticMarkup(
        createElement(I18nextProvider, { i18n }, createElement(MemoryRouter, null, element))
      );
    };

    test('every empty provider offers New and no signup link', async () => {
      const groups = buildProviderGroups({});
      expect(groups.map((group) => group.id)).toEqual(PROVIDER_BRAND_ORDER);
      for (const group of groups) {
        const markup = await render(
          createElement(BrandPanel, {
            id: 'panel',
            labelledBy: 'tab',
            group,
            resources: [],
            controls: {
              filter: '',
              onFilterChange: noop,
              sortBy: 'name',
              sortDir: 'asc',
              onSortBy: noop,
              onSortDir: noop,
              availableModels: [],
              selectedModels: new Set<string>(),
              onSelectedModelsChange: noop,
              onClearFilters: noop,
            },
            selectedId: null,
            disableMutations: false,
            usageByProvider: new Map(),
            onView: noop,
            onEdit: noop,
            onDelete: noop,
            onToggleDisabled: noop,
            onCreate: noop,
            onEditGroup: noop,
            onToggleGroup: noop,
          })
        );
        expect(markup).toMatch(/<button\b/);
        expect(markup).not.toMatch(/<a\b/);
      }
    });

    test('the add-provider catalogue lists partners as ordinary tiles', async () => {
      const groups = buildProviderGroups({});
      const markup = await render(createElement(ProviderPicker, { groups, onPick: noop }));
      const translation = (await import(`../../src/i18n/locales/${language}.json`)).default;
      expect(markup).not.toContain(translation.providersPage.picker.featuredBadge);
      expect(markup).not.toMatch(/<a\b/);
      // One tile per provider and no featured cards with their own buttons.
      expect(markup.match(/<button\b/g)?.length).toBe(groups.length);
    });

    test('the proxy setting has no sponsor link', async () => {
      const markup = await render(
        createElement(ProxyUrlField, {
          values: { proxyUrl: 'http://127.0.0.1:8080' } as VisualConfigValues,
          disabled: false,
          onChange: noop,
        })
      );
      expect(markup).toContain('http://127.0.0.1:8080');
      expect(markup).not.toMatch(/<a\b/);
    });

    test('OAuth shows Kimi as ordinary tiles without signup links', async () => {
      const markup = await render(createElement(OAuthPage));
      expect(markup).not.toContain('role="group"');
      expect(markup).not.toMatch(externalLink);
    });
  });
}
