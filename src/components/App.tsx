import * as React from 'react';

import { hot } from 'react-hot-loader/root';

import { ConnectedProvider, TestProvider } from '../core';
import { TopComp } from './TopComp';

export const AppProd: React.SFC = props =>
    <ConnectedProvider><TopComp /></ConnectedProvider>;

export const AppTest: React.SFC = () =>
    <TestProvider><TopComp /></TestProvider>;

const AppCompC = AppProd;

export const AppComp = hot(AppCompC);
