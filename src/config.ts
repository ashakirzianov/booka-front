export type Config = {
    usePersistentStorage: boolean,
    useTestStore: boolean,
    backendBase: string,
    frontendBase: string,
    facebook: {
        clientId: string,
    },
    logger: (msg?: string) => void,
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
    facebook: { clientId: '1527203577422306' },
    logger: () => undefined,
};

const hostname = window && window.location && window.location.hostname;
const localProtocol = process.env.HTTPS ? 'https' : 'http';
export const debugBack = `https://${hostname}:3042`;

const debugConfig: Config = {
    usePersistentStorage: true,
    useTestStore: false,
    backendBase: prodBack,
    frontendBase: hostname
        ? `${localProtocol}://${hostname}:3000`
        : prodFront,
    facebook: { clientId: '1527203577422306' },
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
