import { buildConnectRedux } from '../redux';
import { actionsTemplate, App } from "../model";

export const connect = buildConnectRedux<App, typeof actionsTemplate>(actionsTemplate);
