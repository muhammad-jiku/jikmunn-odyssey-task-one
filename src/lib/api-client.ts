import type { AppUser, AuthTokens } from "@/types/auth";
import type { Item } from "@/types/item";

const ACCESS_KEY = "jikmunn-odyssey:access-token";
const REFRESH_KEY = "jikmunn-odyssey:refresh-token";
const AUTH_EVENT = "jikmunn-odyssey:auth-change";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
    "http://localhost:4000/api"
  );
}

export function getStoredTokens(): AuthTokens | null {
  if (!isBrowser()) return null;
  const accessToken = window.localStorage.getItem(ACCESS_KEY);
  const refreshToken = window.localStorage.getItem(REFRESH_KEY);
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

export function setStoredTokens(tokens: AuthTokens) {
  if (!isBrowser()) return;
  window.localStorage.setItem(ACCESS_KEY, tokens.accessToken);
  window.localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function clearStoredTokens() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

let refreshInFlight: Promise<AuthTokens | null> | null = null;

interface ApiErrorPayload {
  ok?: boolean;
  message?: string;
  details?: unknown;
}

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details ?? null;
    this.name = "ApiClientError";
  }
}

async function parseJsonSafe(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function getErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  const message = (payload as ApiErrorPayload).message;
  return typeof message === "string" && message.length > 0 ? message : fallback;
}

async function refreshTokens(): Promise<AuthTokens | null> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const tokens = getStoredTokens();
    if (!tokens?.refreshToken) return null;

    const res = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ refreshToken: tokens.refreshToken })
    });

    const payload = (await parseJsonSafe(res)) as
      | { accessToken?: string; refreshToken?: string }
      | null;

    if (!res.ok || !payload?.accessToken || !payload?.refreshToken) {
      clearStoredTokens();
      return null;
    }

    const next = {
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken
    };
    setStoredTokens(next);
    return next;
  })();

  const result = await refreshInFlight;
  refreshInFlight = null;
  return result;
}

interface RequestOptions extends RequestInit {
  auth?: boolean;
  retryOnAuthError?: boolean;
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    auth = false,
    retryOnAuthError = true,
    headers,
    ...rest
  } = options;

  const token = getStoredTokens()?.accessToken;
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...rest,
    headers: {
      ...(headers ?? {}),
      ...(auth && token ? { authorization: `Bearer ${token}` } : {})
    }
  });

  if (res.status === 401 && auth && retryOnAuthError) {
    const refreshed = await refreshTokens();
    if (refreshed?.accessToken) {
      return apiFetch<T>(path, {
        ...options,
        retryOnAuthError: false,
        headers: {
          ...(headers ?? {}),
          authorization: `Bearer ${refreshed.accessToken}`
        }
      });
    }
  }

  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    throw new ApiClientError(
      getErrorMessage(payload, `Request failed with status ${res.status}`),
      res.status,
      payload
    );
  }

  return payload as T;
}

type AuthResponse = {
  ok: true;
  user: AppUser;
  accessToken: string;
  refreshToken: string;
};

export async function apiRegister(name: string, email: string, password: string) {
  const data = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
  setStoredTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data.user;
}

export async function apiLogin(email: string, password: string) {
  const data = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  setStoredTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data.user;
}

export async function apiDemoLogin(role: "user" | "admin" = "user") {
  const data = await apiFetch<AuthResponse>("/auth/demo-login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ role })
  });
  setStoredTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data.user;
}

export async function apiMe() {
  const data = await apiFetch<{ ok: true; user: AppUser }>("/auth/me", { auth: true });
  return data.user;
}

export async function apiLogout() {
  const refreshToken = getStoredTokens()?.refreshToken;
  if (refreshToken) {
    try {
      await apiFetch<{ ok: true; message: string }>("/auth/logout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ refreshToken })
      });
    } catch {
      // Ignore logout failure and clear tokens anyway.
    }
  }
  clearStoredTokens();
}

export async function apiHydrateSession() {
  const tokens = getStoredTokens();
  if (!tokens) return null;

  try {
    return await apiMe();
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 401) {
      const refreshed = await refreshTokens();
      if (!refreshed) return null;
      return apiMe();
    }
    throw error;
  }
}

export function subscribeAuth(cb: () => void) {
  if (!isBrowser()) return () => {};
  window.addEventListener(AUTH_EVENT, cb);
  return () => window.removeEventListener(AUTH_EVENT, cb);
}

type ItemDto = {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  category: Item["category"];
  rating: number;
  imageUrl?: string;
  images?: string[];
  createdAt: string;
  ownerId?: string;
};

function fromItemDto(dto: ItemDto): Item {
  return {
    id: dto.id,
    title: dto.title,
    shortDescription: dto.shortDescription,
    fullDescription: dto.fullDescription,
    price: dto.price,
    category: dto.category,
    rating: dto.rating,
    imageUrl: dto.imageUrl ?? dto.images?.[0],
    images: dto.images,
    createdAt: dto.createdAt,
    ownerId: dto.ownerId
  };
}

export async function apiListItems() {
  const data = await apiFetch<{
    ok: true;
    items: ItemDto[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  }>("/items?page=1&pageSize=200&sort=featured");

  return data.items.map(fromItemDto);
}

export async function apiListMyItems() {
  const data = await apiFetch<{
    ok: true;
    items: ItemDto[];
  }>("/items?owner=me&page=1&pageSize=200&sort=featured", { auth: true });
  return data.items.map(fromItemDto);
}

export async function apiGetItemById(id: string) {
  const data = await apiFetch<{ ok: true; item: ItemDto }>(`/items/${id}`);
  return fromItemDto(data.item);
}

export async function apiCreateItem(input: {
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  category: Item["category"];
  rating: number;
  imageUrl?: string;
}) {
  const data = await apiFetch<{ ok: true; item: ItemDto }>("/items", {
    method: "POST",
    auth: true,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input)
  });
  return fromItemDto(data.item);
}

export async function apiDeleteItem(id: string) {
  await apiFetch<{ ok: true; message: string }>(`/items/${id}`, {
    method: "DELETE",
    auth: true
  });
}
