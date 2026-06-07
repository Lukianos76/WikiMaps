/**
 * Turn a territory name into a URL-safe kebab-case slug.
 * `"Imperial Japan (Fujiwara)"` -> `"imperial-japan-fujiwara"`.
 *
 * Diacritics are stripped; any run of non-alphanumeric characters becomes a
 * single hyphen. Falls back to `"territory"` when nothing usable remains.
 */
export function slugify(name: string): string {
  const slug = name
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug.length > 0 ? slug : 'territory';
}

/**
 * Make a slug unique within a single snapshot by suffixing `-2`, `-3`, …
 * Mutates `used` to record the returned slug.
 */
export function makeUniqueSlug(base: string, used: Set<string>): string {
  if (!used.has(base)) {
    used.add(base);
    return base;
  }

  let suffix = 2;
  let candidate = `${base}-${suffix}`;
  while (used.has(candidate)) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
  used.add(candidate);
  return candidate;
}
