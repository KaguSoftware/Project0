const STRAPI_URL =
	process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export function getStrapiServerURL(path = "") {
	return `${STRAPI_URL}${path}`;
}

type StrapiFetchOptions = RequestInit & {
	skipAuth?: boolean;
};

export async function strapiFetch<T>(
	path: string,
	options: StrapiFetchOptions = {},
): Promise<T> {
	const { skipAuth = false, ...init } = options;
	const headers = new Headers(init.headers);

	if (!(init.body instanceof FormData) && !headers.has("Content-Type")) {
		headers.set("Content-Type", "application/json");
	}

	if (!skipAuth) {
		if (!STRAPI_API_TOKEN) {
			throw new Error("Missing STRAPI_API_TOKEN in frontend/.env.local");
		}

		headers.set("Authorization", `Bearer ${STRAPI_API_TOKEN}`);
	}

	const response = await fetch(getStrapiServerURL(path), {
		...init,
		headers,
		cache: "no-store",
	});

	if (response.status === 204) {
		return null as T;
	}

	const contentType = response.headers.get("content-type") ?? "";
	const payload = contentType.includes("application/json")
		? await response.json()
		: await response.text();

	if (!response.ok) {
		const message =
			typeof payload === "string"
				? payload
				: payload?.error?.message || "Strapi request failed";

		throw new Error(message);
	}

	return payload as T;
}
