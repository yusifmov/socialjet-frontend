import {useCallback, useRef, useState} from "react";

interface ApiResponse<T> {
    data?: T;
    message?: string;
}

/**
 * POSTs to a SocialJet REST route. Throws an Error carrying the server's message
 * (the plugin wraps exceptions as `{ message }`, WP itself as `{ code, message }`).
 */
export async function apiFetch<B, T>(endpoint: string, body?: B, headers?: Record<string, string>): Promise<T | null> {
    const response = await fetch(window.SocialJetRestUrl + endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-WP-Nonce": window.SocialJetNonce,
            ...headers,
        },
        body: JSON.stringify(body),
    });

    let result: ApiResponse<T> | null = null;
    try {
        result = await response.json();
    } catch {
        // Non-JSON body (PHP fatal, proxy error page...) — handled below.
    }

    if (result?.message) {
        throw new Error(result.message);
    }
    if (!response.ok || result === null) {
        throw new Error(`Request failed (HTTP ${response.status}).`);
    }

    return result.data ?? null;
}

export function useApi<B, T>() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<T | null>(null);
    // Only the latest call may write state, so an older, slower response can't overwrite a newer one.
    const latestCall = useRef(0);

    const sendRequest = useCallback(async (endpoint: string, body?: B, headers?: Record<string, string>): Promise<T | null> => {
        const call = ++latestCall.current;
        setLoading(true);
        setError(null);

        try {
            const res = await apiFetch<B, T>(endpoint, body, headers);
            if (call === latestCall.current) setData(res);
            return res;
        } catch (e) {
            if (call === latestCall.current) {
                setError(e instanceof Error ? e.message : "An error occurred while fetching data.");
            }
            return null;
        } finally {
            if (call === latestCall.current) setLoading(false);
        }
    }, []);

    return {sendRequest, loading, error, data};
}
