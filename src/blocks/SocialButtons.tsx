/*global FB*/
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
    React.useEffect(() => {
        initFbSdk(clientId);
    }, [clientId]);
    return <Column>
        <button
            onClick={() => FB && FB.login(res => {
                if (res.status === 'connected') {
                    onLogin({
                        success: true,
                        token: res.authResponse.accessToken,
                        provider: 'facebook',
                    });
                } else {
                    onLogin({ success: false });
                }
            })}
        >
            <span>Continue with facebook</span>
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
