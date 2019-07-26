export type Config = {
    usePersistentStorage: boolean,
    useTestStore: boolean,
    backendBase: string,
    frontendBase: string,
    logger: (msg: string) => void,
};

export function config(): Config {
    return configValue({
        production: productionConfig,
        debug: debugConfig,
    });
}

const prodBack = 'https://reader-back.herokuapp.com';
const prodFront = 'http://booka.pub';

const productionConfig: Config = {
    usePersistentStorage: true,
    useTestStore: false,
    backendBase: prodBack,
    frontendBase: prodFront,
    logger: () => undefined,
};

const hostname = window && window.location && window.location.hostname;

const debugConfig: Config = {
    usePersistentStorage: false,
    useTestStore: false,
    backendBase: hostname
        ? `http://${hostname}:3042`
        : prodBack,
    frontendBase: hostname
        ? `http://${hostname}:3000`
        : prodFront,
    // tslint:disable-next-line: no-console
    logger: msg => console.log(msg),
};

function isDebug() {
    return process.env.NODE_ENV === 'development';
}

type ConfigValue<T> = {
    default?: T,
    debug?: T,
    production?: T,
};

function configValue<T>(pv: { default: T } & Partial<ConfigValue<T>>): T;
function configValue<T, U>(pv: { debug: T, production: U }): T | U;
function configValue<T>(pv: ConfigValue<T>): T | undefined {
    if (isDebug()) {
        return pv.debug || pv.default;
    } else {
        return pv.production || pv.default;
    }
}
