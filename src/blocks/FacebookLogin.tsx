/*global globalThis*/
import * as React from 'react';

import { Column, Row } from './Layout';
import { Callback } from '../utils';
import { Icon } from './Icons';
import { point } from './common';

type SocialLoginProvider = 'facebook';
type SocialLoginResultFail = {
    success: false,
};
type SocialLoginResultSuccess = {
    success: true,
    token: string,
    provider: SocialLoginProvider,
};
export type SocialLoginResult = SocialLoginResultSuccess | SocialLoginResultFail;

type SocialButtonProps = {
    clientId: string,
    onLogin: Callback<SocialLoginResult>,
    onStatusChange?: Callback,
};

type LoginState =
    | { state: 'checking' }
    | { state: 'not-logged' }
    | { state: 'logged', token?: string, name?: string, picture?: string }
    ;
export type FacebookLoginProps = SocialButtonProps;
export function FacebookLogin({ clientId, onLogin, onStatusChange }: FacebookLoginProps) {
    const [loginState, setLoginState] = React.useState<LoginState>({ state: 'checking' });
    const updateLoginState = React.useCallback((state: LoginState) => {
        setLoginState(state);
        if (onStatusChange) {
            setTimeout(onStatusChange, 200);
        }
    }, [onStatusChange, setLoginState]);

    React.useEffect(() => {
        initFbSdk(clientId);
    }, [clientId]);

    React.useEffect(() => {
        getLoginStatus(updateLoginState);
    }, [updateLoginState]);

    return <Column>
        <ActualButton
            onClick={() => {
                if (loginState.state === 'logged' && loginState.token) {
                    onLogin({
                        success: true,
                        provider: 'facebook',
                        token: loginState.token,
                    });
                    updateLoginState(loginState);
                } else if (globalThis.FB) {
                    globalThis.FB.login(res => {
                        handleFbLoginState(res, updateLoginState);
                    });
                }
            }}
            user={
                loginState.state === 'logged' && loginState.name
                    ? { name: loginState.name, pictureUrl: loginState.picture }
                    : undefined
            }
        />
    </Column>;
}

type ActualButtonProps = {
    onClick: Callback<void>,
    user?: {
        name: string,
        pictureUrl?: string,
    },
};
function ActualButton({ onClick, user }: ActualButtonProps) {
    const text = user
        ? `Continue as ${user.name}`
        : 'Continue with facebook';
    return <button
        onClick={onClick}
        style={{
            color: 'white',
            background: '#4469b0',
            borderStyle: 'none',
            borderRadius: 3,
            cursor: 'pointer',
            padding: 0,
        }}
    >
        <Row centered justified>
            <div style={{ marginLeft: point(0.5) }}>
                <Icon name='facebook' size={point(2)} />
            </div>
            <span style={{
                fontSize: point(1.5),
                fontFamily: 'Helvetica',
                margin: point(0.5),
                whiteSpace: 'pre',
            }}>
                {text}
            </span>
            {
                user && user.pictureUrl
                    ? <img
                        alt=''
                        src={user.pictureUrl}
                    />
                    : null
            }
        </Row>
    </button>;
}

function initFbSdk(clientId: string) {
    let timeout = 0;
    (window as any).fbAsyncInit = function asyncInit() {
        if (globalThis.FB) {
            globalThis.FB.init({
                appId: clientId,
                cookie: true,
                xfbml: true,
                version: 'v4.0',
            });
        } else {
            setTimeout(asyncInit(), timeout);
            timeout += 1000;
        }
    };

    loadSdk();
}

function loadSdk() {
    (function (d, s, id) {
        let js: any;
        const fjs: any = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s); js.id = id;
        js.src = '//connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}

function handleFbLoginState(status: fb.StatusResponse, callback: Callback<LoginState>) {
    if (status.status === 'connected') {
        callback({
            state: 'logged',
            token: status.authResponse.accessToken,
        });
        globalThis.FB.api('/me', { fields: 'picture,first_name' }, response => {
            const anyResp = response as any;
            const picUrl = anyResp.picture
                && anyResp.picture.data
                && anyResp.picture.data.url;
            if (anyResp.first_name) {
                callback({
                    state: 'logged',
                    name: anyResp.first_name,
                    token: status.authResponse.accessToken,
                    picture: picUrl,
                });
            }
        });
    } else {
        callback({ state: 'not-logged' });
    }
}

function getLoginStatus(callback: Callback<LoginState>) {
    if (globalThis.FB) {
        globalThis.FB.getLoginStatus(status => {
            handleFbLoginState(status, callback);
        });
    } else {
        setTimeout(() => getLoginStatus(callback), 1000);
    }
}
