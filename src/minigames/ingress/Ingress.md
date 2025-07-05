# Ingress Minigame

**Ingress** is a word-based minigame where players discover potential host characters, and ultimately "materialize" as one of them, granting them bonuses.

## Core Mechanics

### Word Submission & Classification

Players submit words, which are classified into three categories:

1. **Substantive Words**: Words that are meaningful to the divine materialization process. When a substantive word is submitted, the player earns `Aspect Points` and receives a boost to their `Materialization Progress`. Each substantive word has a point value.
2. **Offensive Words**: Words deemed offensive or inappropriate, providing no benefit.
3. **Blank Words**: Words that are neither substantive nor offensive, providing no benefit.

### Aspect Points & Progress

*   **Aspect Points**: This is the primary currency of the minigame. It is earned by submitting new `Substantive Words`. Points are spent to:
    *   Unlock and investigate potential characters for materialization.
    *   Purchase upgrades that enhance the minigame experience.
*   **Materialization Progress**: This is a bar that fills over time, representing the divine being's strengthening connection to the mortal realm. The speed is determined by the total points of all substantive words found. Submitting new substantive words provides a significant immediate boost to this progress. The minigame's objective is to reach 100% progress, which unlocks the final materialization.

### Character Discovery & Investigation

At the start of the minigame, several potential characters for materialization are available, but their identities are hidden.

Players unlock characters by earning enough `Aspect Points`, then can "envision" them to reveal their identities.

Players must spend `Aspect Points` to uncover information about them in stages:

1.  **Name**: Reveals the character's name.
2.  **Portrait**: Shows their visual appearance.
3.  **Investigate**: Unlocks the final details and makes the character eligible for materialization.

### Keyword Bonuses

*   When a player submits a word that matches a character's keywords, that character is automatically revealed (at least their name).
*   That character gains an XP bonus, which will be applied if they are the one chosen for materialization at the end.

### Upgrades

Players can spend `Aspect Points` to purchase permanent upgrades that provide significant advantages within the minigame. The upgrade tree must first be revealed by spending a small amount of points.

*   **Typo Tolerance**: Allows submitting words with minor typos.
*   **Word Counter**: Shows progress toward finding all substantive words.
*   **Materialization Speed Boost**: Doubles the passive rate at which the `Materialization Progress` bar fills.

### Final Materialization

Once the `Materialization Progress` bar reaches 100%, the player can initiate the final "materialization". They choose one of the fully investigated characters and can spend their remaining `Aspect Points` on final, permanent bonuses for that character, such as:

*   Additional XP
*   Bonus attribute points
*   Bonus skill points
*   Bonus specialization points

---

## Component Structure

The Ingress minigame consists of several Vue components:

*   **`IngressView.vue`**: The main view and orchestrator of the minigame.
*   **`AspectPointsBar.vue`**: Shows the current `Aspect Points` and `Materialization Progress`.
*   **`IngressInputArea.vue`**: The text input area where players submit words.
*   **`IngressWordColumns.vue`**: Displays the classified words in columns.
*   **`IngressCharacterCard.vue`**: Shows available characters and their discovery states.
*   **`IngressCharacterInspectView.vue`**: Detailed view for inspecting a selected character.
*   **`IngressUpgradeView.vue`**: Interface for purchasing upgrades. 