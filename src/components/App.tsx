import * as React from 'react';

import { hot } from 'react-hot-loader/root';

import { ConnectedProvider, TestProvider } from '../core';
import { TopComp } from './TopComp';
import { config } from '../config';

const Provider = config().useTestStore
    ? TestProvider
    : ConnectedProvider;

export const AppCompC: React.SFC = props =>
    <Provider><TopComp /></Provider>;

export const AppComp = hot(AppCompC);
