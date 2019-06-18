import * as React from 'react';
import { Atoms, Row, Column } from './Atoms.common';
import { isOpenNewTabEvent } from './comp-utils.platform';

const atoms: Atoms = {
    Row, Column,
    Text: (props =>
        <span
            ref={props.ref}
            id={props.id}
            style={{
                wordBreak: 'break-word',
                background: props.background,
                ...(props.dropCaps && {
                    float: 'left',
                    fontSize: '400%',
                    lineHeight: '80%',
                }),
                ...props.style,
            }}
        >
            {props.children}
        </span>
    ),
    Link: (props =>
        <a
            href={props.to}
            style={{
                ...props.style,
                textDecoration: 'none',
                cursor: 'pointer',
                alignSelf: 'flex-start',
            }}
            onClick={e => {
                e.stopPropagation();
                if (!isOpenNewTabEvent(e)) {
                    e.preventDefault();
                    if (props.onClick) {
                        props.onClick();
                    }
                }
            }}
        >
            {props.children}
        </a>
    ),
};

export default atoms;
