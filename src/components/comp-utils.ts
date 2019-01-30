import * as React from "react";
import Radium from "radium";
import { KeyRestriction, ExcludeKeys } from "../utils";
import { buildConnectRedux } from '../redux';
import { actionsTemplate, App } from "../model";

export type Callbacks<A> = {
    [name in keyof A]: ((arg: A[name]) => void);
};
export type CallbacksOpt<A> = Partial<Callbacks<A>>;
export type CompProps<P, A extends KeyRestriction<A, keyof P>> = P & CallbacksOpt<A>;
export type Comp<P = {}, A = {}> = React.SFC<CompProps<P, A>>;

export function size(s: number | undefined): string | undefined {
    return s === undefined ? undefined : `${s}em`;
}

export const connected = buildConnectRedux<App, typeof actionsTemplate>(actionsTemplate);

export type Hoverable<T extends KeyRestriction<T, ":hover">> = T & { ":hover"?: Partial<T> };

export function partial<T>(Cmp: React.SFC<T>) {
    return <P extends keyof T>(partials: Pick<T, P>): React.SFC<ExcludeKeys<T, P>> => {
        return props => React.createElement(
            Cmp,
            { ...(partials as any), ...(props as any) }, // TODO: investigate why we need 'as any'
            props.children
        );
    };
}

export function hoverable<T>(Cmp: React.SFC<T>): React.SFC<T> {
    return Radium(Cmp);
}
