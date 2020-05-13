import get from "lodash/get";
import isString from "lodash/isString";
import {
  API_BACKEND_CLIENT_ADDR,
  API_BACKEND_SERVER_ADDR
} from "@/lib/config";
import ApiClient from "@/lib/http-client";
import { debugLogger } from "@/lib/log";
import { AxiosResponse } from "axios";

const debug = debugLogger("[http-client]");
const isProd = process.env.NODE_ENV === "production";

const API_BASE_URL = process.browser
  ? `${API_BACKEND_CLIENT_ADDR}`
  : `${API_BACKEND_SERVER_ADDR}`;

export class ApiError<T = any> extends Error {
  public response: AxiosResponse<T>;
  public code: string | number;
};

export const apiClient = new ApiClient({
  baseURL: API_BASE_URL,
  headers: {
    common: {
      "Content-Type": "application/json; charset=utf-8",
      "X-Requested-With": "XMLHttpRequest"
    }
  },
  withCredentials: false,
  onResp: r => {
    if (!isProd)
      debug(
        "http response",
        "url:",
        r.config.url,
        "\nstatus:",
        r.status,
        "\ndata:",
        r.data,
        "\nheaders:",
        r.headers
      );
    return r.data;
  },
  onError: e => {
    let errorText: string;
    if (isString(e)) {
      errorText = e;
    } else if (isString(get(e, "response.data.message"))) {
      errorText = get(e, "response.data.message");
    } else if (isString(get(e, "response.data.msg"))) {
      errorText = get(e, 'response.data.msg');
    } else if (isString(get(e, "message"))) {
      errorText = get(e, "message");
    } else {
      errorText = "Request error";
    }
    const errorCode = get(e, "response.data.code") || get(e, "response.status");
    if (typeof e === "object") {
      e.message = errorText;
      e.code = errorCode;
      throw e;
    } else {
      const error = new ApiError(errorText);
      error.code = errorCode;
      throw error;
    }
  }
});
