# FirstStepsView UI Documentation

This document explains the functionality and architecture of the `FirstStepsView.vue` component, which serves as the user interface for the "First Steps" introductory minigame.

## 1. Overview

The `FirstStepsView` is designed to render a branching, exploratory dialog experience. Unlike a simple linear dialog, it presents the player with several parallel "sub-paths" that can be explored. The UI is visually organized to reflect this structure.

## 2. UI Layout

The interface is divided into two main sections:

1.  **Main Dialog Thread**: A container at the top of the view (`initial-node`) that holds the initial, linear sequence of dialog nodes. This is where the story begins and progresses until the first branches appear.
2.  **Level-Gated Branches**: A 3-column grid area below the main thread. This area is reserved for the optional, parallel dialog paths. Each branch, once activated, populates its own container within this grid, keeping it visually separate from the main thread and other branches.

## 3. Core Concepts & Logic

The component's script is responsible for transforming a flat list of dialog nodes (defined in `firstStepsDialog.ts`) into a structured, branching tree that the template can render correctly.

### Key Computed Properties:

-   `activeNodes`: An array of all dialog nodes that are currently active in the game state. This is the raw data received from the game logic.

-   `dialogTree`: This is the most critical piece of logic. It processes the entire list of dialog nodes from `firstStepsDialogRaw` and builds a complete tree structure.

### Rendering Logic:

-   The **Main Thread** area iterates over `mainThreadNodes` and renders each one using the `FirstStepsNodeView` component.
-   The template then iterates through the `levelGated` branches from the `dialogTree`. For each branch:
  -   It uses `getGridPosition` to place a container in the correct grid cell.
  -   The root node of the branch if not yet active, still has its designated space.
  -   All subsequent *active* nodes within that branch's subtree are then rendered inside the same container, ensuring the entire branch is visually grouped together.

## 4. Component Interaction (`FirstStepsNodeView.vue`)

-   **Displaying Choices**: When a node with choices is rendered, it displays a list of buttons.
-   **Visual Feedback**: Once a choice has been made (i.e., its ID appears in the `choicesMade` prop), the list of buttons is hidden. It is replaced by a single, non-interactive label showing the text of the choice that was selected.