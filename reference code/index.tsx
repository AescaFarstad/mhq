
import './lib/css/bootstrap-hero-3.css';
import './lib/css/leaflet.css';
import './css.css';

import * as React from 'react';
import { Ref } from 'react';
import * as ReactDOM from 'react-dom';

import { RootView } from './cmp/RootView';
import { ManualUpdater } from './cview/Manual';
import { RC } from './Global';
import { Game } from './logic/Game';
import { Locale } from './logic/lib/Locale';
import registerServiceWorker from './registerServiceWorker';



let game = new Game();
game.init();
//console.log(JSON.stringify(game.lib));

let rootView = React.createRef<RootView>();

RC.state = game.state;
RC.lib = game.lib;
RC.input = game;
RC.locale = new Locale();
RC.manual = new ManualUpdater();

window.requestAnimationFrame(mainLoop);

function mainLoop(stamp:number) 
{
    game.update(new Date().getTime());
    RC.locale.currentLocale = game.state.ui.locale;
    if (rootView)
        rootView.current.update(game.state);
    RC.manual.update(game.state);
    requestAnimationFrame(mainLoop);
}


ReactDOM.render(
    <RootView ref={rootView}/>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();