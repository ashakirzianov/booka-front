// NOTE: this file contains lots of crypto code. I'm sorry, future Anton, but you have to deal with it!
import {
    Reducer as ReducerRedux, createStore, Middleware, applyMiddleware, compose, AnyAction,
} from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import * as RL from 'redux-loop';
import { mapObject, Func } from '../utils';

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

export type ActionType<Type extends PropertyKey, Payload> = {
    type: Type,
    payload: Payload,
};
export type ActionsType<Templates> =
    ({ [k in keyof Templates]: ActionType<k, Templates[k]> })[keyof Templates];

export type ActionCreator<Type extends PropertyKey, Payload> = Func<Payload, ActionType<Type, Payload>>;
export type ActionCreators<Template> = { [k in keyof Template]: ActionCreator<k, Template[k]> };

function buildActionCreator<T extends PropertyKey, P = any>(type: T): ActionCreator<T, P> {
    return p => ({
        type: type,
        payload: p,
    });
}

export function buildActionCreators<Template>(actionTemplate: Template): ActionCreators<Template> {
    return mapObject(actionTemplate, buildActionCreator as any) as ActionCreators<Template>;
}
