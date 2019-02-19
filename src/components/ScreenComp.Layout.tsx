import { Comp, comp, VoidCallback, relative } from './comp-utils';
import { Row, TopPanel, Column, ClickResponder, ReactContent } from './Atoms';
import { Label, LinkButton } from './Elements';
import { navigateToLibrary } from '../logic/historyNavigation.platform';



export const BookScreenLayout: Comp<{ showControls: boolean, onContentClick: VoidCallback }> = (props =>
    <ScreenLayout
        header={props.showControls ? <Header><BackButton /></Header> : null}
        onContentClick={() => props.onContentClick()}
        >
        <Row style={{
            alignItems: 'center',
            maxWidth: relative(50),
            margin: relative(2), marginTop: relative(5),
        }}
        >
            {props.children}
        </Row>
    </ScreenLayout>
);

const Header: Comp<{ title?: string, right?: ReactContent }> = (props =>
    <TopPanel>
        <Row style={{
            width: '100%', height: relative(5),
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: relative(1),
            backgroundColor: 'black',
        }}>
            {/* Left */}
            <Row>{props.children}</Row>
            {/* Center */}
            <Row>{props.title !== undefined ? <Label text={props.title} /> : undefined}</Row>
            {/* Right */}
            <Row>{props.right}</Row>
        </Row>
    </TopPanel>

);

const BackButton = comp(props =>
    <LinkButton text='< Back' onClick={() => {
        navigateToLibrary();
    }} />
);

const ScreenLayout: Comp<{
    header?: ReactContent,
    onContentClick?: VoidCallback,
}> = (props =>
    <Column style={{ width: '100%', alignItems: 'center' }}>
        {props.header || null}
        <ClickResponder onClick={props.onContentClick}>
            {props.children}
        </ClickResponder>
    </Column>
    );