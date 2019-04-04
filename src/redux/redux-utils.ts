import {
    Reducer as ReducerRedux, createStore, Middleware, applyMiddleware, compose, AnyAction,
} from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import { install, Cmd, loop, combineReducers as loopCombineReducers } from 'redux-loop';

type ReducersMap<State, Action extends AnyAction> = {
    [k in keyof State]: ReducerRedux<State[k], Action>;
};
export function combineReducers<State, Action extends AnyAction>(map: ReducersMap<State, Action>): ReducerRedux<State, Action> {
    // TODO: remove type assertions once 'redux-loop' improve typings
    return loopCombineReducers(map as any) as any;
}

export function createEnhancedStore<State, A extends AnyAction>(reducer: ReducerRedux<State, A>, middlewares: Array<Middleware<{}, State, any>>) {
    const middlewareEnhancer = applyMiddleware(
        promiseMiddleware(),
        ...middlewares,
    );
    const loopEnhancer = install();
    return createStore(reducer, compose(
        loopEnhancer,
        middlewareEnhancer,
    ));
}

type ErrorType = string | undefined;
type PossibleCreator<A, Payload> = (p: Payload) => A;

export function buildLoop<A>() {
    type LoopInput<State, AsyncResult> = {
        state: State,
        async: () => Promise<AsyncResult>,
        success: PossibleCreator<A, AsyncResult>,
        fail?: PossibleCreator<A, ErrorType>,
    };
    // TODO: remove type assertions once 'redux-loop' improve typings
    return <State, AsyncResult>(input: LoopInput<State, AsyncResult>): State =>
        loop(input.state, Cmd.run(input.async, {
            successActionCreator: input.success as any,
            failActionCreator: input.fail as any,
        })) as any;
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

export type ActionsType<AC> = {
    [k in keyof AC]: ExtractActionType<AC[k]>
}[keyof AC];

export type ActionCreatorsMap = {
    [k in string]: ActionCreator<any, any>
};

export function actionCreator<P = void>() {
    return <T extends PropertyKey>(type: T): ActionCreator<T, P> => p => ({
        type: type,
        payload: p,
    });
}
