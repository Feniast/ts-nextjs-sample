import axios, {
  AxiosResponse,
  AxiosInstance,
  AxiosRequestConfig,
  Canceler,
} from 'axios';
import isPlainObject from 'lodash/isPlainObject';
import omit from 'lodash/omit';
import isFunction from 'lodash/isFunction';

const isUseBodyMethod = (method: string) =>
  ['post', 'put', 'patch'].indexOf(method) >= 0;

const objectToUrlSearchParams = (obj: any) => {
  if (!isPlainObject(obj)) return null;
  const params = new URLSearchParams();
  const keys = Object.keys(obj);
  keys.forEach((key) => {
    const value = obj[key];
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (typeof value === 'object') {
      params.append(key, JSON.stringify(value));
    } else {
      params.append(key, value);
    }
  });
  return params;
};

const paramRegExp = /:([^/]*?)(?=\/|$)/g;

const processParameterizedUrl = (url: string, data: { [key: string]: any }) => {
  if (typeof url !== 'string' || url.trim() === '') {
    return { url: '', keys: [] };
  }

  const keys: string[] = [];
  const newUrl = url.replace(paramRegExp, (match, param) => {
    keys.push(param);
    return data[param];
  });

  return {
    url: newUrl,
    keys,
  };
};

const wrapHttpPromise = <T>(
  promise: Promise<T>,
  props: { [key: string]: any }
): Promise<T> => {
  const wrapper: { [key:string]: any} = {};
  wrapper.then = (...args: any) => promise.then(...args);
  wrapper.catch = (...args: any) => promise.catch(...args);
  wrapper.finally = (...args: any) => promise.finally(...args);
  return Object.assign(<Promise<T>>wrapper, props);
};

export type BeforeRequestFunction = <T>(
  data: T,
  options: ApiClientOptions
) => T;

export type ApiClientOptions = {
  onResp?: <T = any>(response: AxiosResponse<T>) => any;
  onError?: (error: any) => any;
  beforeRequest?: BeforeRequestFunction;
} & AxiosRequestConfig;

export type ApiClientRequestOptions = {
  useBody?: boolean;
  useSearchParams?: boolean;
} & ApiClientOptions;

export type NoBodyMethod = 'get' | 'delete';

export type BodyMethod = 'post' | 'patch' | 'put';

export type Method = BodyMethod | NoBodyMethod;

class ApiClient {
  private onResp: <T = any>(response: AxiosResponse<T>) => any;
  private inst: AxiosInstance;
  private onError: (error: Error) => any;
  private beforeRequest: BeforeRequestFunction;

  constructor(options: ApiClientOptions = {}) {
    const { onResp, onError, beforeRequest, ...opts } = options;
    this.inst = axios.create(opts);
    this.onResp = onResp;
    this.onError = onError;
    this.beforeRequest = beforeRequest;
  }

  get interceptors() {
    return this.inst.interceptors;
  }

  registerInterceptor(
    type: keyof AxiosInstance['interceptors'],
    resolve: <V>(value: V) => V | Promise<V>,
    reject: (error: any) => any
  ) {
    return this.inst.interceptors[type].use(resolve, reject);
  }

  unregisterInterceptor(
    type: keyof AxiosInstance['interceptors'],
    interceptorId: number
  ) {
    this.inst.interceptors[type].eject(interceptorId);
  }

  registerRequestInterceptor(
    resolve: <V>(value: V) => V | Promise<V>,
    reject: (error: any) => any
  ) {
    return this.registerInterceptor('request', resolve, reject);
  }

  registerResponseInterceptor(
    resolve: <V>(value: V) => V | Promise<V>,
    reject: (error: any) => any
  ) {
    return this.registerInterceptor('response', resolve, reject);
  }

  unregisterRequestInterceptor(interceptor: number) {
    this.unregisterInterceptor('request', interceptor);
  }

  unregisterResponseInterceptor(interceptor: number) {
    this.unregisterInterceptor('response', interceptor);
  }

  get<S = any, T = any>(url: string, options?: ApiClientRequestOptions) {
    return this.requestBuilder<S, T>('get', url, options);
  }

  post<S = any, T = any>(url: string, options?: ApiClientRequestOptions) {
    return this.requestBuilder<S, T>('post', url, options);
  }

  put<S = any, T = any>(url: string, options?: ApiClientRequestOptions) {
    return this.requestBuilder<S, T>('put', url, options);
  }

  delete<S = any, T = any>(url: string, options?: ApiClientRequestOptions) {
    return this.requestBuilder<S, T>('delete', url, options);
  }

  patch<S = any, T = any>(url: string, options?: ApiClientRequestOptions) {
    return this.requestBuilder<S, T>('patch', url, options);
  }

  request<S = any, T = any>(
    method: Method,
    url: string,
    data: S,
    options: ApiClientRequestOptions
  ): Promise<T> {
    const {
      useBody,
      useSearchParams,
      onResp,
      onError,
      ...restOptions
    } = options;
    let requestUrl = url;
    let reqData: any;
    if (isPlainObject(data)) {
      const { url: newUrl, keys: usedKeys } = processParameterizedUrl(
        url,
        data
      );
      reqData = omit(<Object>data, usedKeys);
      requestUrl = newUrl;
    }
    let cancel: Canceler;
    restOptions.cancelToken = new axios.CancelToken((c) => {
      cancel = c;
    });

    let httpPromise: Promise<any>;
    if (isUseBodyMethod(method)) {
      httpPromise = this.inst[<BodyMethod>method](
        requestUrl,
        reqData,
        restOptions
      );
    } else if (useBody) {
      restOptions.data = reqData;
      httpPromise = this.inst[<NoBodyMethod>method](requestUrl, restOptions);
    } else {
      if (useSearchParams) {
        reqData = objectToUrlSearchParams(reqData);
      }
      restOptions.params = reqData;
      httpPromise = this.inst[<NoBodyMethod>method](requestUrl, restOptions);
    }

    httpPromise = wrapHttpPromise(httpPromise, { cancel });

    let resolve = onResp || this.onResp;
    let reject = onError || this.onError;
    if (resolve) httpPromise = httpPromise.then(resolve);
    if (reject) httpPromise = httpPromise.catch(reject);

    return httpPromise;
  }

  requestBuilder<S = any, T = any>(
    method: Method,
    url: string,
    options: ApiClientRequestOptions = {}
  ) {
    return (
      data?: S,
      extendedOptions: ApiClientRequestOptions = {}
    ): Promise<T> => {
      const newOptions = Object.assign({}, options, extendedOptions);
      const newData = isFunction(this.beforeRequest)
        ? this.beforeRequest(data, newOptions) || data
        : data;
      return this.request(method, url, newData, newOptions);
    };
  }
}

export default ApiClient;
