# Web Game Project

## Implemented Features

*   Basic project structure using Vite, Vue 3, and TypeScript.
*   Minimal dependencies for simplicity.

## Table of Contents
*   `src/`:
    *   `main.ts`: The main TypeScript file that initializes and mounts the Vue application.
    *   `App.vue`: The root Vue component of the application.
    *   `style.css`: Basic global styles for the application. 
*   `reference code/`: files from another project that may be useful as a reference
    *   `logic/model/state/Stat.ts` and `logic/model/state/Stats.ts`: Contain an abstract system for managing numerical game values ("stats").
        *   **Stats:** Can be independent (base values) or derived (calculated).
        *   **Derived Types:** Include `Parameter` (calculated via addition/multiplication from other stats) and `FormulaStat` (calculated via a specific formula and an input argument).
        *   **Connections:** A system links stats. Changes to one stat can automatically propagate to others based on connection types (ADD, MULTIPLY, SUBTRACT, FORMULA). This allows for complex interdependencies.
    *   `logic/lib/` and `logic/lib/json/`: Contain a system for loading game entity definitions (like events, buildings, etc.) from external JSON files.
        *   **Structure:** `*Lib.ts` files define the TypeScript structure for entities.
        *   **Data:** JSON files hold the actual data (properties, values).
        *   **Loading:** `Lib.ts` likely orchestrates loading this data into usable objects.
        *   **Benefit:** Data-driven design, making content definition and modification easier.
    *   `logic/model/Events.ts`, `logic/lib/EventLib.ts`, `logic/lib/json/Events.json`: Implement a conditional event system.
        *   **Definition:** Events are defined (likely in JSON) with `conditions` (criteria based on game state) and `effects` (actions that modify game state).
        *   **Processing:** Logic checks if an event's conditions are met and, if so, applies its effects.
        *   **Purpose:** Allows scripting game progression, tutorials, reactions, etc., based on rules.