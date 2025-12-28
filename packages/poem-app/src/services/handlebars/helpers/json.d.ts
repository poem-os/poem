import Handlebars from 'handlebars';

interface JsonHelper {
  (obj: unknown): Handlebars.SafeString;
  description: string;
  example: string;
}
declare const json: JsonHelper;
export default json;
