/*global FB*/
/*global globalThis*/
import * as React from 'react';

import { Column } from '.';
import { Callback } from '../utils';

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
};

type LoginState =
    | { state: 'checking' }
    | { state: 'not-logged' }
    | { state: 'logged', token?: string, name?: string, picture?: string }
    ;
export type FacebookLoginProps = SocialButtonProps;
export function FacebookLogin({ clientId, onLogin }: FacebookLoginProps) {

    React.useEffect(() => {
        initFbSdk(clientId);
    }, [clientId]);

    const [loginState, setLoginState] = React.useState<LoginState>({ state: 'checking' });
    const [clicked, setClicked] = React.useState(false);

    React.useEffect(() => {
        getLoginStatus(setLoginState);
    }, []);

    React.useEffect(() => {
        if (clicked) {
            if (loginState.state === 'logged' && loginState.token) {
                onLogin({
                    success: true,
                    provider: 'facebook',
                    token: loginState.token,
                });
                setClicked(false);
            } else if (loginState.state === 'not-logged' && globalThis.FB) {
                globalThis.FB.login(res => {
                    handleFbLoginState(res, setLoginState);
                    setClicked(false);
                });
            }
        }
    }, [clicked, loginState, onLogin]);

    return <Column>
        <button
            onClick={() => setClicked(true)}
        >
            {
                loginState.state === 'checking' ? <span>Loading...</span>
                    : loginState.state === 'logged'
                        ? <span>Continue as {loginState.name}</span>
                        : <span>Sign in with facebook</span>
            }
        </button>
    </Column>;
}

function initFbSdk(clientId: string) {
    let timeout = 0;
    (window as any).fbAsyncInit = function asyncInit() {
        if (FB) {
            FB.init({
                appId: clientId,
                cookie: true,
                xfbml: true,
                version: 'v2.8',
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
