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

type ApiClientMutationOptions<TBody> = ApiClientOptions & {
  body: TBody;
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

export const adminApiPatchClient = async <TResponse, TBody>(
  path: string,
  { accessToken, body }: ApiClientMutationOptions<TBody>,
): Promise<TResponse> => {
  const response = await fetch(`${getApiUrl()}${path}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json() as Promise<TResponse>;
};

export const adminApiPostClient = async <TResponse, TBody>(
  path: string,
  { accessToken, body }: ApiClientMutationOptions<TBody>,
): Promise<TResponse> => {
  const response = await fetch(`${getApiUrl()}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json() as Promise<TResponse>;
};

export const apiPostClient = async <TResponse, TBody>(
  path: string,
  body: TBody,
): Promise<TResponse> => {
  const response = await fetch(`${getApiUrl()}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json() as Promise<TResponse>;
};

export const apiFormDataPostClient = async <TResponse>(
  path: string,
  body: FormData,
): Promise<TResponse> => {
  const response = await fetch(`${getApiUrl()}${path}`, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json() as Promise<TResponse>;
};
