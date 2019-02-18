import { connect } from "react-redux";
import { Dispatch, Action } from "redux";
import { mapObject, pick, ExcludeKeys } from "../utils";
import {
    ActionDispatchers, ActionCreators,
    buildActionCreators, ActionDispatcher,
} from "./redux-utils";

export function buildConnectRedux<State, ActionsT>(actionsT: ActionsT) {
    return function connectKeys<
        StateKs extends keyof State,
        ActionKs extends Exclude<keyof ActionsT, StateKs> = never>(
        stateKs: Array<StateKs>,
        actionKs: Array<ActionKs> = []
    ) {
        type ComponentProps = Pick<State, StateKs> & {
            [k in ActionKs]: ActionDispatcher<ActionsT[k]>;
        };
        // const actionKs: ActionKs[] = allKeys
        //     .filter(key =>
        //         (actionsT as any)[key] !== undefined) as ActionKs[];
        // const stateKs: StateKs[] = allKeys
        //     .filter(key =>
        //         actionKs.find(ak => ak === key) === undefined) as StateKs[];
        return function connectComp<P>(Comp: React.ComponentType<P & ComponentProps>): React.ComponentType<ExcludeKeys<P, StateKs | ActionKs>> {
            function mapStateToProps(store: State): Pick<State, StateKs> {
                return pick(store, ...stateKs);
            }

            const ac = buildActionCreators(pick(actionsT, ...actionKs));
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
