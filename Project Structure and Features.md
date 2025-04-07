# Web Game Project

## Implemented Features

*   Basic project structure using Vite, Vue 3, and TypeScript.
*   Component-based UI structure:
    *   Left sidebar for resource display (`ResourceDisplay.vue`).
    *   Main content area with tabs (`CastleView.vue`, `CrewView.vue` (refactored), `QuestsView.vue`, `DebugView.vue`).
    *   Refactored `CrewView` into smaller, focused components (`crew/CharacterList.vue`, `crew/CharacterListItem.vue`, `crew/CharacterDetails.vue`, `crew/CharacterAttributes.vue`) for better maintainability.
*   Core game logic separated from UI:
    *   Central `GameState` managing resources, stats, characters, events, and game time.
    *   Reactive `uiState` within `GameState` for efficient UI updates.
    *   Stat system (`core/Stat.ts`, `core/Stats.ts`) for managing interconnected game values (independent, parameters, formulas). Classes: `Stat`, `Connections`, `Connection`, `ConnectionType`, `Parameter`, `IndependentStat`, `FormulaStat`. Namespace: `Stats`.
    *   Resource management (`core/Resource.ts`) using the stat system for current, max, and income values. Classes: `Resource`, `ResourceManager`.
    *   Character system (`characters/`) with static definitions (`CharacterDefinition`) and dynamic instances (`Character`) using the stat system for level and upkeep. Classes/Interfaces: `Character`, `CharacterDefinition`.
    *   Hierarchical attribute system (`attributes.json`, `GameState.ts`) defining primary and secondary attributes, processing their values, and structuring them for UI display.
    *   Event system (`events/`) with definitions (`EventDefinition`, `Condition`, `Effect`) loaded from JSON and processing logic (`EventProcessor`) to trigger effects based on conditions. Classes/Interfaces: `EventProcessor`, `EventDefinition`, `Condition`, `Effect`, parameter interfaces (e.g., `ModifyResourceParams`).
    *   Data loading (`lib/Lib.ts`, `lib/CharacterLib.ts`, `lib/AttributeLib.ts`) from JSON files (`data/`) for events, characters, and attributes. Classes: `Lib`, `CharacterLib`, `AttributeLib`.
    *   Shared UI type definitions (`types/uiTypes.ts`) for consistent data structures in components.

## Project Structure

*   **`src/`**: Main application source code.
    *   `main.ts`: Entry point, initializes and mounts the Vue application.
    *   `App.vue`: The root Vue component, orchestrating the main layout (sidebar, tabs, etc.). Uses `GameState`.
    *   `style.css`: Global CSS styles.
    *   **`components/`**: Reusable Vue UI components.
        *   `ResourceDisplay.vue`: Displays game resources (listens to `uiState.resources`).
        *   **`tabs/`**: Components representing the main content tabs.
            *   `CastleView.vue`: Placeholder component for the Castle tab.
            *   `CrewView.vue`: Container component for the Crew tab. Manages selection state and orchestrates child components.
            *   `QuestsView.vue`: Placeholder component for the Quests tab.
            *   `DebugView.vue`: Displays internal game stats for debugging (listens to `uiState.debugStats`).
        *   **`crew/`**: Components specific to the Crew tab UI.
            *   `CharacterList.vue`: Displays the list of available characters using `CharacterListItem`.
            *   `CharacterListItem.vue`: Renders a single character entry in the list.
            *   `CharacterDetails.vue`: Displays detailed information for the selected character, using `CharacterAttributes`.
            *   `CharacterAttributes.vue`: Displays the hierarchical attributes of a character.
    *   **`logic/`**: Core game logic (TypeScript classes, independent of Vue).
        *   `GameState.ts`:
            *   `GameState`: Central class holding and managing the entire game state (resources via `ResourceManager`, stats via `Connections`, characters, event processing via `EventProcessor`, data via `Lib`, game time). Provides reactive `uiState` (including processed character list with hierarchical attributes: `AttributeUIInfo`, `AttributeCategoryUIInfo`) for the Vue components. Handles the main `update` loop.
        *   **`core/`**: Foundational systems.
            *   `Stat.ts`:
                *   `Stat` (interface): Base for any game value.
                *   `Connections`: Manages dependencies between stats.
                *   `Connection`: Represents a link between stats.
                *   `ConnectionType` (enum): Defines how stats interact (ADD, MULTY, SUB, FORMULA).
                *   `Parameter`: Stat derived from additive/multiplicative inputs.
                *   `IndependentStat`: Stat with a directly set value.
                *   `FormulaStat`: Stat calculated via a formula.
            *   `Stats.ts`:
                *   `Stats` (namespace): Utility functions for creating and managing `Stat` objects within `Connections`.
            *   `Resource.ts`:
                *   `Resource`: Represents a game resource (e.g., gold) using `IndependentStat` (current amount) and `Parameter` (max, income).
                *   `ResourceManager`: Manages all `Resource` instances.
        *   **`characters/`**: Character-related logic.
            *   `CharacterDefinition.ts`:
                *   `CharacterDefinition` (interface): Defines the static blueprint for a character type (loaded from data).
            *   `Character.ts`:
                *   `Character`: Represents an active character instance, holding its `CharacterDefinition` and dynamic stats (`level`, `upkeep`, attributes) managed by the `Stat` system.
        *   **`events/`**: Handles game events.
            *   `EventDefinition.ts`:
                *   `EventDefinition` (interface): Structure for an event (ID, conditions, effects).
                *   `Condition` (interface): Defines a requirement for an event trigger.
                *   `Effect` (interface): Defines an action performed by an event.
                *   Parameter interfaces (e.g., `ModifyResourceParams`, `AddCharacterParams`): Define data structures for specific condition/effect parameters.
            *   `EventProcessor.ts`:
                *   `EventProcessor`: Checks `EventDefinition` conditions against `GameState` and applies effects if met.
        *   **`lib/`**: Data loading and management.
            *   `LibDefinitions.ts`: Basic type definitions for library items (e.g., `LibItem`).
            *   `CharacterLib.ts`:
                *   `CharacterLib`: Specifically handles loading and accessing `CharacterDefinition` data.
            *   `AttributeLib.ts`: 
                *   `AttributeLib`: Handles loading and accessing attribute definitions and structures from `attributes.json`.
            *   `Lib.ts`:
                *   `Lib`: Main class responsible for loading game data (events, characters, attributes) from JSON files in the `data/` directory using specific libs (`CharacterLib`, `AttributeLib`). Provides access methods (`getEvent`, `getCharacter`, `getAttributeDefinition`).
        *   **`data/`**: Contains game data files (JSON).
            *   `events.json`: Definitions for game events.
            *   `characters.json`: Definitions for character types, including initial attribute values.
            *   `attributes.json`: Definitions for hierarchical attributes (display name, description, secondary attributes).
    *   **`types/`**: Contains shared TypeScript type definitions.
        *   `uiTypes.ts`: Defines interfaces for common UI data structures (e.g., `SimpleCharacterInfo`, `AttributeCategoryUIInfo`) used across components.

## Reference Code Details
*   **Stats System (`src/logic/core/`):** Manages numerical values (`Stat`, `IndependentStat`, `Parameter`, `FormulaStat`) with automatic propagation of changes through connections (`Connections`, `ConnectionType`). Utility functions in `Stats` namespace. Used for resources, character level/upkeep, and attributes.
*   **Data Loading System (`src/logic/lib/`, `src/logic/data/`):** `Lib.ts` loads game entity definitions (`EventDefinition`, `CharacterDefinition`, Attribute Definitions) from external JSON files into corresponding TypeScript structures, enabling a data-driven approach.
*   **Event System (`src/logic/events/`):** `EventDefinition.ts` defines events with conditions and effects. `EventProcessor.ts` checks conditions against `GameState` and applies effects for scripted game progression/reactions.
*   **Attribute System (`src/logic/data/attributes.json`, `src/logic/lib/AttributeLib.ts`, `src/logic/GameState.ts`):** Defines hierarchical attributes in JSON. `AttributeLib` loads this data. `GameState` processes character stats against these definitions to create structured UI data (now defined in `src/types/uiTypes.ts` as `AttributeUIInfo`, `AttributeCategoryUIInfo`) used by components within `src/components/crew/`. Note: While attributes are defined hierarchically (primary/secondary) in `attributes.json`, they are all created as independent `IndependentStat` objects within a flat structure (`attributes: Record<string, IndependentStat>`) in the `Character` class using the initial values from `characters.json`. `GameState` then rebuilds the hierarchical structure needed for UI display in `updateCharacterUIData`.