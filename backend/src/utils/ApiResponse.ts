export class ApiResponse<T = unknown> {
  constructor(
    public readonly success: boolean,
    public readonly message: string,
    public readonly data?: T,
    public readonly meta?: Record<string, unknown>,
    public readonly ok = success
  ) {}
}
