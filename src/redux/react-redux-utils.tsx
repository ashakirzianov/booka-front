import { connect } from "react-redux";
import { Dispatch, Action } from "redux";
import { mapObject, pick, ExcludeKeys } from "../utils";
import {
    ActionDispatchers, ActionCreators,
    buildActionCreators, ActionDispatcher,
} from "./redux-utils";

export function buildConnectRedux<S, AT>(at: AT) {
    return function f<SK extends keyof S, AK extends Exclude<keyof AT, SK> = Exclude<keyof AT, SK>>(
        kk: Array<SK | AK>,
    ) {
        type ComponentProps = Pick<S, SK> & {
            [k in AK]: ActionDispatcher<AT[k]>;
        };
        const ak: AK[] = kk
            .filter(key =>
                (at as any)[key] !== undefined) as AK[];
        const sk: SK[] = kk
            .filter(key =>
                ak.find(a => a === key) === undefined) as SK[];
        return function ff<P>(Comp: React.ComponentType<P & ComponentProps>): React.ComponentType<ExcludeKeys<P, SK | AK>> {
            function mapStateToProps(store: S): Pick<S, SK> {
                return pick(store, ...sk);
            }

            const ac = buildActionCreators(pick(at, ...ak));
            function mapDispatchToProps(dispatch: Dispatch<Action<any>>) {
                function buildCallbacks<T>(creators: ActionCreators<T>): ActionDispatchers<T> {
                    return mapObject(
                        creators,
                        (key, value) =>
                            ((x: any) => { dispatch(value(x)); }) as any // TODO: try to remove this last cast
                            );
                }

                const callbacks = buildCallbacks(ac);
                return callbacks;
            }

            const connector = connect(mapStateToProps, mapDispatchToProps);

            const connected = connector(Comp as any); // TODO: try not to use 'as any'
            return connected as any; // TODO: try not to use 'as any'
        };
    };
}
