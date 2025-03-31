import type { CMPErrorCode } from '../AppLovinMAX';

/**
 * Represents an error returned from the Consent Management Platform (CMP) flow.
 */
export type CMPError = {
    /**
     * The AppLovin-defined CMP error code.
     */
    code: CMPErrorCode;

    /**
     * A descriptive error message from the AppLovin SDK.
     */
    message: string;

    /**
     * The raw error code returned by the CMP.
     */
    cmpCode: number;

    /**
     * The raw error message returned by the CMP.
     */
    cmpMessage: string;
};
