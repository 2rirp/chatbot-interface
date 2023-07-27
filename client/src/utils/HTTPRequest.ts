import { APIResponse } from "../interfaces/APIResponse";

export async function HTTPRequest<T>(
  url: string,
  method: string,
  body?: any
): Promise<APIResponse<T>> {
  const options: RequestInit = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const json = await response.json();
    const result: APIResponse<T> = {
      data: json,
      status: response.status,
    };

    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
