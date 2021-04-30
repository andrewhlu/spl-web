import unfetch from "isomorphic-unfetch";
import nodeFetch from "node-fetch";

export async function fetch(url, options) {
  const response = await unfetch(url, options);

  return response.json();
}

export async function fetchText(url, options) {
  const response = await unfetch(url, options);

  return response.text();
}

export async function fetchRaw(url, options) {
  const response = await unfetch(url, options);

  return response;
}

export async function fetchBuffer(url) {
  const response = await nodeFetch(url);
  const buffer = await response.buffer();

  return buffer;
}

export async function fetchWithToken(url, token, options) {
  return fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      authorization: `Bearer ${token}`,
    },
  });
}
