import { NativeModules } from 'react-native';
import type { PrivacyType } from './types/Privacy';

const { AppLovinMAX } = NativeModules;

export const Privacy: PrivacyType = AppLovinMAX;
