export default class HttpError {
  public statusCode: string | number;
  public message: string;
  constructor(statusCode: string | number, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}
