export class DomainException extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly source?: string
  ) {
    super(message)
    this.name = 'DomainException'
  }
}
