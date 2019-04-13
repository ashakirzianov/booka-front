import * as React from 'react';
import {
    BookPath, BookId, bookLocator, BookRange, BookNode,
    BookContent, bookRange, locationPath, parentPath,
    pathToString, parsePath,
} from '../model';
import {
    Comp, Callback, relative, Row, ThemedText, ScrollView,
    RefType, isPartiallyVisible, scrollToRef, LinkButton,
} from '../blocks';
import { actionCreators } from '../redux';
import {
    getSelectionRange, subscribeScroll, subscribeSelection,
    unsubscribeScroll, unsubscribeSelection, subscribeCopy,
    unsubscribeCopy,
    BookSelection,
} from './Reader.platform';
import { generateQuoteLink } from '../core/urlConversion';
import { buildNodes, buildBook, Params } from './bookRender';

type RefMap = { [k in string]?: RefType };
export type ReaderProps = {
    content: BookContent,
    pathToNavigate: BookPath | null,
    updateBookPosition: Callback<BookPath>,
    range: BookRange,
    prevPath?: BookPath,
    nextPath?: BookPath,
    id: BookId,
};
export class Reader extends React.Component<ReaderProps> {
    public refMap: RefMap = {};
    public selectedRange: BookSelection | undefined = undefined;

    public handleScroll = () => {
        const newCurrentPath = Object.entries(this.refMap)
            .reduce<BookPath | undefined>((path, [key, ref]) =>
                path || !isPartiallyVisible(ref)
                    ? path
                    : parsePath(key), undefined);
        if (newCurrentPath) {
            this.props.updateBookPosition(newCurrentPath);
        }
    }

    public handleSelection = () => {
        this.selectedRange = getSelectionRange();
    }

    public handleCopy = (e: ClipboardEvent) => {
        if (this.selectedRange && e.clipboardData) {
            e.preventDefault();
            const selectionText = buildSelection(this.selectedRange, this.props.id);
            e.clipboardData.setData('text/plain', selectionText);
        }
    }

    public scrollToCurrentPath = () => {
        const props = this.props;
        const refMap = this.refMap;
        if (props && props.pathToNavigate) {
            const refToNavigate =
                refMap[pathToString(props.pathToNavigate)]
                // TODO: find better solution
                // In case we navigate to character
                || refMap[pathToString(parentPath(props.pathToNavigate))]
                ;
            if (!scrollToRef(refToNavigate)) {
                setTimeout(this.scrollToCurrentPath.bind(this), 250);
            }
        }
    }

    public componentDidMount() {
        subscribeScroll(this.handleScroll);
        subscribeSelection(this.handleSelection);
        subscribeCopy(this.handleCopy);
        this.scrollToCurrentPath();

    }

    public componentDidUpdate() {
        this.scrollToCurrentPath();
    }

    public componentWillUnmount() {
        unsubscribeScroll(this.handleScroll);
        unsubscribeSelection(this.handleSelection);
        unsubscribeCopy(this.handleCopy);
    }

    public render() {
        const { range, prevPath, nextPath, id, content } = this.props;
        const params: Params = {
            range,
            refHandler: (ref, path) => {
                this.refMap = {
                    ...this.refMap,
                    [pathToString(path)]: ref,
                };
            },
        };
        return <ScrollView>
            {prevPath && <PathLink path={prevPath} id={id} text='Previous' />}
            <ThemedText style={{
                textAlign: 'justify',
            }}>
                {buildBook(content, params)}
            </ThemedText>
            {nextPath && <PathLink path={nextPath} id={id} text='Next' />}
        </ScrollView>;
    }
}

export const BookNodesComp: Comp<{ nodes: BookNode[] }> = (props =>
    <ThemedText>
        {
            buildNodes(props.nodes, [], {
                refHandler: () => undefined,
                range: bookRange(),
            })
        }
    </ThemedText>
);

type PathLinkProps = {
    path: BookPath,
    id: BookId,
    text: string,
};
const PathLink: Comp<PathLinkProps> = (props =>
    <Row style={{
        justifyContent: 'center',
        margin: relative(2),
    }}>
        <LinkButton action={actionCreators
            .navigateToBook(bookLocator(props.id, locationPath(props.path)))}
        >
            {props.text}
        </LinkButton>
    </Row>
);

function buildSelection(selection: BookSelection, id: BookId) {
    return `${selection.text}\n${generateQuoteLink(id, selection.range)}`;
}
