// utils/api.js

/**
 * Get Strapi Base URL
 */
export function getStrapiURL(path = "") {
  const baseUrl =
    process.env.NEXT_PUBLIC_STRAPI_URL || 'https://wise-action-3f2ccfecaa.strapiapp.com';

  return `${baseUrl}${path}`;
}

/**
 * Convert object to query string
 */
export function buildQuery(params, prefix = "") {
  if (!params) return "";

  const query = [];

  for (const key in params) {
    if (!Object.prototype.hasOwnProperty.call(params, key)) continue;

    const value = params[key];
    const queryKey = prefix ? `${prefix}[${key}]` : key;

    if (value === undefined || value === null) {
      continue;
    }

    if (
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      query.push(buildQuery(value, queryKey));
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          query.push(buildQuery(item, `${queryKey}[${index}]`));
        } else {
          query.push(
            `${queryKey}[${index}]=${encodeURIComponent(item)}`
          );
        }
      });
    } else {
      query.push(
        `${queryKey}=${encodeURIComponent(value)}`
      );
    }
  }

  return query.filter(Boolean).join("&");
}

/**
 * Generic Strapi API Fetch Helper
 */
export async function fetchAPI(
  path,
  urlParamsObject = {},
  options = {}
) {
  const queryString = buildQuery(urlParamsObject);

  const requestUrl = `${getStrapiURL(
    path
  )}${queryString ? `?${queryString}` : ""}`;

  // Prevent Next.js static generation from hanging on Vercel if backend is not linked yet
  if (process.env.VERCEL && (requestUrl.includes("127.0.0.1") || requestUrl.includes("localhost"))) {
    console.warn(`Skipping fetch to localhost on Vercel during build: ${requestUrl}`);
    return { data: null, error: true, message: "Skipped fetch during Vercel build" };
  }

  const defaultOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.STRAPI_API_TOKEN && {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      }),
    },
    next: {
      revalidate: 60,
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(requestUrl, mergedOptions);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Strapi API Error: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const contentType = response.headers.get("content-type");

    if (
      contentType &&
      contentType.includes("application/json")
    ) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    console.error("FetchAPI Error:", error);

    return {
      error: true,
      message: error.message || "Unknown error occurred",
      data: null,
    };
  }
}