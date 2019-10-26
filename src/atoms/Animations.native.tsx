import * as React from 'react';

import { FadeInProps } from './Animations';

export function FadeIn({ visible, children }: FadeInProps) {
    return visible
        ? <>{children}</>
        : null;
}
