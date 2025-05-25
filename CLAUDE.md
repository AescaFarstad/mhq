# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production (runs TypeScript check then Vite build)
- `tsc` - Run TypeScript type checking

## Core Architecture

This is a web-based game built with Vue 3, TypeScript, and Vite. The architecture separates game logic from UI through a reactive state management system.

### Key Systems

**GameState (`src/logic/GameState.ts`)**
- Central state manager that coordinates all game systems
- Provides reactive `uiState` object that Vue components observe
- Manages the main game loop and input processing
- Injected into Vue app via `provide/inject` pattern

**Stats System (`src/logic/core/`)**
- `Stat`, `IndependentStat`, `Parameter`, `FormulaStat` classes for managing interconnected numerical values
- `Connections` manages automatic propagation of stat changes
- Used for resources, character attributes, skills, and all game values

**Data Loading (`src/logic/lib/`, `src/logic/data/`)**
- Type-safe data definitions in TypeScript files (not JSON)
- `Lib` class loads from `data/` directory using specialized loaders (`CharacterLib`, `AttributeLib`, `SkillLib`)
- All game data has compile-time type checking

**Character System (`src/logic/Character.ts`)**
- Characters use nested skill structure with specializations
- All character values (level, attributes, skills) are `IndependentStat` objects
- Character definitions loaded from `data/characters.ts`

**Skill Keywords**
- Base skills defined in `data/skills.ts`
- Keywords loaded from plain text files (`data/physique`, `data/spirit`, etc.) using Vite's `?raw` imports
- `SkillLib` merges base skills with keywords and creates reverse lookup map

**Input System (`src/logic/input/`)**
- Commands are `CmdInput` objects pushed to `globalInputQueue` array
- `InputProcessor` processes queue each game tick
- Command handlers are mapped by name in `handlersByName`

### Component Structure

**Main Layout (`src/App.vue`)**
- Left sidebar for resources, main area with tabs
- Injects `gameState` and provides to child components

**Tab Components (`src/components/tabs/`)**
- Each major game section is a separate tab component
- `CrewView` demonstrates the modular component pattern

**Crew Components (`src/components/crew/`)**
- Modular components: `CharacterList`, `CharacterDetails`, `CharacterAttributes`, `CharacterSkills`
- Use UI type definitions from `types/uiTypes.ts`

### Atlas System

**AtlasManager (`src/utils/AtlasManager.ts`)**
- Singleton for loading and managing texture atlases
- Loads images and JSON coordinate data
- `ImageHolder` component renders specific atlas images using canvas

### Important Patterns

- Game data is loaded synchronously in `main.ts` before Vue app starts
- UI components only read from `gameState.uiState` reactive object
- Game logic modifies core state, `UIStateManager` updates reactive UI state
- All numerical game values use the Stats system for automatic updates
- Input flows through global queue to maintain separation of concerns