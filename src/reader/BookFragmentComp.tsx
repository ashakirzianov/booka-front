import * as React from 'react';

import { BookFragment } from 'booka-common';
import { BookNodesProps, BookNodesComp, BookSelection as BS } from './BookNodesComp';

export type BookSelection = BS;
export type BookFragmentProps = Omit<BookNodesProps, 'nodes'> & {
    fragment: BookFragment,
};

export function BookFragmentComp(props: BookFragmentProps) {
    return <BookNodesComp
        {...props}
        nodes={props.fragment.nodes}
    />;
}
