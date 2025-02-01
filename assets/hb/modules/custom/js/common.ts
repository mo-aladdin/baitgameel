/***
* Types and Classes
***/
export type BoolJsonStr = "" | "Y" | "N";
export type NumberJsonStr = string[number] | "";
export class Base {
  normaliseJsonBool(value: BoolJsonStr) {
    switch (value) {
      case "Y":
        return true;
        break;
      case "N":
        return false;
        break;
      default:
        return null;
        break;
    }
  }

  normaliseJsonNumber(value: NumberJsonStr, positive: boolean = false) {
    try {
      const num = Number(value);
      if (positive && num < 0) {
        throw new Error("Number is negative");
      }
      return num;
    } catch (error) {
      return null;
    }
  }
}

/***
* Helper Functions
***/
/**
 * Fetches data from the specified URL using the specified HTTP method.
 * Rejects the promise if the response status is not ok or if there's a network error.
 *
 * @param {string} path - The URL to fetch data from.
 * @param {Object} content - The data to send with the request as FormData.
 * @param {string} [method="POST"] - The HTTP method to use for the request. Defaults to "POST".
 * @returns {Promise<Response>} A promise that resolves with the response object.
 */
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
export async function fetchJson(path: string, customHeaders: HeadersInit, content: Object | null, fullResponse: true, method?: HttpMethod): Promise<Response>;
export async function fetchJson<T>(path: string, customHeaders: HeadersInit, content: Object | null, fullResponse?: false, method?: HttpMethod): Promise<T>;
export async function fetchJson<T>(path: string, customHeaders: HeadersInit, content: Object | null, fullResponse: boolean = false, method: HttpMethod = "POST"): Promise<Response | T> {
    return new Promise((resolve, reject) => {
        const body = content !== null ? JSON.stringify(content) : null;
        const headers = new Headers({
            "Content-Type": "application/json",
            ...customHeaders,
        });
        const request = {
            method,
            body,
            headers,
        };

        fetch(path, request)
            .then(async (response) => {
                if (fullResponse) {
                    resolve(response);
                } else {
                    if (response.ok) {
                        resolve(await response.json());
                    } else {
                        reject(`HTTP Error: ${response.statusText} ${response.status}`);
                    }
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
}

/**
 * Converts a UTF-8 string into a valid HTML element ID with a unique suffix.
 *
 * - Ensures the ID starts with a letter by prefixing with "id-" if needed.
 * - Normalizes Unicode to remove diacritics (accents).
 * - Replaces invalid characters (spaces, symbols) with underscores.
 * - Appends a timestamp for uniqueness.
 *
 * @param {string} str - The input string to convert.
 * @returns {string} - A valid, unique HTML ID string.
 */
export function toValidId(str) {
  const timestamp = Date.now().toString(36); // Fastest unique suffix
  return ("id-" + str.normalize("NFKD"). // Normalize Unicode (decomposes accents)
      replace(/[\u0300-\u036f]/g, ""). // Remove diacritics
      replace(/[^a-zA-Z0-9\-_:.]/g, "_"). // Replace invalid characters
      replace(/^[^a-zA-Z]/, "id") + // Ensure it starts with a letter
      "-" + timestamp); // Append timestamp for uniqueness
}

/**
 * @description Takes an HTML string and returns a parsed DOM element. Allows custom outerHTML while maintaining a reference to the element.
 * code by: https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
 * @param {String} html representing a single element
 * @return {HTMLElement}
 */
export function htmlToElement(html : string): HTMLElement {
  var template = document.createElement("template");
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild as HTMLElement;
}
