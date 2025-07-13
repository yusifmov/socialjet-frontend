import { useState } from "react";

interface ApiResponse<T> {
    data?: T;
    message?: string;
}

export function useApi<B, T>() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<T | null>(null);

    const sendRequest = async (endpoint: string, body?: B, headers?: object): Promise<T | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(window.SocialJetRestUrl + endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-WP-Nonce": window.SocialJetNonce,
                    ...headers,
                },
                body: JSON.stringify(body),
            });

            const result: ApiResponse<T> = await response.json();

            if (result.message) {
                setError(result.message);
                return null;
            }

            const res = result.data ?? null;
            setData(res);
            return res;
        } catch (err) {
            setError("An error occurred while fetching data.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { sendRequest, loading, error, data };
}