interface DefaultHelper {
  <T>(value: T | null | undefined | '', fallback: T): T;
  (value: unknown, fallback?: unknown): unknown;
  description: string;
  example: string;
}
declare const defaultHelper: DefaultHelper;
export default defaultHelper;
