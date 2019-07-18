import * as React from 'react';

import { Text, Link } from './Basic';
import { point } from './common';
import { RichTextProps, TextSegment, buildTextSegments } from './RichText.common';

export function RichText({ text, styles }: RichTextProps) {
    const segments = buildTextSegments(text, styles);
    const children = segments.map((seg, idx) => {
        return <TextSegmentComp
            {...seg}
            key={idx.toString()}
            refHandler={seg.refHandler}
        />;
    });

    return <>{children}</>;
}

function TextSegmentComp(props: TextSegment) {
    const text = <Text
        dropCaps={props.dropCaps}
        refHandler={props.refHandler}
        background={props.background}
        id={props.id}
        style={{
            color: props.color,
            fontSize: props.fontSize,
            fontFamily: props.fontFamily,
            fontStyle: props.italic ? 'italic' : 'normal',
            fontWeight: props.bold ? 'bold' : 'normal',
            ...(props.line && {
                textIndent: point(2),
                display: 'block',
            }),
        }}>
        {props.text}
    </Text>;

    if (props.superLink) {
        return <Link {...props.superLink}>
            {text}
        </Link>;
    } else {
        return text;
    }
}
