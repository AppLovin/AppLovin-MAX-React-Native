import type { LocalExtraParameterValue } from './types/AdProps';

export const makeExtraParametersArray = (input?: Record<string, string | null>) => (input ? Object.entries(input).map(([key, value]) => ({ key, value })) : []);

type LocalExtraParameterType = 'string' | 'number' | 'bool';

type LocalExtraParameterValueMap = {
    string: string | null;
    number: number | null;
    bool: boolean | null;
};

export const makeLocalExtraParametersArray = <T extends LocalExtraParameterType>(
    input: Record<string, LocalExtraParameterValue> | undefined,
    type: T
): { key: string; value: LocalExtraParameterValueMap[T] }[] => {
    if (!input) return [];

    return Object.entries(input)
        .filter(([_, value]) => {
            if (value === null) return true;
            if (type === 'string') return typeof value === 'string';
            if (type === 'number') return typeof value === 'number';
            if (type === 'bool') return typeof value === 'boolean';
            return false;
        })
        .map(([key, value]) => ({ key, value: value as LocalExtraParameterValueMap[T] }));
};
