import * as React from 'react';

import { TextButton, WithPopover, TextLine } from './Connected';
import { Column, FacebookLogin, SocialLoginResult } from '../blocks';
import { config } from '../config';
import { singleValueStore } from '../utils';
import { fetchTokenForFb, fetchUserInfo } from '../api/fetch';
import { User } from '../model';

export function AccountButton() {
    return <WithPopover
        popoverPlacement='bottom'
        body={<AccountPanel />}
    >
        {
            onClick =>
                <TextButton text='Login' onClick={onClick} />
        }
    </WithPopover>;
}

type AccountPanelProps = {
};
function AccountPanel(props: AccountPanelProps) {
    const [token, setToken] = React.useState(tokenStore.get());
    const [user, setUser] = React.useState<User | undefined>(undefined);
    if (user) {
        return <TextLine text={user.name} />;
    } else if (token) {
        fetchUserInfo(token)
            .then(ui => {
                if (ui) {
                    setUser({
                        name: ui.name,
                        profilePictureUrl: ui.pictureUrl,
                    });
                }
            });
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
