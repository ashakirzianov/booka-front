import * as React from 'react';

import { WithPopover, TextLine, connectState, IconButton, TagButton } from './Connected';
import {
    Column, FacebookLogin, SocialLoginResult, PictureButton, Row, point,
} from '../blocks';
import { config } from '../config';
import { User, Theme } from '../model';
import { loginWithFbToken, logout } from '../core/dataAccess';
import { Callback } from '../utils';

export type AccountButtonProps = {
    theme: Theme,
    user?: User,
};
function AccountButtonC({ user, theme }: AccountButtonProps) {
    return <WithPopover
        popoverPlacement='bottom'
        body={
            user
                ? <AccountPanel user={user} />
                : ({ scheduleUpdate }) =>
                    <SignInPanel onStatusChanged={scheduleUpdate} />
        }
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
    user: User,
};
function AccountPanel({ user }: AccountPanelProps) {
    return <Column>
        <Row margin={point(1)} centered>
            <TextLine text={user.name} fontSize='small' />
        </Row>
        <Row margin={point(1)} centered>
            <TagButton text='Logout' onClick={() => logout()} />
        </Row>
    </Column>;
}

type SignInPanelProps = {
    onStatusChanged?: Callback,
};
function SignInPanel({ onStatusChanged }: SignInPanelProps) {
    async function onLogin(res: SocialLoginResult) {
        if (res.success) {
            if (res.provider === 'facebook') {
                loginWithFbToken(res.token);
            }
        }
    }

    return <Column>
        <FacebookLogin
            onStatusChange={onStatusChanged}
            clientId={config().facebook.clientId}
            onLogin={onLogin}
        />
    </Column>;
}
