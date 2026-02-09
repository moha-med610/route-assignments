export class ServerError extends Error {
  constructor(success = false, code = 500, message) {
    super(message);
    this.success = success;
    this.code = code;
  }
}
