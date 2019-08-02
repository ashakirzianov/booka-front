/*global FB*/
import * as React from 'react';

import { TextButton, WithPopover } from './Connected';
import { Column } from '../blocks';

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
    React.useEffect(() => {
        const win = window as any;
        win.fbAsyncInit = function () {
            FB.init({
                appId: '335421937367699',
                cookie: true,
                xfbml: true,
                version: 'v2.8',
            });
        };

        // Load the SDK asynchronously
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
    }, []);
    return <Column>
        <button onClick={() => FB.login(res => {
            console.log(res);
        })}>Facebook</button>
    </Column>;
}
