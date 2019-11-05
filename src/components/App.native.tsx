import * as React from 'react';

import { ConnectedProvider } from '../core';
import { ConnectedTopCom } from './TopComp';

export const AppComp: React.SFC = props =>
    <ConnectedProvider><ConnectedTopCom /></ConnectedProvider>;
