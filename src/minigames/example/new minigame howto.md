# Minigame Scaffolding HOWTO

This document outlines how to create a new minigame using the provided 'Example' minigame template. The 'Example' minigame is a fully wired-up but functionally blank minigame, serving as a clean starting point.

## What 'Example' Minigame Provides

- **Functional Template**: All necessary files and basic wiring are present.
- **Boilerplate Only**: Minimal code for integration, no actual game logic.
- **Ready to Customize**: Designed to be copied and then modified for your new minigame.

## How to Create a New Minigame

### 1. Copy the 'Example' Minigame Structure
To create a new minigame, copy the entire `src/minigames/example` folder and rename it to your new minigame's name (e.g., `your_minigame_name`):

```bash
cp -r src/minigames/example src/minigames/your_minigame_name
```

### 2. Rename Files
Inside your new minigame's folder (`src/minigames/your_minigame_name/`), rename the files from `Example*` to `YourMinigameName*` (e.g., `ExampleGame.ts` to `YourMinigameNameGame.ts`):

```bash
cd src/minigames/your_minigame_name
mv ExampleGame.ts YourMinigameNameGame.ts
mv ExampleTypes.ts YourMinigameNameTypes.ts
mv ExampleView.vue YourMinigameNameView.vue
mv exampleUISync.ts yourMinigameNameUISync.ts # Note: lowercase for the sync file
```

### 3. Update File Contents
Carefully go through each of the newly renamed files and replace all occurrences of "Example" (and `EXAMPLE_TYPE`) with "YourMinigameName" (and `YOUR_MINIGAME_NAME_TYPE`).

#### **`YourMinigameNameTypes.ts`**
- Change `EXAMPLE_TYPE` to `YOUR_MINIGAME_NAME_TYPE` (e.g., `export const MYGAME_TYPE ...`).
- Update the `MinigameType` string value (e.g., `= 'MyGame';`).
- Define properties for your game in `YourMinigameNameState` interface.

#### **`YourMinigameNameGame.ts`**
- Rename the class from `ExampleGame` to `YourMinigameNameGame`.
- Update imports to use your new types (e.g., `EXAMPLE_TYPE` to `YOUR_MINIGAME_NAME_TYPE`, `ExampleState` to `YourMinigameNameState`).
- Ensure the `readonly type` property uses your new `YOUR_MINIGAME_NAME_TYPE`.
- Initialize your game's state properties in the `reactive()` call within the constructor.
- Implement your game logic in the `update()` method.
- Add any custom methods and game mechanics as needed.
- Add cleanup logic to the `destroy()` method if required.

#### **`YourMinigameNameView.vue`**
- Update all imports to reference your minigame's files (e.g., `./YourMinigameNameTypes`, `./YourMinigameNameGame`).
- Change computed properties `exampleState` and `exampleGame` to `yourMinigameNameState` and `yourMinigameNameGame`, updating types and `EXAMPLE_TYPE` checks.
- Update any placeholder text or UI elements to match your game.
- Change CSS class names (e.g., `.example-view-container` to `.your-minigame-name-view-container`) and adjust styles.

#### **`yourMinigameNameUISync.ts`**
- Rename the function from `syncExampleUI` to `syncYourMinigameNameUI`.
- Update type imports from `./ExampleTypes` to `./YourMinigameNameTypes`.
- Change `ExampleState` casts to `YourMinigameNameState`.
- Add logic to sync properties from your `YourMinigameNameState` (logic side) to the UI state.

### 4. Register Your Minigame in Core Files

#### **`src/logic/minigames/MinigameTypes.ts`**
Add your new minigame's type string to the `MinigameType` union:
```typescript
export type MinigameType = 'ClickCounter' | 'Welcome' | 'Ingress' | 'Example' | 'YourMinigameName'; // Add here
```

#### **`src/main.ts`**
Import your new UI sync function and type constant, then register the sync function:
```typescript
// ... other imports
import { syncYourMinigameNameUI } from './minigames/your_minigame_name/yourMinigameNameUISync';
import { YOUR_MINIGAME_NAME_TYPE } from './minigames/your_minigame_name/YourMinigameNameTypes';

// ... in initializeGame():
// Register Minigame UI Sync Functions
// ... other registrations
registerMinigameUISyncFunction(YOUR_MINIGAME_NAME_TYPE, syncYourMinigameNameUI);
```

#### **`src/App.vue`**
Import your view component and add it to the template's minigame overlay section:
```html
<script setup lang="ts">
// ... other imports
import YourMinigameNameView from './minigames/your_minigame_name/YourMinigameNameView.vue';
// ...
</script>

<template>
  <!-- ... existing template ... -->
    <!-- Minigame Overlay Area -->
    <!-- ... other v-if / v-else-if blocks ... -->
    <div v-else-if="activeMinigameType === 'YourMinigameName'"> <!-- Or use YOUR_MINIGAME_NAME_TYPE if imported and exposed -->
      <YourMinigameNameView />
    </div>
  <!-- ... -->
</template>
```
*(Note: To use `YOUR_MINIGAME_NAME_TYPE` constant in the template, you'd need to import it in `App.vue`'s script setup and potentially return it or make it available to the template context if not using string literal directly).*

#### **`src/logic/Event.ts`** (Optional: To start via game events)
If you want to trigger your minigame through the event system:
1.  Import your game class: `import { YourMinigameNameGame } from '../minigames/your_minigame_name/YourMinigameNameGame';`
2.  Add an `else if` case to the `startMinigame` effect in `EventProcessor.executeEffect`:
```typescript
} else if (params.name === 'YourMinigameName') { // Use the string name you'll use in event data
    const minigameInstance = new YourMinigameNameGame(`event-${params.name}-${Date.now()}`);
    state.startMinigame(minigameInstance);
    console.log(`Event 'startMinigame': Started minigame '${params.name}'.`);
```

## Key Concepts Recap

- **Reactive State (`YourMinigameNameGame.ts`):** Game state managed by `reactive()` from Vue for UI updates.
- **State Synchronization (`yourMinigameNameUISync.ts`):** Keeps logic state and UI state in sync each frame.
- **Lifecycle (`YourMinigameNameGame.ts`):** `constructor`, `update()`, `destroy()`.
- **UI (`YourMinigameNameView.vue`):** Vue component for the minigame's visual representation.
- **Type Safety (`YourMinigameNameTypes.ts`):** TypeScript interfaces for state and type constants.

This updated 'Example' template and guide should provide a more streamlined process for creating new minigames. 