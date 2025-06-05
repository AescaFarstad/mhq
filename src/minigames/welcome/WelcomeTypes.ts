import type { MinigameState, MinigameType } from '../../logic/minigames/MinigameTypes';
import type { WelcomeLib } from "./lib/WelcomeLib";
import type { WelcomeLocationDefinition } from './lib/definitions/WelcomeLocationDefinition';

export const WELCOME_TYPE: MinigameType = 'Welcome';

export const EXPLORATION_RATE = 0.57; // Progress per second
export const THRESHOLD_DESCRIPTION_OBFUSCATED_REVEAL = 0.4;
export const THRESHOLD_PROS_CONS_TITLES_REVEAL = 0.5;
// Thresholds for individual pros/cons will be dynamic
export const THRESHOLD_DESCRIPTION_REVEAL = 0.9;
export const THRESHOLD_SELECTABLE = 1.0;

export interface WelcomeState extends MinigameState {
    lib: WelcomeLib;
    selectedLocation?: WelcomeLocationDefinition;
    explorableChoices: ExplorableWelcomeChoice[];
    lastSelectedLocationId?: string;
}

export interface WelcomeChoice {
  id: string;
  name: string;
  imageName: string;
  atlasName?: string;
  pros: string[];
  cons: string[];
  description?: string; // Optional: for more details if needed later
}

export interface ExplorableWelcomeChoice extends WelcomeChoice {
  explorationProgress: number; // 0 to 1
  isExploring: boolean;
  totalExplorationSteps: number; // Total steps to reveal everything
  currentExplorationStep: number; // Current step achieved
  nameObfuscationPercentage: number; // 0 to 1, where 1 is fully obfuscated
  isDescriptionVisible: boolean;
  descriptionObfuscationPercentage: number; // 0 to 1, where 1 is fully obfuscated
  areProsConsTitlesVisible: boolean;
  revealedProsCount: number;
  revealedConsCount: number;
  canBeSelected: boolean;
}