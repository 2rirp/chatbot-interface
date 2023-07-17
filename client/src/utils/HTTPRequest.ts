import { APIResponse } from "../interfaces/APIResponse.js";
import { IUser } from "../interfaces/iuser.js";

export async function HTTPRequest<T>(
  url: string,
  method: string,
  body: Partial<IUser>
): Promise<APIResponse<T>> {
  const options: RequestInit = {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
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
