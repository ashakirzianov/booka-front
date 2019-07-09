import * as React from 'react';

import { ConnectedProvider, TestProvider } from '../core';
import { TopComp } from './TopComp';

export const AppProd: React.SFC = props =>
    <ConnectedProvider><TopComp /></ConnectedProvider>;

export const AppTest: React.SFC = () =>
    <TestProvider><TopComp /></TestProvider>;

export const AppComp = AppProd;
