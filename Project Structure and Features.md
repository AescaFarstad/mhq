# Web Game Project

## Implemented Features

*   Basic project structure using Vite, Vue 3, and TypeScript.
*   Component-based UI structure:
    *   Left sidebar for resource display (`ResourceDisplay.vue`).
    *   Main content area with tabs (`CastleView.vue`, `CrewView.vue` (refactored), `QuestsView.vue`, `DebugView.vue`).
    *   Refactored `CrewView` into smaller, focused components (`crew/CharacterList.vue`, `crew/CharacterListItem.vue`, `crew/CharacterDetails.vue`, `crew/CharacterAttributes.vue`, `crew/CharacterSkills.vue`) for better maintainability.
*   Core game logic separated from UI:
    *   Central `GameState` managing resources, stats, characters, events, and game time.
    *   Reactive `uiState` within `GameState` for efficient UI updates.
    *   Stat system (`core/Stat.ts`, `core/Stats.ts`) for managing interconnected game values (independent, parameters, formulas). Classes: `Stat`, `Connections`, `Connection`, `ConnectionType`, `Parameter`, `IndependentStat`, `FormulaStat`. Namespace: `Stats`.
    *   Resource management (`core/Resource.ts`) using the stat system for current, max, and income values. Classes: `Resource`, `ResourceManager`.
    *   Character system (`Character.ts`) with static definitions (`CharacterDefinition`) and dynamic instances (`Character`) using the stat system for level, upkeep, attributes, skills, and specializations. Classes/Interfaces: `Character`, `CharacterDefinition`, `CharacterSkill`.
    *   Hierarchical attribute system (`attributes.ts`, `GameState.ts`) defining primary and secondary attributes, processing their values, and structuring them for UI display.
    *   Skill system (`skills.ts`, `SkillLib.ts`) defining skills and specializations, loading keywords from text files, and providing lookup capabilities.
        *   Keywords are defined in plain text files (`physique`, `spirit`, `mind`, `social`) for easy editing.
        *   `skillKeywordsLoader.ts` uses Vite's `?raw` import to embed keyword file content.
        *   `keywordParser.ts` parses the raw keyword strings.
        *   `SkillLib.ts` merges base skill data with keywords and creates a reverse keyword lookup map.
        *   Character skills and specializations are implemented as `IndependentStat` objects in `Character.ts`.
    *   Event system (`events/`) with definitions (`EventDefinition`, `Condition`, `Effect`) loaded from TypeScript files and processing logic (`EventProcessor`) to trigger effects based on conditions. Classes/Interfaces: `EventProcessor`, `EventDefinition`, `Condition`, `Effect`, parameter interfaces (e.g., `ModifyResourceParams`).
    *   Type-safe data management using TypeScript files instead of JSON for game data (`data/attributes.ts`, `data/characters.ts`, `data/events.ts`, `data/skills.ts`), providing compile-time validation and IDE support.
    *   Data loading (`lib/Lib.ts`, `lib/CharacterLib.ts`, `lib/AttributeLib.ts`, `lib/SkillLib.ts`) from typed TypeScript files (`data/`) for events, characters, attributes, and skills. Classes: `Lib`, `CharacterLib`, `AttributeLib`, `SkillLib`.
    *   Shared UI type definitions (`types/uiTypes.ts`) for consistent data structures in components.

## Project Structure

*   **`src/`**: Main application source code.
    *   `main.ts`: Entry point, initializes and mounts the Vue application.
    *   `App.vue`: The root Vue component, orchestrating the main layout (sidebar, tabs, etc.). Uses `GameState`.
    *   `style.css`: Global CSS styles.
    *   `vite-env.d.ts`: TypeScript declarations for Vite-specific features (e.g., `?raw` imports).
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
            *   `CharacterDetails.vue`: Displays detailed information for the selected character, using `CharacterAttributes` and `CharacterSkills`.
            *   `CharacterAttributes.vue`: Displays the hierarchical attributes of a character.
            *   `CharacterSkills.vue`: Displays a character's skills and specializations in a vertical list.
    *   **`logic/`**: Core game logic (TypeScript classes, independent of Vue).
        *   `GameState.ts`: Central class holding and managing the entire game state (resources via `ResourceManager`, stats via `Connections`, characters, event processing via `EventProcessor`, data via `Lib`, game time). Provides reactive `uiState` for the Vue components. Handles the main `update` loop.
        *   `EventProcessor.ts`: Checks `EventDefinition` conditions against `GameState` and applies effects if met.
        *   `Resource.ts`: Represents a game resource (e.g., gold) using `IndependentStat` (current amount) and `Parameter` (max, income). Includes `ResourceManager`.
        *   `Character.ts`: Represents an active character instance with level, upkeep, attributes, skills, and specializations as `IndependentStat` objects.
        *   `UIStateManager.ts`: Manages UI state updates from the game state to the reactive UI objects.
        *   **`core/`**: Foundational systems.
            *   `Stat.ts`: Definitions for `Stat`, `Connections`, `Connection`, `ConnectionType`, `Parameter`, `IndependentStat`, `FormulaStat`.
            *   `Stats.ts`: Utility functions for creating and managing `Stat` objects within `Connections`.
        *   **`lib/`**: Data loading and management.
            *   `Lib.ts`: Main class responsible for loading game data (events, characters, attributes, skills) from TypeScript files in the `data/` directory using specific libs (`CharacterLib`, `AttributeLib`, `SkillLib`). Provides access methods.
            *   `CharacterLib.ts`: Handles loading and accessing `CharacterDefinition` data with strong typing.
            *   `AttributeLib.ts`: Handles loading and accessing attribute definitions and structures from `attributes.ts`.
            *   `SkillLib.ts`: Handles loading base skill data, merging with keywords loaded via `skillKeywordsLoader`, and creating a keyword lookup map.
            *   **`definitions/`**: TypeScript interfaces defining the structure of data loaded from data files.
                *   `LibDefinitions.ts`: Basic type definitions (e.g., `LibItem`).
                *   `CharacterDefinition.ts`: Structure for character blueprints, including `initialSkills` with nested specializations.
                *   `AttributeDefinition.ts`: Structure for attribute definitions.
                *   `SkillDefinition.ts`: Structure for skills and specializations, including the optional `keywords` field.
                *   `EventDefinition.ts`: Structure for events, conditions, effects, and parameters.
        *   **`data/`**: Contains game data files (TypeScript or other formats).
            *   `events.ts`: Definitions for game events with proper type annotations.
            *   `characters.ts`: Definitions for character types, including initial attributes, skills, and specializations.
            *   `attributes.ts`: Definitions for hierarchical attributes (display name, description, secondary attributes).
            *   `skills.ts`: Definitions for base skills and specializations (without keywords).
            *   `skillKeywordsLoader.ts`: Loads raw keyword file content using Vite's `?raw` imports and uses `keywordParser` to prepare data for `SkillLib`.
            *   `physique`: Plain text file containing keywords for Physique skills/specializations.
            *   `spirit`: Plain text file containing keywords for Spirit skills/specializations.
            *   `mind`: Plain text file containing keywords for Mind skills/specializations.
            *   `social`: Plain text file containing keywords for Social skills/specializations.
        *   **`utils/`**: General utility functions.
            *   `keywordParser.ts`: Contains the `parseKeywordsFromString` function for processing raw keyword file content.
    *   **`types/`**: Contains shared TypeScript type definitions.
        *   `uiTypes.ts`: Defines interfaces for common UI data structures (e.g., `SimpleCharacterInfo`, `AttributeCategoryUIInfo`, `SkillUIInfo`, `SkillSpecializationUIInfo`) used across components.

## Reference Code Details
*   **Stats System (`src/logic/core/`):** Manages numerical values (`Stat`, `IndependentStat`, `Parameter`, `FormulaStat`) with automatic propagation of changes through connections (`Connections`, `ConnectionType`). Utility functions in `Stats` namespace. Used for resources, character level/upkeep, attributes, skills, and specializations.
*   **Data Loading System (`src/logic/lib/`, `src/logic/data/`):** `Lib.ts` loads game entity definitions (`EventDefinition`, `CharacterDefinition`, `AttributeDefinition`, base `Skill` data) from typed TypeScript files into corresponding structures defined in `src/logic/lib/definitions/`, enabling a type-safe, data-driven approach with compile-time checking. Skill keywords are loaded separately via `skillKeywordsLoader.ts` and merged within `SkillLib.ts`.
*   **Event System (`src/logic/EventProcessor.ts`, `src/logic/lib/definitions/EventDefinition.ts`):** `EventDefinition.ts` defines events with conditions and effects. `EventProcessor.ts` checks conditions against `GameState` and applies effects for scripted game progression/reactions.
*   **Attribute System (`src/logic/data/attributes.ts`, `src/logic/lib/AttributeLib.ts`, `src/logic/lib/definitions/AttributeDefinition.ts`, `src/logic/GameState.ts`):** Defines hierarchical attributes in TypeScript. `AttributeLib` loads this data using structures from `AttributeDefinition.ts`. `GameState` processes character stats against these definitions to create structured UI data (defined in `src/types/uiTypes.ts` as `AttributeUIInfo`, `AttributeCategoryUIInfo`) used by components within `src/components/crew/`. Note: Character attributes are created as `IndependentStat` objects in `Character.ts` based on `initialAttributes` from `characters.ts` and processed by `GameState` for hierarchical UI display.
*   **Skill System (`src/logic/data/skills.ts`, `src/logic/lib/SkillLib.ts`, `src/logic/lib/definitions/SkillDefinition.ts`, `src/logic/data/*keywords*.ts`):** Base skills/specializations defined in `skills.ts`. Keywords defined in separate text files (`physique`, `spirit`, `mind`, `social`) are loaded via `skillKeywordsLoader.ts` (using Vite `?raw`) and parsed by `keywordParser.ts`. `SkillLib.ts` merges base skills with keywords and creates a reverse keyword lookup map. `SkillDefinition.ts` includes the optional `keywords` array. Characters have skills and specializations implemented as `IndependentStat` objects in `Character.ts` with a nested structure in the `CharacterDefinition` for better organization, where each skill contains its level and related specializations.
*   **Character Skills Implementation (`src/logic/Character.ts`, `src/logic/lib/definitions/CharacterDefinition.ts`):** Character skills and specializations use a convenient nested structure where each character skill is represented by a `CharacterSkill` object containing a level and optional specializations. This data is loaded from `characters.ts` and converted into `IndependentStat` objects for runtime manipulation. UI components display these skills in a vertical list format with indented specializations.