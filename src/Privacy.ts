import { NativeModules } from 'react-native';
import type { PrivacyType } from './types/Privacy';

const { AppLovinMAX } = NativeModules;

/**
 * This enum represents the user's geography used to determine the type of consent flow shown to the
 * user.
 */
export enum ConsentFlowUserGeography {
    /**
     * User's geography is unknown.
     */
    UNKNOWN = 'U',

    /**
     * The user is in GDPR region.
     */
    GDPR = 'G',

    /**
     * The user is in a non-GDPR region.
     */
    OTHER = 'O',
}

export const Privacy: PrivacyType = AppLovinMAX;
