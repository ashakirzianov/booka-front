import * as React from 'react';
import { Callback } from 'booka-common';

import {
    Column, FacebookLogin, SocialLoginResult, PictureButton, Row, point,
    WithPopover, TextLine, IconButton, TagButton,
} from '../blocks';
import { config } from '../config';
import { User, Theme } from '../model';
import { loginWithFbToken, logout } from '../core/dataAccess';

export type AccountButtonProps = {
    theme: Theme,
    user: User | undefined,
};
export function AccountButton({ user, theme }: AccountButtonProps) {
    return <WithPopover
        theme={theme}
        popoverPlacement='bottom'
        body={
            user
                ? <AccountPanel
                    theme={theme}
                    user={user}
                />
                : ({ scheduleUpdate }) =>
                    <SignInPanel onStatusChanged={scheduleUpdate} />
        }
    >
        <ActualButton
            theme={theme}
            user={user}
        />
    </WithPopover>;
}

type ActualButtonProps = {
    theme: Theme,
    user?: User,
    onClick?: Callback<void>,
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
            theme={theme}
            icon='sign-in'
            onClick={onClick}
        />;
    }
}

type AccountPanelProps = {
    theme: Theme,
    user: User,
};
function AccountPanel({ user, theme }: AccountPanelProps) {
    return <Column>
        <Row margin={point(1)} centered>
            <TextLine
                theme={theme}
                text={user.name}
                fontSize='small'
            />
        </Row>
        <Row margin={point(1)} centered>
            <TagButton
                theme={theme}
                text='Logout'
                onClick={() => logout()}
            />
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
