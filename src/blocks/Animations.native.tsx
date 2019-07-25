import * as React from 'react';

import { WithChildren } from './common';
import { FadeInProps } from './Animations';

export function FadeIn({ visible, children }: WithChildren<FadeInProps>) {
    return visible
        ? <>{children}</>
        : null;
}
