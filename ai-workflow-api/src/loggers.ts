export function logRequest(req: any, _res: any, next: any) {
  const start = Date.now();
  req.on("end", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${ms}ms`);
  });
  next();
}