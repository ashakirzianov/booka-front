/*global FB*/
/*global globalThis*/
import * as React from 'react';

import { Column } from '../blocks';
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

export type FacebookLoginProps = SocialButtonProps;
export function FacebookLogin({ clientId, onLogin }: FacebookLoginProps) {
    type LoginState =
        | { state: 'checking' }
        | { state: 'not-logged' }
        | { state: 'logged', response: fb.AuthResponse }
        ;
    React.useEffect(() => {
        initFbSdk(clientId);
    }, [clientId]);

    const [loginState, setLoginState] = React.useState<LoginState>({ state: 'checking' });
    const [clicked, setClicked] = React.useState(false);

    React.useEffect(() => {
        getLoginStatus(status => {
            if (status.status === 'connected') {
                setLoginState({
                    state: 'logged',
                    response: status.authResponse,
                });
            } else {
                setLoginState({ state: 'not-logged' });
            }
        });
    }, []);

    React.useEffect(() => {
        if (clicked) {
            if (loginState.state === 'logged') {
                onLogin({
                    success: true,
                    provider: 'facebook',
                    token: loginState.response.accessToken,
                });
            } else if (loginState.state === 'not-logged' && globalThis.FB) {
                globalThis.FB.login(res => {
                    if (res.status === 'connected') {
                        setLoginState({
                            state: 'logged',
                            response: res.authResponse,
                        });
                    } else {
                        onLogin({ success: false });
                    }
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
                        ? <span>Continue as {loginState.response.toString()}</span>
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

function getLoginStatus(callback: Callback<fb.StatusResponse>) {
    if (globalThis.FB) {
        globalThis.FB.getLoginStatus(callback);
    } else {
        setTimeout(() => getLoginStatus(callback), 1000);
    }
}
