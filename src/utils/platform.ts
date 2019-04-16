import { Platform as ReactNativePlatform } from 'react-native';
import { assertNever } from './misc';

export type PlatformValue<T> = Partial<{
    default: T,
    web: T,
    chrome: T,
    safari: T,
    safariDesktop: T,
    safariMobile: T,
    firefox: T,
    otherWeb: T,
    mobile: T,
    ios: T,
    android: T,
    otherMobile: T,
}>;

export function platformValue<T>(pv: { default: T } & PlatformValue<T>): T;
export function platformValue<T>(pv: PlatformValue<T>): T | undefined;
export function platformValue<T>(pv: PlatformValue<T>): T | undefined {
    const p = platform();
    switch (p) {
        case 'chrome':
            return pv.chrome || pv.web || pv.default;
        case 'safari-desktop':
            return pv.safariDesktop || pv.safari || pv.web || pv.default;
        case 'safari-mobile':
            return pv.safariMobile || pv.safari || pv.web || pv.default;
        case 'firefox':
            return pv.firefox || pv.web || pv.default;
        case 'other-web':
            return pv.web || pv.default;
        case 'ios':
            return pv.ios || pv.mobile || pv.default;
        case 'android':
            return pv.android || pv.mobile || pv.default;
        case 'other-mobile':
            return pv.mobile || pv.default;
        default:
            return assertNever(p);
    }
}

export type WebPlatform =
    | 'chrome'
    | 'safari-desktop' | 'safari-mobile'
    | 'firefox'
    | 'other-web'
    ;
export type MobilePlatform = | 'ios' | 'android' | 'other-mobile';
export type Platform = WebPlatform | MobilePlatform;

export function platform(): Platform {
    switch (ReactNativePlatform.OS) {
        case 'web':
            return webPlatform();
        case 'ios':
            return 'ios';
        case 'android':
            return 'android';
        default:
            return 'other-mobile';
    }
}

export function webPlatform(): WebPlatform {
    const win = window as any;
    const navigator = window.navigator;

    const isChromium = win.chrome !== null
        && typeof win.chrome !== 'undefined'
        && navigator.vendor === 'Google Inc.';
    const isOpera = typeof win.opr !== 'undefined';
    const isEdge = navigator.userAgent.indexOf('Edge') > -1;
    const isIOSChrome = navigator.userAgent.match('CriOS');
    if (isIOSChrome || (isChromium && !isOpera && !isEdge)) {
        return 'chrome';
    }

    const isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    const isSafariMobile = /iPad|iPhone|iPod/.test(navigator.userAgent) && !win.MSStream;
    if (isSafari) {
        return isSafariMobile
            ? 'safari-mobile'
            : 'safari-desktop';
    }

    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox) {
        return 'firefox';
    }

    return 'other-web';
}
