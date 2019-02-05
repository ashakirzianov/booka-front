import { Platform } from 'react-native';

type PlatformValue<T> = {
    default?: T,
    web?: T,
    mobile?: T,
    ios?: T,
    android?: T,
};

export function platformValue<T>(pv: { default: T } & PlatformValue<T>): T;
export function platformValue<T>(pv: { web: T, mobile: T }): T;
export function platformValue<T>(pv: { web: T, ios: T, android: T }): T;
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
