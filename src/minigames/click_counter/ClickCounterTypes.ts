import type { MinigameState, MinigameType } from '../../logic/minigames/MinigameTypes';

export const CLICK_COUNTER_TYPE: MinigameType = 'ClickCounter';

export interface ClickCounterState extends MinigameState {
    clickCount: number;
    clicksToWin: number;
} 