import { ManualUpdater } from './cview/Manual';
import { IInput } from './logic/input/Input';
import { Lib } from './logic/lib/Lib';
import { Locale } from './logic/lib/Locale';
import { State } from './logic/model/state/State';

class RenderContext
{
    state:State;
    lib:Lib;
    input:IInput;
    locale:Locale;
    manual:ManualUpdater;

}
export const RC:RenderContext = new RenderContext();