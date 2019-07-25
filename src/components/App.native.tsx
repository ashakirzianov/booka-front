import * as React from 'react';

import { ConnectedProvider } from '../core';
import { TopComp } from './TopComp';

export const AppComp: React.SFC = props =>
    <ConnectedProvider><TopComp /></ConnectedProvider>;
