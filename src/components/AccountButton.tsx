import * as React from 'react';

import { WithPopover, TextLine, connectState } from './Connected';
import { Column, FacebookLogin, SocialLoginResult, PictureButton } from '../blocks';
import { config } from '../config';
import { User, Theme } from '../model';
import { loginWithFbToken } from '../core/dataAccess';

export type AccountButtonProps = {
    theme: Theme,
    user?: User,
};
function AccountButtonC({ user, theme }: AccountButtonProps) {
    return <WithPopover
        popoverPlacement='bottom'
        body={<AccountPanel user={user} />}
    >
        {
            onClick =>
                <PictureButton
                    theme={theme}
                    pictureUrl={user && user.profilePictureUrl}
                    onClick={onClick}
                />
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
