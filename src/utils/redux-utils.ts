import {
    createStore, Middleware, applyMiddleware, compose,
    Reducer as ReducerRedux,
    Action as ReduxAction,
} from 'redux';
import {
    install, Cmd, Loop,
    combineReducers as loopCombineReducers,
    loop as loopLoop,
} from 'redux-loop';

// TODO: remove it once 'redux-loop' improve typings
type ActualLoopReducer<S, A extends ReduxAction> = (state: S | undefined, action: A, ...args: any[]) => (S | Loop<S, A>);
type ReducersMap<State, Action extends ReduxAction> = {
    [k in keyof State]: ActualLoopReducer<State[k], Action>;
};
export function combineReducers<State, Action extends ReduxAction>(map: ReducersMap<State, Action>): ReducerRedux<State, Action> {
    // TODO: remove type assertions once 'redux-loop' improve typings
    return loopCombineReducers(map as any) as any;
}

export function createEnhancedStore<State, A extends ReduxAction>(reducer: ReducerRedux<State, A>, initial: State | undefined, middlewares: Array<Middleware<{}, State, any>> | undefined = []) {
    const middlewareEnhancer = applyMiddleware(
        ...middlewares
    );
    const loopEnhancer = install();
    return createStore(reducer, initial, compose(
        loopEnhancer,
        middlewareEnhancer
    ));
}

type ErrorType = string | undefined;
type PossibleCreator<A, Payload> = (p: Payload) => A;
type LoopInput<State, A extends ReduxAction, AsyncResult> = {
    state: State,
    async: () => Promise<AsyncResult>,
    success: PossibleCreator<A, AsyncResult>,
    fail?: PossibleCreator<A, ErrorType>,
};
export function loop<S, A extends ReduxAction, AsyncResult>(input: LoopInput<S, A, AsyncResult>) {
    return loopLoop(input.state, Cmd.run(input.async, {
        successActionCreator: input.success,
        failActionCreator: input.fail,
    }));
}

// Actions:

type ActionObject<Type extends PropertyKey, Payload> = {
    type: Type,
    payload: Payload,
};

export type ActionCreator<Type extends PropertyKey, Payload> =
    (x: Payload) => ActionObject<Type, Payload>;

type ExtractActionType<T> = T extends ActionCreator<infer Type, infer Payload>
    ? ActionObject<Type, Payload>
    : never;

export type ActionFromCreators<AC> = {
    [k in keyof AC]: ExtractActionType<AC[k]>
}[keyof AC];

export type ActionCreatorsMap = {
    [k in string]: ActionCreator<any, any>
};

export function actionCreator<P = void>() {
    return <T extends PropertyKey>(type: T): ActionCreator<T, P> => ((p: P) => ({
        type: type,
        payload: p,
    }));
}
