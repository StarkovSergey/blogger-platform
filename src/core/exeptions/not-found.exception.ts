/**
 * Ресурс не найден.
 * */
export class NotFoundException extends Error {
  constructor(
    message: string,
    public readonly field: string = 'id'
  ) {
    super(message)
    this.name = 'NotFoundException'
  }
}
