import * as React from 'react';

import { TextButton, WithPopover, TextLine, connectState } from './Connected';
import { Column, FacebookLogin, SocialLoginResult } from '../blocks';
import { config } from '../config';
import { User } from '../model';
import { loginWithFbToken } from '../core/dataAccess';

export type AccountButtonProps = {
    user?: User,
};
function AccountButtonC({ user }: AccountButtonProps) {
    return <WithPopover
        popoverPlacement='bottom'
        body={<AccountPanel user={user} />}
    >
        {
            onClick =>
                <TextButton text='Login' onClick={onClick} />
        }
    </WithPopover>;
}
export const AccountButton = connectState('user')(AccountButtonC);

type AccountPanelProps = {
    user: User | undefined,
};
function AccountPanel({ user }: AccountPanelProps) {
    if (user) {
        return <TextLine text={user.name} />;
    }

    async function onLogin(res: SocialLoginResult) {
        if (res.success) {
            if (res.provider === 'facebook') {
                loginWithFbToken(res.token);
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
