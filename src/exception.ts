export class CustomException extends Error {
  static errorName = "ExceptionWithResponse";
  constructor(message: string) {
    super(message);
    this.name = CustomException.name;
  }
}
