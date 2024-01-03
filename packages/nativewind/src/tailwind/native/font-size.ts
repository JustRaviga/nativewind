import {PluginAPI} from "tailwindcss/types/config";
import {isPlainObject} from "./utils";

const toHyphen = (string: string) => string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

/**
 * This "fixes" the fontSize plugin to calculate relative lineHeight's
 * based upon the fontsize. lineHeight's with units are kept as is
 *
 * Eg
 * { lineHeight: 1, fontSize: 12 } -> { lineHeight: 12, fontSize 12}
 * { lineHeight: 1px, fontSize: 12 } -> { lineHeight: 1px, fontSize 12}
 */
export const fontSize = ({matchUtilities, theme}: PluginAPI) => {
  matchUtilities(
    {
      text: (value: unknown) => {
        const [_fontSize, _options] = Array.isArray(value) ? value : [value];
        const options = isPlainObject(_options)
          ? {..._options, fontSize: _fontSize}
          : {lineHeight: _options, letterSpacing: undefined, fontSize: _fontSize};
        const lineHeight = options.lineHeight;

        return {
          ...Object.fromEntries(
            Object.entries(options)
              .map(([key, value]) => [
                toHyphen(key),
                value])
              .filter(([, value]) => value !== undefined)
          ),
          ...(lineHeight === undefined
            ? {}
            : {
              "line-height": lineHeight.endsWith("px")
                ? lineHeight
                : `${Number.parseFloat(_fontSize) * lineHeight}px`,
            }),
        };
      },
    },
    {
      values: theme("fontSize"),
      type: ["absolute-size", "relative-size", "length", "percentage"],
    }
  );
};
