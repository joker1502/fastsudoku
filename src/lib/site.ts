/**
 * Canonical site URL. Update to the real domain once it is assigned
 * (deploy currently targets a temporary *.pages.dev subdomain).
 */
export const SITE_URL = 'https://fastsudoku.com';

/**
 * Free-tier print watermark. Now driven by premium subscription status
 * (check isPremium in MakerPage). Kept as a reference for the watermark
 * text — actual gating is done client-side via /api/subscription.
 */
export const PRINT_WATERMARK = true;

/** Watermark text shown on printed puzzle sheets (derived from the domain). */
export const WATERMARK_TEXT = SITE_URL.replace(/^https?:\/\//, '');
