import { FALLBACK_UNIVERSITIES, getUniversityBySlug as getFallbackUniversityBySlug } from './universities-fallback';
import { FALLBACK_GUIDES, getGuideBySlug as getFallbackGuideBySlug } from './guides-fallback';

const BACKEND_INTERNAL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.BACKEND_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://university-admission-assistant.vercel.app'
    : 'http://localhost:4000');

/**
 * Fetch all universities with ISR tagging and fallback
 */
export async function fetchServerUniversities() {
  try {
    const res = await fetch(`${BACKEND_INTERNAL}/api/universities`, {
      next: {
        revalidate: 1800, // 30 minutes
        tags: ['universities'],
      },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (err: any) {
    console.warn('[serverApi] Universities fetch error, serving fallback:', err.message);
  }
  return FALLBACK_UNIVERSITIES;
}

/**
 * Fetch a single university details by slug with ISR tagging
 */
export async function fetchServerUniversityBySlug(slug: string) {
  try {
    const res = await fetch(`${BACKEND_INTERNAL}/api/universities/${slug}`, {
      next: {
        revalidate: 900, // 15 minutes
        tags: [`uni-${slug}`, 'universities'],
      },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        return json.data;
      }
    }
  } catch (err: any) {
    console.warn(`[serverApi] University ${slug} fetch error, serving fallback:`, err.message);
  }
  return getFallbackUniversityBySlug(slug);
}

/**
 * Fetch admission circulars and deadlines with ISR tagging
 */
export async function fetchServerAdmissions() {
  try {
    const res = await fetch(`${BACKEND_INTERNAL}/api/admissions`, {
      next: {
        revalidate: 600, // 10 minutes
        tags: ['circulars', 'admissions'],
      },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        return json.data;
      }
    }
  } catch (err: any) {
    console.warn('[serverApi] Admissions fetch error:', err.message);
  }
  return [];
}

/**
 * Fetch all guides with ISR tagging
 */
export async function fetchServerGuides() {
  try {
    const res = await fetch(`${BACKEND_INTERNAL}/api/guides?limit=50`, {
      next: {
        revalidate: 3600, // 1 hour
        tags: ['guides'],
      },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (err: any) {
    console.warn('[serverApi] Guides fetch error, serving fallback:', err.message);
  }
  return FALLBACK_GUIDES;
}

/**
 * Fetch a single guide by slug with ISR tagging
 */
export async function fetchServerGuideBySlug(slug: string) {
  try {
    const res = await fetch(`${BACKEND_INTERNAL}/api/guides/${slug}`, {
      next: {
        revalidate: 3600, // 1 hour
        tags: [`guide-${slug}`, 'guides'],
      },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        return json.data;
      }
    }
  } catch (err: any) {
    console.warn(`[serverApi] Guide ${slug} fetch error, serving fallback:`, err.message);
  }
  return getFallbackGuideBySlug(slug);
}
