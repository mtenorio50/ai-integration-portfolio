export class AppError extends Error {
  status: number;
  code: string;
  constructor(message: string, opts: { status?: number; code?: string } = {}) {
    super(message);
    this.status = opts.status ?? 500;
    this.code = opts.code ?? "INTERNAL_ERROR";
  }
}

export function errorMiddleware(err: any, _req: any, res: any, _next: any) {
  const status = err?.status ?? 500;
  const code = err?.code ?? "INTERNAL_ERROR";
  const msg = err?.message ?? "Unexpected error";
  res.status(status).json({ error: msg, code });
}