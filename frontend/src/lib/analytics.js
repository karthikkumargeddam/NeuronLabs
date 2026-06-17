/**
 * NeuronLabs Marketing Analytics Utilities
 * -----------------------------------------
 * Covers:
 *  - Google Analytics 4 (GA4) custom event tracking
 *  - UTM parameter capture & persistence (sessionStorage)
 *  - Microsoft Clarity session tagging
 */

// ─── GA4 Event Tracking ───────────────────────────────────────────────────────

/**
 * Fire a custom GA4 event. Silently no-ops if GA4 is not loaded.
 * @param {string} eventName  - GA4 event name (snake_case recommended)
 * @param {object} params     - Additional event parameters
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  const utmData = getStoredUTM();
  window.gtag('event', eventName, {
    ...params,
    ...utmData,
  });
}

// ─── Pre-built NeuronLabs Events ─────────────────────────────────────────────

export const analytics = {
  /** User clicked "Enroll" on a course */
  courseEnroll: (courseId, courseTitle) =>
    trackEvent('course_enroll', { course_id: courseId, course_title: courseTitle }),

  /** User started a challenge in the Arena */
  challengeStart: (challengeId, difficulty) =>
    trackEvent('challenge_start', { challenge_id: challengeId, difficulty }),

  /** User submitted code in the Code Editor */
  codeSubmit: (challengeId, language) =>
    trackEvent('code_submit', { challenge_id: challengeId, language }),

  /** User clicked "Book Session" on a mentor */
  mentorBook: (mentorName) =>
    trackEvent('mentor_book', { mentor_name: mentorName }),

  /** User signed up */
  signUp: (method = 'email') =>
    trackEvent('sign_up', { method }),

  /** User signed in */
  signIn: (method = 'email') =>
    trackEvent('login', { method }),

  /** User viewed a page (for manual SPA tracking if needed) */
  pageView: (pagePath) =>
    trackEvent('page_view', { page_path: pagePath }),

  /** User searched something */
  search: (query) =>
    trackEvent('search', { search_term: query }),

  /** User clicked a CTA button */
  ctaClick: (label, location) =>
    trackEvent('cta_click', { cta_label: label, cta_location: location }),

  /** User downloaded a dataset */
  datasetDownload: (datasetId, datasetName) =>
    trackEvent('dataset_download', { dataset_id: datasetId, dataset_name: datasetName }),

  /** User joined a hackathon */
  hackathonJoin: (hackathonId, hackathonTitle) =>
    trackEvent('hackathon_join', { hackathon_id: hackathonId, hackathon_title: hackathonTitle }),

  /** User claimed a bounty */
  bountyClaimClick: (bountyId, reward) =>
    trackEvent('bounty_claim_click', { bounty_id: bountyId, reward }),
};

// ─── UTM Parameter Capture ───────────────────────────────────────────────────

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

/**
 * Call this once on app load (e.g. in a client component or layout).
 * Reads UTM params from the URL and saves them to sessionStorage.
 * They persist for the entire browsing session and are attached to all events.
 */
export function captureUTMParams() {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const utmData = {};
  let hasUTM = false;

  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) {
      utmData[key] = value;
      hasUTM = true;
    }
  });

  if (hasUTM) {
    sessionStorage.setItem('neuronlabs_utm', JSON.stringify(utmData));
  }
}

/**
 * Retrieve stored UTM parameters (for attaching to GA4 events).
 */
export function getStoredUTM() {
  if (typeof window === 'undefined') return {};
  try {
    const stored = sessionStorage.getItem('neuronlabs_utm');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Build a URL with UTM parameters appended (for sharing tracking links).
 * @param {string} baseUrl
 * @param {object} utmParams
 */
export function buildUTMUrl(baseUrl, utmParams = {}) {
  const url = new URL(baseUrl);
  Object.entries(utmParams).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return url.toString();
}

// ─── Microsoft Clarity ────────────────────────────────────────────────────────

/**
 * Tag the current Clarity session with custom metadata.
 * Useful for segmenting recordings by user role or plan.
 */
export function clarityTag(key, value) {
  if (typeof window === 'undefined' || typeof window.clarity !== 'function') return;
  window.clarity('set', key, value);
}

/**
 * Identify a logged-in user in Clarity sessions.
 */
export function clarityIdentify(userId, userEmail) {
  if (typeof window === 'undefined' || typeof window.clarity !== 'function') return;
  window.clarity('identify', userId, undefined, undefined, userEmail);
}
