import { createBrowserHistory } from "history";
import { buildConnectRedux } from '../redux';
import { actionsTemplate, App } from "../model";

export const history = createBrowserHistory();

export const connect = buildConnectRedux<App, typeof actionsTemplate>(actionsTemplate);
