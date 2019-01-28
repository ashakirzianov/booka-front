import * as React from "react";
import { KeyRestriction } from "../utils";

export type Callbacks<A> = {
    [name in keyof A]: ((arg: A[name]) => void);
};
export type CallbacksOpt<A> = Partial<Callbacks<A>>;
export type CompProps<P, A extends KeyRestriction<A, keyof P>> = P & CallbacksOpt<A>;
export type Comp<P = {}, A = {}> = React.SFC<CompProps<P, A>>;

export function size(s: number | undefined): string | undefined {
    return s === undefined ? undefined : `${s}em`;
}
