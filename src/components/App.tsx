import * as React from 'react';

import { hot } from 'react-hot-loader/root';
import { setConfig } from 'react-hot-loader';

import { ConnectedProvider, TestProvider } from '../core';
import { ConnectedTopCom } from './TopComp';
import { config } from '../config';

const Provider = config().useTestStore
    ? TestProvider
    : ConnectedProvider;

export const AppCompC: React.SFC = props =>
    <Provider><ConnectedTopCom /></Provider>;

// HACK: disable hot loader warning
setConfig({ showReactDomPatchNotification: false } as any);
export const AppComp = hot(AppCompC);
