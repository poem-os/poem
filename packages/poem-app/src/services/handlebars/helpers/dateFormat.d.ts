interface DateFormatHelper {
  (date: Date | string | number | null | undefined, format?: string): string;
  description: string;
  example: string;
}
declare const dateFormat: DateFormatHelper;
export default dateFormat;
