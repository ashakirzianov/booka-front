import * as React from 'react';
import { Comp } from './comp-utils';

type Style = React.CSSProperties;
export const Text: Comp<{ style: Style }> = props =>
    <span style={props.style}>{props.children}</span>;

export { View } from 'react-native';
export { Route, Router, Redirect, Switch, Link } from 'react-router-dom';
