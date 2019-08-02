import * as React from 'react';

import { WithPopover, TextLine, connectState, IconButton } from './Connected';
import { Column, FacebookLogin, SocialLoginResult, PictureButton } from '../blocks';
import { config } from '../config';
import { User, Theme } from '../model';
import { loginWithFbToken } from '../core/dataAccess';
import { Callback } from '../utils';

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
                <ActualButton
                    theme={theme}
                    user={user}
                    onClick={onClick}
                />
        }
    </WithPopover>;
}
export const AccountButton = connectState('user')(AccountButtonC);

type ActualButtonProps = {
    theme: Theme,
    user?: User,
    onClick: Callback<void>,
};
function ActualButton({ theme, user, onClick }: ActualButtonProps) {
    if (user) {
        return <PictureButton
            theme={theme}
            pictureUrl={user.profilePictureUrl}
            onClick={onClick}
        />;
    } else {
        return <IconButton
            icon='sign-in'
            onClick={onClick}
        />;
    }
}

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
