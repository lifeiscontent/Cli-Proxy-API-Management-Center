// Scan the built panel for promotion links.
//
// Usage: bun scripts/check-promotions.mjs [dist/index.html]
//
// The ad-free build keeps the upstream sponsor code but empties its data. So the
// scan looks at what ships, not at the source. Every external URL in the bundle
// must use a host in promotion-allowed-hosts.txt and must not carry a referral
// parameter or a signup or campaign path. A new host stops the sync until a person
// reviews it.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const URL_PATTERN = /https?:\/\/[^\s"'`<>(){}[\]\\]+/g;
const REFERRAL_PARAM =
  /[?&](?:aff|affiliate|ref|referral|refer|invite|invitecode|invite_code|keyword|coupon|promo|campaign|utm_[a-z]+)=/i;
const PROMO_PATH =
  /\/(?:register|signup|sign-up|join|activities|activity|campaign|invite|promo|coupon|aff)(?:[/?#.-]|$)/i;
const IGNORED_HOST = /^(?:localhost|127\.0\.0\.1|\[::1\]|www\.w3\.org|(?:[\w-]+\.)*example\.\w+)$/i;

export function readAllowedHosts(path = new URL('./promotion-allowed-hosts.txt', import.meta.url)) {
  return new Set(
    readFileSync(path, 'utf8')
      .split('\n')
      .map((line) => line.replace(/#.*/, '').trim().toLowerCase())
      .filter(Boolean)
  );
}

export function findPromotions(text, allowedHosts) {
  const findings = new Map();
  for (const url of text.match(URL_PATTERN) ?? []) {
    const host = url
      .replace(/^https?:\/\//, '')
      .split(/[/?#:]/)[0]
      .toLowerCase();
    if (!/^[\w-]+(?:\.[\w-]+)+$/.test(host) || IGNORED_HOST.test(host)) continue;
    const reason = REFERRAL_PARAM.test(url)
      ? 'referral parameter'
      : PROMO_PATH.test(url)
        ? 'signup or campaign path'
        : allowedHosts.has(host)
          ? null
          : 'host not reviewed';
    if (reason) findings.set(url, reason);
  }
  return [...findings].map(([url, reason]) => ({ url, reason }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const bundle = resolve(process.argv[2] ?? 'dist/index.html');
  const findings = findPromotions(readFileSync(bundle, 'utf8'), readAllowedHosts());
  if (findings.length) {
    for (const { url, reason } of findings) console.error(`${reason}: ${url}`);
    console.error(
      `\nPromotion scan failed for ${bundle}.\n` +
        'Find the source of each URL. Neutralize it in the sponsor files, or, if it is not\n' +
        'a promotion, add its host to scripts/promotion-allowed-hosts.txt.'
    );
    process.exitCode = 1;
  } else {
    console.log(`Promotion scan passed: ${bundle}`);
  }
}
