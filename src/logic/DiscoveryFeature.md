# Discovery Feature

## Overview

The Discovery system is an exploration and deduction mechanic where players uncover game concepts by typing related words rather than just clicking on them in lists. Players interact with an input field in the "Discover" tab, and the system intelligently processes their input to reveal game content.

## Discovery Methods

### 1. Direct Discovery
When a player types the exact name of a skill, building, or other game item (e.g., "Melee Combat"), that item is immediately discovered. A message appears in the discovery log, and the player gains experience points based on the item type.

### 2. Keyword Discovery
If a player types a single word that is a "keyword" associated with one or more undiscovered items (e.g., "sword" for "Melee Combat"), that word is added to the **Active Keywords** list in the UI.

- **Active Keywords** are displayed as colored badges in the discovery panel, showing the keyword and count of related undiscovered items
- **Keyword Badges**: Undiscovered skills and specializations display numbered badges corresponding to the number of Active Keywords that relate to them
- Badge colors progress from muted browns (1-4 keywords) to vivid orange (5 keywords) to bright yellow (6+ keywords) for visual feedback
- Keywords automatically hide their header when the "Keywords Overflow" discovery is triggered (at 50+ active keywords, awarding 5 XP with a special congratulatory message)

### 3. Brainstorm Discovery
When an item accumulates enough related keywords (configurable threshold, default 7), it is automatically discovered through "brainstorming". The discovery log shows a special message indicating the keywords that led to the discovery, and awards XP based on the item type.

An information icon appears next to brainstorm discoveries, showing the specific keywords that triggered the discovery when hovered.

### 4. Cascading Discovery
**Key Feature**: When any item is discovered (direct or brainstorm), the system recursively analyzes that item's name as if the player had typed it. This creates cascading discovery chains where one discovery can trigger multiple additional discoveries in a single attempt.

### 5. Chain XP Bonus
When multiple discoveries occur in a single attempt, players receive bonus "chain XP" calculated using triangular numbers:
- 2 discoveries: 1 bonus XP
- 3 discoveries: 3 bonus XP  
- 4 discoveries: 6 bonus XP
- And so on...

### 6. Inspiration System
The discovery system powers an inspiration mechanic that rewards keyword exploration:

**Inspiration Gain**: Players gain 1 inspiration point for each keyword discovered (both active and discarded keywords)

**Inspiration Leveling**: 
- `inspirationMax = 10 * inspirationLevel` (configurable via `C.INSPIRATION_MAX_PER_LEVEL`)
- When `inspiration >= inspirationMax`, the system automatically:
  - Deducts `inspirationMax` from current inspiration
  - Increases `inspirationLevel` by 1
  - Grants 1 `inspirationCharge`

**Stats**:
- `inspiration`: Current inspiration points (IndependentStat)
- `inspirationLevel`: Current inspiration level, starts at 1 (IndependentStat)  
- `inspirationCharges`: Accumulated charges from level-ups (IndependentStat)
- `inspirationMax`: Dynamic maximum based on level (Parameter)

## User Interface

### Layout
The Discover tab features a two-panel layout:

**Left Panel - Skill Browser:**
- Grid view of skills and specializations
- Shows obfuscated names for undiscovered items
- Displays keyword badges (numbered, color-coded) for undiscovered items
- Shows relation badges indicating character mastery and task relevance
- Filterable by discovery status and character ownership
- Initially hidden behind "Contemplate skills and specialization" discovery button

**Right Panel - Discovery Interface:**
- **Active Keywords**: Compact badge display showing found keywords and their related item counts
- **Discovery Log**: Recent discovery attempts and their results, with inline XP rewards displayed next to successful discoveries
- **Discovery Input**: Text field for entering discovery attempts
- Initially hidden behind "Talk to inner cosmos" discovery button

### Visual Feedback
- **Keyword Progression**: Badge colors indicate proximity to brainstorm discovery (brown → orange → yellow)
- **Text Obfuscation**: Undiscovered item names become clearer as more keywords are found
- **Real-time Updates**: All displays update immediately when discoveries are made
- **Tooltips**: Hover information for character/task relationships

### Progressive Disclosure
The interface itself uses the discovery system - players must discover UI elements before they become available, creating a guided introduction to the system.

## System Architecture

The discovery system is built with stateless modules and centralized state management:

### Core Modules

**`DiscoveryLib.ts`**
- Single source of truth for all discoverable items
- Aggregates data from SkillLib, AttributeLib, BuildingLib
- Creates efficient lookup indexes by ID and searchable name
- Manages keyword-to-item relationships
- Provides `getSearchableName()` utility for consistent text cleaning

**`DiscoveryTextwork.ts`**
- Stateless input analysis module
- Takes player input and returns structured `DiscoveryAction` arrays
- Handles different input lengths (1-3 words) with different strategies
- Performs both direct name matching and keyword searches

**`Discovery.ts`**
- Central hub for all discovery-related state changes
- Implements recursive discovery with cascading analysis
- Filters results to hide errors when successes occur
- Manages the single discovery attempt logging system
- Calculates and awards individual discovery XP and chain XP bonuses

### Data Flow

1. Player enters text in DiscoverView
2. Input goes through queue-based analysis with duplicate prevention
3. Each discovery triggers re-analysis of the discovered item's name
4. All results are accumulated and filtered
5. Individual discovery XP is calculated and awarded based on item type and discovery method
6. Chain XP bonuses are calculated for multiple discoveries in one attempt
7. Error messages are not shown if there is at least once success in the attempt
8. Final filtered results are logged as a single discovery attempt with the current game tick for unique identification

## State Management

**GameState** holds all discovery-related state:
- `discoveredItems: Set<string>` - All discovered item IDs
- `encounteredItems: Set<string>` - All items the player has encountered
- `activeKeywords: Map<string, string[]>` - Active keywords and their related items
- `discardedKeywords: Set<string>` - Keywords no longer useful
- `discoveryAnalysisLog: DiscoveryAttempt[]` - Log of discovery attempts with tick timestamps
- `discoveryThreshold: Stat` - Keyword threshold for brainstorm discovery
- `inspiration: IndependentStat` - Current inspiration points
- `inspirationLevel: IndependentStat` - Current inspiration level
- `inspirationCharges: IndependentStat` - Accumulated inspiration charges
- `inspirationMax: Parameter` - Dynamic maximum inspiration based on level

## Input Processing Rules

**Single Word Input:**
- Performs both direct name search and keyword search
- Results are combined, with direct discoveries prioritized

**Two-Word Input:**
- Performs direct name search on the full phrase
- Performs direct name search on each individual word
- Performs keyword search on each individual word
- Results are combined, with direct discoveries prioritized

**Three-Word Input:**
- Performs direct name search on the full phrase
- Performs direct name search on each individual word
- Performs keyword search on each individual word
- Results are combined, with direct discoveries prioritized

**More than Three Words:**
- Returns user-friendly error with word count for UI display

## Result Filtering

The system implements intelligent result filtering:
- If ANY part of a discovery chain succeeds, error messages are filtered out
- Players only see successful discoveries and useful information
- Error messages only appear when the entire attempt fails
- This prevents confusing mixed success/failure messages

## Keyword State Management

Keywords automatically transition between states:
- **Active**: Keywords that relate to undiscovered items
- **Discarded**: Keywords where all related items are discovered
- When items are discovered, keywords are re-evaluated and moved to appropriate states
- UI automatically updates to reflect current keyword states

## Text Normalization

All input and item names go through consistent cleaning via `DiscoveryLib.getSearchableName()`:
- Convert to lowercase
- Replace " and " with single space
- Remove ampersands (&)
- Replace hyphens with spaces
- Normalize multiple spaces to single spaces
- Trim whitespace

This ensures consistent matching between player input and game content.


### XP Display
- Individual XP rewards appear inline next to each discovery in the log
- Chain XP bonuses are displayed separately to the left of discovery groups
- All XP is awarded to the first character in the player's crew
- No XP is awarded for bulk discovery commands (debug functions)

## Safety Features

- **Duplicate Prevention**: Uses a queue-based system with processed input tracking to prevent infinite loops
- **Items Discovery Protection**: Items can only be discovered once
- **Error Recovery**: Graceful handling of malformed data or unexpected states
- **Input Validation**: Proper handling of empty, invalid, or oversized input
- **Animation Stability**: Tick-based keys prevent unwanted re-animation of existing log entries