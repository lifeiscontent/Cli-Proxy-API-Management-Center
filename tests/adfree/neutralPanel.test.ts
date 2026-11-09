import { describe, expect, test } from 'bun:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { createInstance } from 'i18next';
import { OAuthPage } from '@/features/oauth/OAuthPage';
import { ProviderResourcePanel } from '@/features/providers/components/ProviderResourcePanel';
import { ProviderCategoryList } from '@/features/providers/components/ProviderCategoryList';
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
          createElement(ProviderResourcePanel, {
            group,
            filter: '',
            onFilterChange: noop,
            filteredResources: [],
            selectedId: null,
            onView: noop,
            onEdit: noop,
            onDelete: noop,
            onCreate: noop,
          })
        );
        expect(markup).toMatch(/<button\b/);
        expect(markup).not.toMatch(/<a\b/);
      }
    });

    test('unconfigured providers wait behind Add provider in one list', async () => {
      const groups = buildProviderGroups({});
      const collapsed = await render(
        createElement(ProviderCategoryList, { groups, activeBrand: 'codex', onSelect: noop })
      );
      expect(collapsed.match(/<button\b/g)?.length).toBe(1);
      expect(collapsed.match(/<aside\b/g)?.length).toBe(1);
      const expanded = await render(
        createElement(ProviderCategoryList, {
          groups,
          activeBrand: 'codex',
          onSelect: noop,
          showAvailable: true,
        })
      );
      expect(expanded.match(/<button\b/g)?.length).toBe(groups.length + 1);
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
