import * as React from 'react';

import { TextButton, WithPopover, TextLine } from './Connected';
import { Column, FacebookLogin, SocialLoginResult } from '../blocks';
import { config } from '../config';
import { singleValueStore } from '../utils';
import { fetchTokenForFb } from '../api/fetch';

export function LoginButton() {
    return <WithPopover
        popoverPlacement='bottom'
        body={<LoginOptions />}
    >
        {
            onClick =>
                <TextButton text='Login' onClick={onClick} />
        }
    </WithPopover>;
}

function LoginOptions() {
    const [token, setToken] = React.useState(tokenStore.get());
    if (token) {
        return <TextLine text={token} />;
    }

    async function onLogin(res: SocialLoginResult) {
        if (res.success) {
            if (res.provider === 'facebook') {
                const newToken = await fetchTokenForFb(res.token);
                if (newToken) {
                    tokenStore.set(newToken);
                    setToken(newToken);
                }
            }
        }
    }

    return <Column>
        <FacebookLogin
            clientId={config().facebook.clientId}
            onLogin={onLogin}
        />
    </Column>;
}

const tokenStore = singleValueStore<string>('jwt-token');
