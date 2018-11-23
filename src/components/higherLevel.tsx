import * as React from "react";
import Radium from "radium";
import { KeyRestriction, ExcludeKeys } from "../utils";
import { Loadable, isLoading, Loading } from '../model';
import { Comp } from './comp-utils';

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

export function loadable<T>(Cmp: Comp<T>): Comp<Loadable<T>> {
    return props =>
        isLoading(props) ? <LoadingComp {...props} /> : <Cmp {...props} />;
}

const LoadingComp: Comp<Loading> = props =>
    <div>Loading now...</div>;