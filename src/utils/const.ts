import { configValue } from './debug';
import { platformValue } from './platform';

const hostname = window && window.location && window.location.hostname;
const prodBack = 'https://reader-back.herokuapp.com';
export function backendBase() {
    return configValue({
        debug: platformValue({
            web: `http://${hostname}:3042`,
            default: prodBack,
        }),
        production: prodBack,
    });
}

const prodFront = 'http://booka.pub';
export function frontendBase() {
    return configValue({
        debug: platformValue({
            web: `http://${hostname}:3000`,
            default: prodFront,
        }),
        production: prodFront,
    });
}
