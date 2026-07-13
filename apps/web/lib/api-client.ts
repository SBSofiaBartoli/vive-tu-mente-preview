const getApiUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_URL");
  }

  return apiUrl;
};

type ApiClientOptions = {
  accessToken: string;
};

export const adminApiClient = async <T>(
  path: string,
  { accessToken }: ApiClientOptions,
): Promise<T> => {
  const response = await fetch(`${getApiUrl()}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json() as Promise<T>;
};
