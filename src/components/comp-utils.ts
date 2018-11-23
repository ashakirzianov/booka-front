import * as React from "react";
import { KeyRestriction } from "../utils";

type Callbacks<A> = {
    [name in keyof A]: ((arg: A[name]) => void);
};
type CallbacksOpt<A> = Partial<Callbacks<A>>;
type CompProps<P, A extends KeyRestriction<A, keyof P>> = P & CallbacksOpt<A>;
export type Comp<P = {}, A = {}> = React.SFC<CompProps<P, A>>;
