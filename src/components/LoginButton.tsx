import * as React from 'react';

import { TextButton, WithPopover } from './Connected';
import { Column, FacebookLogin } from '../blocks';
import { config } from '../config';

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
    return <Column>
        <FacebookLogin
            clientId={config().facebook.clientId}
            onLogin={res => {
                console.log(res);
            }}
        />
    </Column>;
}
