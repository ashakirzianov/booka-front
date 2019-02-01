import * as React from "react";
import { View } from 'react-native';
import { TopComp } from './TopComp';

export class AppComp extends React.Component {
    public render() {
        return <View><TopComp /></View>;
    }
}
