import type { CMPErrorCode } from '../AppLovinMAX';

export type CMPError = {
    /**
     * The error code for this error.
     */
    countryCode: CMPErrorCode;

    /**
     * The error message for this error.
     */
    message: string;

    /**
     * The error code returned by the CMP.
     */
    cmpCode: number;

    /**
     * The error message returned by the CMP.
     */
    cmpMessage: string;
};
