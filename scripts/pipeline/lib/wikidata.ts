import { TARGET_LANGS, type TargetLang } from '../config';

/**
 * Minimal Wikidata client for name → entity resolution.
 *
 * Source-agnostic: works from a plain place/polity name. Matching favors
 * PRECISION over recall — an unconfident name resolves to `null` (later it
 * falls back to the English name) rather than to a wrong entity. Use
 * `scripts/pipeline/overrides.json` to pin tricky cases.
 */
const API = 'https://www.wikidata.org/w/api.php';
// Wikimedia policy requires a descriptive User-Agent.
const USER_AGENT = 'wikimaps-data-pipeline (https://github.com/Lukianos76/WikiMaps)';

/** Wikipedia site key per target language. */
const WIKI_SITE: Record<TargetLang, string> = { en: 'enwiki', fr: 'frwiki' };

/** Descriptions hinting the entity is a polity/region rather than something else. */
const POLITY_RE =
  /\b(countr|states?|empire|kingdom|republic|nation|territor|dynast|civili[sz]|caliphate|sultanate|confederation|federation|duchy|principality|tribe|people|region|province|colony|polity|khanate|emirate|realm|city-state|historical|ancient)\b/i;

/** Narrower hint that a result is a present-day sovereign country. */
const COUNTRY_RE = /\b(sovereign state|country)\b/i;

interface SearchResult {
  id: string;
  label?: string;
  description?: string;
}
interface WbSearchResponse {
  search?: SearchResult[];
}
interface WbEntity {
  labels?: Record<string, { value: string }>;
  sitelinks?: Record<string, { url?: string }>;
}
interface WbEntitiesResponse {
  entities?: Record<string, WbEntity>;
}

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

async function apiGet<T>(params: Record<string, string>): Promise<T> {
  // `maxlag` makes us a polite client: the server returns 503 when replication
  // lags, and we back off instead of piling on.
  const url = `${API}?${new URLSearchParams({ format: 'json', maxlag: '5', ...params }).toString()}`;
  const maxAttempts = 6;
  for (let attempt = 1; ; attempt += 1) {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' }
    });
    if (response.ok) return (await response.json()) as T;

    const retriable = response.status === 429 || response.status === 503;
    if (!retriable || attempt >= maxAttempts) {
      throw new Error(`Wikidata API ${response.status} ${response.statusText}`);
    }
    const retryAfter = Number.parseInt(response.headers.get('retry-after') ?? '', 10);
    const waitMs = Number.isFinite(retryAfter) ? retryAfter * 1000 : 2000 * attempt;
    await sleep(waitMs);
  }
}

/** Resolve a name to a QID, or null when no confident polity match exists. */
export async function searchEntity(name: string): Promise<string | null> {
  const data = await apiGet<WbSearchResponse>({
    action: 'wbsearchentities',
    search: name,
    language: 'en',
    uselang: 'en',
    type: 'item',
    limit: '7'
  });
  const results = data.search ?? [];
  if (results.length === 0) return null;

  const ci = name.toLowerCase();
  const exact = results.filter((r) => (r.label ?? '').toLowerCase() === ci);
  // On an exact (incl. alias) match, prefer a present-day sovereign country —
  // source names like "Egypt"/"Japan" should map to the country, not a same-named
  // historical polity. Distinctive historical names ("Roman Empire") have no such
  // country and fall through to the polity heuristic.
  const pick =
    exact.find((r) => COUNTRY_RE.test(r.description ?? '')) ??
    exact.find((r) => POLITY_RE.test(r.description ?? '')) ??
    results.find((r) => POLITY_RE.test(r.description ?? '')) ??
    exact[0] ??
    null;
  return pick?.id ?? null;
}

export interface EntityLabels {
  labels: Partial<Record<TargetLang, string>>;
  wikipedia: Partial<Record<TargetLang, string>>;
}

/** Batch-fetch target-language labels and Wikipedia URLs for QIDs (≤50/call). */
export async function getEntities(qids: string[]): Promise<Record<string, EntityLabels>> {
  const out: Record<string, EntityLabels> = {};
  for (let i = 0; i < qids.length; i += 50) {
    const chunk = qids.slice(i, i + 50);
    const data = await apiGet<WbEntitiesResponse>({
      action: 'wbgetentities',
      ids: chunk.join('|'),
      props: 'labels|sitelinks/urls',
      languages: TARGET_LANGS.join('|'),
      sitefilter: TARGET_LANGS.map((l) => WIKI_SITE[l]).join('|')
    });
    const entities = data.entities ?? {};
    for (const qid of chunk) {
      const entity = entities[qid];
      const labels: Partial<Record<TargetLang, string>> = {};
      const wikipedia: Partial<Record<TargetLang, string>> = {};
      if (entity) {
        for (const lang of TARGET_LANGS) {
          const label = entity.labels?.[lang]?.value;
          if (label) labels[lang] = label;
          const url = entity.sitelinks?.[WIKI_SITE[lang]]?.url;
          if (url) wikipedia[lang] = url;
        }
      }
      out[qid] = { labels, wikipedia };
    }
  }
  return out;
}
