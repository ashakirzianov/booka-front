import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import { mapObject, pick, ExcludeKeys, Func } from '../utils';
import { ActionCreatorsMap, ActionCreator } from './redux-utils';

type ActionDispatcher<Payload> = Func<Payload, void>;

type PayloadType<A> = A extends ActionCreator<infer T, infer P>
    ? P
    : never;

export function buildConnectRedux<State, ACs extends ActionCreatorsMap>(actionCreators: ACs) {
    return function connectKeys<
        StateKs extends keyof State,
        ActionKs extends Exclude<keyof ACs, StateKs> = never>(
            stateKs: StateKs[],
            actionKs: ActionKs[] = [],
    ) {
        type ComponentProps = Pick<State, StateKs> & {
            [k in ActionKs]: ActionDispatcher<PayloadType<ACs[k]>>;
        };
        return function connectComp<P>(Comp: React.ComponentType<P & ComponentProps>): React.ComponentType<ExcludeKeys<P, StateKs | ActionKs>> {
            function mapStateToProps(store: State): Pick<State, StateKs> {
                return pick(store, ...stateKs);
            }

            const ac = pick(actionCreators, ...actionKs);
            function mapDispatchToProps(dispatch: Dispatch<Action<any>>) {

                const callbacks = mapObject(
                    ac,
                    (key, value) =>
                        ((x: any) => { dispatch(value(x)); }),
                );
                return callbacks;
            }

            const connector = connect(mapStateToProps, mapDispatchToProps);

            const connected = connector(Comp as any); // TODO: try not to use 'as any'
            return connected as any; // TODO: try not to use 'as any'
        };
    };
}
