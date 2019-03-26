import * as React from 'react';
import Radium from 'radium';
import { KeyRestriction, ExcludeKeys } from '../utils';
import { buildConnectRedux } from '../redux';
import { actionsTemplate, App, Theme } from '../model';
import { platformValue } from '../platform';

export * from './comp-utils.platform';

export type ReactContent = React.ReactNode;
export type Callback<Argument> = (arg: Argument) => void;
export type VoidCallback = Callback<void>;
export type Callbacks<A> = {
    [name in keyof A]: Callback<A[name]>;
};
export type CallbacksOpt<A> = Partial<Callbacks<A>>;
export type CompProps<P, A extends KeyRestriction<A, keyof P>> = P & CallbacksOpt<A>;
export type Comp<P = {}, A = {}> = React.ComponentType<CompProps<P, A>>;
export function comp<P ={}, A = {}>(c: Comp<P, A>) {
    return c;
}

export function relative(size: number) {
    return platformValue({
        web: `${size}em`,
        mobile: `${size}%`,
    });
}

export function absolute(size: number) {
    return `${size}`;
}

export const connected = buildConnectRedux<App, typeof actionsTemplate>(actionsTemplate);

export type Hoverable<T extends KeyRestriction<T, ':hover'>> = T & { ':hover'?: Partial<T> };

export function partial<T>(Cmp: Comp<T>) {
    return <P extends keyof T>(partials: Pick<T, P>): Comp<ExcludeKeys<T, P>> => {
        return props => React.createElement(
            Cmp,
            { ...(partials as any), ...(props as any) }, // TODO: investigate why we need 'as any'
            props.children,
        );
    };
}

export function hoverable<T>(Cmp: React.ComponentType<T>): React.ComponentType<T> {
    return Radium(Cmp);
}

type ThemeableComp<T> = Comp<T & {
    theme: Theme,
}>;
export function themed<T = {}>(C: ThemeableComp<T>) {
    return connected(['theme'], [])(C);
}
