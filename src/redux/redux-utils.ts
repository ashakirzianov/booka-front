// NOTE: this file contains lots of crypto code. I'm sorry, future Anton, but you have to deal with it!
import {
    Reducer as ReducerRedux, createStore, Middleware, applyMiddleware, compose, AnyAction,
} from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import * as RL from 'redux-loop';
import { mapObject, Func } from '../utils';
import { PromisePlus } from '../promisePlus';

type ReducersMap<State, Action extends AnyAction> = {
    [k in keyof State]: ReducerRedux<State[k], Action>;
};
export function combineReducers<State, Action extends AnyAction>(map: ReducersMap<State, Action>): ReducerRedux<State, Action> {
    return RL.combineReducers(map);
}

export function createEnhancedStore<State, A extends AnyAction>(reducer: ReducerRedux<State, A>, middlewares: Array<Middleware<{}, State, any>>) {
    const middlewareEnhancer = applyMiddleware(
        promiseMiddleware(),
        ...middlewares,
    );
    const loopEnhancer = RL.install();
    return createStore(reducer, compose(
        loopEnhancer,
        middlewareEnhancer,
    ));
}

type ErrorType = string | undefined;
type CanHandleErrorKeys<AT> = {
    [k in keyof AT]: ErrorType extends AT[k]
    ? k
    : never;
}[keyof AT];
export function buildLoop<AT>() {
    type LoopInput<State, Suc extends keyof AT, F extends CanHandleErrorKeys<AT>> = {
        state: State,
        async: () => Promise<AT[Suc]>,
        success: Suc,
        fail?: F,
    };
    return <State, Suc extends keyof AT, F extends CanHandleErrorKeys<AT>>(input: LoopInput<State, Suc, F>): State =>
        RL.loop(input.state, RL.Cmd.run(input.async, {
            successActionCreator: buildActionCreator(input.success),
            failActionCreator: input.fail && buildActionCreator(input.fail) as any,
        })) as any;
}

// Actions:

type Callback<T> = (arg: T) => void;
export type ActionType<Type extends PropertyKey, Payload> = {
    type: Type,
    payload: Payload,
};
export type ActionsType<Templates> =
    ({ [k in keyof Templates]: ActionType<k, Templates[k]> })[keyof Templates];

export type ActionCreator<Type extends PropertyKey, Payload> = Func<Payload, ActionType<Type, Payload>>;
export type ActionCreators<Template> = { [k in keyof Template]: ActionCreator<k, Template[k]> };
export type ActionDispatcher<Payload> = Callback<Payload>;
export type ActionDispatchers<Template> = { [k in keyof Template]: ActionDispatcher<Template[k]> };

function buildActionCreator<T extends PropertyKey>(type: T): ActionCreator<T, any> {
    return p => ({
        type: type,
        payload: p,
    });
}

export function buildActionCreators<Template>(actionTemplate: Template): ActionCreators<Template> {
    return mapObject(actionTemplate, buildActionCreator) as ActionCreators<Template>;
}

// Reducers:

type SimpleReducerT<State, Payload = {}> =
    (state: State, payload: Payload) => State;
type PromiseReducerT<State, Payload = {}, Data = undefined> = {
    pending?: SimpleReducerT<State, Data>,
    rejected?: SimpleReducerT<State, any>,
    fulfilled?: SimpleReducerT<State, Payload>,
};
export type LoopReducerT<S, AT, K extends keyof AT, Suc extends keyof AT, Err extends keyof AT> = {
    sync: SimpleReducerT<S, AT[K]>,
    async: (s: S, p: AT[K]) => Promise<AT[Suc]>,
    success: Suc,
    fail?: Err,
};

type SingleReducerT<State, ActionsT, Key extends keyof ActionsT> =
    ActionsT[Key] extends Promise<infer Fulfilled> ? PromiseReducerT<State, Fulfilled>
    : ActionsT[Key] extends PromisePlus<infer F, infer D> ? PromiseReducerT<State, F, D>
    : (SimpleReducerT<State, ActionsT[Key]> | LoopReducerT<State, ActionsT, Key, keyof ActionsT, keyof ActionsT>)
    ;

export type ReducerTs<State, ActionsT> = {
    [k in keyof ActionsT]: SingleReducerT<State, ActionsT, k>;
};

export type Reducer<State, Template> =
    (state: State | undefined, action: ActionsType<Template>) => State;

export function buildReducer<State, Template>(
    reducerTemplate: ReducerTs<State, Template>,
    initial?: State,
): Reducer<State, Template> {
    return buildPartialReducer(reducerTemplate, initial);
}

export function buildPartialReducer<State, Template>(
    reducerTemplate: Partial<ReducerTs<State, Template>>,
    initial?: State,
): Reducer<State, Template> {
    return function reducer(state: State = null as any, action: ActionsType<Template>): State {
        if (state === undefined) { // Redux send undefined state on init
            return initial === undefined ? null as any : initial; // ...need to return initial state or "null"
        }

        const single = findReducerT(reducerTemplate, action.type as Extract<keyof Template, string>);

        if (single === undefined) {
            return state; // Always return current state if action type is not supported
        }

        const newState = single(state, action.payload);
        return newState;
    };
}

type PartialReducersTemplate<State, AT> = {
    [k in keyof State]: Partial<ReducerTs<State[k], AT>>;
};
export function buildPartialReducers<State, AT>(template: PartialReducersTemplate<State, AT>): ReducerRedux<State> {
    const reducersMap = mapObject(template, (_, pt) => buildPartialReducer(pt as any)) as any; // TODO: add note whe we need to cast to any
    return RL.combineReducers(reducersMap) as any;
}

function findReducerT<State, Template, Key extends keyof Template>(
    reducerTs: Partial<ReducerTs<State, Template>>,
    actionType: Extract<keyof Template, string>,
): SimpleReducerT<State, any> | undefined {

    const reducer = reducerTs[actionType]; // TODO: add note why we need to cast to any
    if (isSimple(reducer)) {
        return reducer;
    } else if (isLoop(reducer)) {
        return (state: State, payload: any) => RL.loop(
            reducer.sync(state, payload),
            RL.Cmd.run(reducer.async, {
                successActionCreator: buildActionCreator(reducer.success),
                failActionCreator: reducer.fail ? buildActionCreator(reducer.fail) : undefined,
                args: [state, payload],
            }),
        ) as any;
    }

    const promiseTemplate = reducerTs as { [k: string]: PromiseReducerT<State, any> };
    const actionKeyPair = parsePromiseActionName(actionType);
    if (actionKeyPair) {
        const promiseReducerTemplate = promiseTemplate[actionKeyPair.action];
        const promiseReducer = promiseReducerTemplate && promiseReducerTemplate[actionKeyPair.key];

        if (promiseReducer) {
            return promiseReducer;
        }
    }

    return undefined;
}

function parsePromiseActionName(actionName: string) {
    return stringEndCondition(actionName, '_PENDING', action => ({
        key: 'pending' as 'pending',
        action,
    }))
        || stringEndCondition(actionName, '_REJECTED', action => ({
            key: 'rejected' as 'rejected',
            action,
        }))
        || stringEndCondition(actionName, '_FULFILLED', action => ({
            key: 'fulfilled' as 'fulfilled',
            action,
        }));
}

function stringEndCondition<T>(str: string, toTrim: string, f: (trimmed: string) => T): T | undefined {
    return str.endsWith(toTrim)
        ? f(str.substring(0, str.length - toTrim.length))
        : undefined
        ;
}

function isSimple(r: any): r is SimpleReducerT<any, any> {
    return r && typeof r === 'function';
}

function isLoop(r: any): r is LoopReducerT<any, any, any, any, any> {
    return r && r.sync;
}

// function isPromise(r: any): r is PromiseReducerT<any, any> {
//     return r && (r.pending || r.fulfilled || r.rejected);
// }
