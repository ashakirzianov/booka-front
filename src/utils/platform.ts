import { Platform } from 'react-native';

type PlatformValue<T> = {
    default?: T,
    web?: T,
    mobile?: T,
    ios?: T,
    android?: T,
};

export function platformValue<T, U>(pv: { default: T } & PlatformValue<U> | { web: T, mobile: U }): T | U;
export function platformValue<T, U, V>(pv: { web: T, ios: U, android: V }): T | U | V;
export function platformValue<T>(pv: PlatformValue<T>): T | undefined;
export function platformValue<T>(pv: PlatformValue<T>): T | undefined {
    switch (Platform.OS) {
        case 'web':
            return pv.web || pv.default;
        case 'ios':
            return pv.ios || pv.mobile || pv.default;
        case 'android':
            return pv.android || pv.mobile || pv.default;
        default:
            return pv.default;
    }
}
