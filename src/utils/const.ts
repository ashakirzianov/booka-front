import { configValue } from './debug';

export function backendBase() {
    return configValue({
        // debug: 'http://localhost:3042',
        // TODO: this is not reliable solution, think of something else
        debug: 'http://192.168.1.190:3042',
        production: 'https://reader-back.herokuapp.com',
    });
}

export function frontendBase() {
    // TODO: generate dynamically ?
    return configValue({
        // TODO: this is not reliable solution, think of something else
        debug: 'http://192.168.1.190:3000',
        // debug: 'http://localhost:3000',
        production: 'http://booka.pub',
    });
}
