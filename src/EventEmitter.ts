/**
 * Manages AppLovin MAX ad event listeners using a shared NativeEventEmitter.
 * Ensures only one active subscription per event type at any given time.
 */

import { NativeEventEmitter } from 'react-native';
import type { EventSubscription } from 'react-native';
import type { AdEventObject, AdEventListener } from './types/AdEvent';
import AppLovinMAX from './specs/NativeAppLovinMAXModule';

// Singleton event emitter for AppLovin MAX native events.
const emitter = new NativeEventEmitter(AppLovinMAX);

// Tracks active subscriptions by event type.
const subscriptions: Record<string, EventSubscription> = {};

/**
 * Subscribes to a specific ad event.
 * If a listener already exists for the event, it will be replaced.
 *
 * @param event - The event name to listen for.
 * @param handler - The callback to handle the event.
 */
export const addEventListener = <T extends AdEventObject>(event: string, handler: AdEventListener<T>): void => {
    const subscription = emitter.addListener(event, handler);
    const currentSubscription = subscriptions[event];
    if (currentSubscription) {
        currentSubscription.remove();
    }
    subscriptions[event] = subscription;
};

/**
 * Unsubscribes from a specific ad event, if a listener exists.
 *
 * @param event - The event name to unsubscribe from.
 */
export const removeEventListener = (event: string): void => {
    const currentSubscription = subscriptions[event];
    if (currentSubscription) {
        currentSubscription.remove();
        delete subscriptions[event];
    }
};
