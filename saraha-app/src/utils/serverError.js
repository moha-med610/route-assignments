export class ServerError extends Error {
  constructor(success = false, code = 500, message) {
    super(message);
    this.success = success;
    this.code = code;
  }
}

export class ServerResponse extends Response {
  constructor(success = true, code = 200, message, data) {
    super();
    this.success = success;
    this.code = code;
    this.message = message;
    this.data = data;
  }
}
