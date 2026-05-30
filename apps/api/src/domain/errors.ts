/** Raised when a Money value object is constructed with an invalid amount or used incorrectly. */
export class InvalidMoneyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidMoneyError';
  }
}
