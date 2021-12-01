import { Xui, SignalsDispatcher } from '../../src/index.js';

window.Signals = new SignalsDispatcher();

const App = new Xui();

App.init(document.body);
