import type { LocalExtraParameterValue } from './types/AdProps';

/**
 * Converts a record of string-based extra parameters into an array of `{ key, value }` objects.
 * Used for sending extra parameters to the native SDK.
 *
 * @param input - An optional map of key-value string pairs (or null values).
 * @returns An array of `{ key, value }` objects. Returns an empty array if input is undefined.
 */
export const makeExtraParametersArray = (input?: Record<string, string | null>): { key: string; value: string | null }[] => {
    if (!input) return [];

    return Object.entries(input).map(([key, value]) => ({ key, value }));
};

type LocalExtraParameterType = 'str' | 'bool';

type LocalExtraParameterValueMap = {
    str: string | null;
    bool: boolean | null;
};

/**
 * Converts a map of local extra parameters into a filtered array of `{ key, value }` pairs.
 * Only values matching the specified type (`'str'` or `'bool'`) are included.
 *
 * @param input - A record of local extra parameters (string, boolean, or null).
 * @param type - The expected type of each value: `'str'` for strings, `'bool'` for booleans.
 * @returns A filtered array of `{ key, value }` objects, cast to the specified type.
 */
export const makeLocalExtraParametersArray = <T extends LocalExtraParameterType>(
    input: Record<string, LocalExtraParameterValue> | undefined,
    type: T
): { key: string; value: LocalExtraParameterValueMap[T] }[] => {
    if (!input) return [];

    return Object.entries(input)
        .filter(([_, value]) => {
            if (value === null) return true;
            if (type === 'str') return typeof value === 'string';
            if (type === 'bool') return typeof value === 'boolean';
            return false;
        })
        .map(([key, value]) => ({ key, value: value as LocalExtraParameterValueMap[T] }));
};
