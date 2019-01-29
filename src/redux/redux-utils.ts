// NOTE: this file contains lots of crypto code. I'm sorry, future Anton, but you have to deal with it!
import { mapObject, Callback } from "../utils";
import { PromisePlus } from '../promisePlus';
import { combineReducers, Reducer as ReducerRedux } from "redux";

// Actions:

export type ActionType<Type extends PropertyKey, Payload> = {
    type: Type,
    payload: Payload,
};
export type ActionsType<Templates> =
    ({ [k in keyof Templates]: ActionType<k, Templates[k]> })[keyof Templates];

export type ActionCreator<Type extends PropertyKey, Payload> = (payload: Payload) => ActionType<Type, Payload>;
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
type SingleReducerT<State, ActionsT, Key extends keyof ActionsT> =
    ActionsT[Key] extends Promise<infer Fulfilled> ? PromiseReducerT<State, Fulfilled>
    : ActionsT[Key] extends PromisePlus<infer F, infer D> ? PromiseReducerT<State, F, D>
    : SimpleReducerT<State, ActionsT[Key]>
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
    return combineReducers(reducersMap);
}

function findReducerT<State, Template, Key extends keyof Template>(
    reducerTs: Partial<ReducerTs<State, Template>>,
    actionType: Extract<keyof Template, string>,
): SimpleReducerT<State, any> | undefined {

    const reducer = reducerTs[actionType] as any; // TODO: add note why we need to cast to any
    if (reducer && typeof reducer === 'function') {
        return reducer as SimpleReducerT<State, any>;
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
    }))
}

function stringEndCondition<T>(str: string, toTrim: string, f: (trimmed: string) => T): T | undefined {
    return str.endsWith(toTrim)
        ? f(str.substring(0, str.length - toTrim.length))
        : undefined
        ;
}
