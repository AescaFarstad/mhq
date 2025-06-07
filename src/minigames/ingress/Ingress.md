# Ingress Minigame

The Ingress minigame is a word-based game where the player submits words to gain power, uncover potential host characters, and ultimately "possess" one of them, granting them bonuses.

## Core Gameplay

The central mechanic revolves around the player entering words into an input field. These words are then classified and processed, affecting the minigame state.

### Word Classification

*   **Useful Words**: These are predefined words that advance the game. When a new useful word is submitted, the player earns `Possession Charges` and receives a boost to their `Possession Progress`. Each useful word has a point value.
*   **Offensive Words**: These are predefined words that are thematically opposed to the player's goal. They are recorded but provide no benefit.
*   **Blank Words**: Any word that is neither useful nor offensive is considered blank. These are also recorded but have no effect.

### Possession Charges & Progress

*   **Possession Charges**: This is the primary currency of the minigame. It is earned by submitting new `Useful Words`. Charges are spent to:
    *   Reveal and purchase powerful upgrades.
    *   Explore and uncover details about potential characters.
*   **Possession Progress**: This is a bar that fills over time, representing the player's weakening of the barrier to possession. The speed is determined by the total points of all useful words found. Submitting new useful words provides a significant immediate boost to this progress. The minigame's objective is to fill this bar to 100%.

## Characters

At the start of the minigame, several potential characters for possession are available, but their identities are hidden.

### Character Discovery

Players must spend `Possession Charges` to uncover information about them in stages:
1.  **Reveal Name**: The character's name is revealed.
2.  **Reveal Portrait**: The character's portrait is shown.
3.  **Investigate**: Unlocks the final details and makes the character eligible for possession.

### Character Keywords & XP

Some `Useful Words` are linked to specific characters as keywords. When a player submits one of these words:
*   The corresponding character (if discovered) is highlighted.
*   That character gains an XP bonus, which will be applied if they are the one chosen for possession at the end.

## Upgrades

Players can spend `Possession Charges` to purchase permanent upgrades that provide significant advantages within the minigame. The upgrade tree must first be revealed by spending a small amount of charges.

Example upgrades include:
*   **Typo Tolerance**: Allows the game to accept useful words even if they have a one-character typo.
*   **Word Counter**: Shows the total number of useful words available to find.
*   **Possession Speed Boost**: Doubles the passive rate at which the `Possession Progress` bar fills.
*   **Bonus Word Points**: Increases the charge value of every useful word found.

## End of the Minigame

Once the `Possession Progress` bar reaches 100%, the player can initiate the final "possession". They choose one of the fully investigated characters and can spend their remaining `Possession Charges` on final, permanent bonuses for that character, such as:
*   Attribute points.
*   Skill or Specialization points.
*   A flat XP boost.

After the choice is made, the minigame ends.

## UI Components

*   **`IngressView.vue`**: The main container for the minigame UI.
*   **`IngressInputArea.vue`**: The text input field for word submission.
*   **`IngressWordColumns.vue`**: Displays the lists of discovered Useful and Offensive words.
*   **`PossessionChargesBar.vue`**: Shows the current `Possession Charges` and `Possession Progress`.
*   **`IngressCharacterCard.vue`**: A summary card for each available character, showing their discovery state.
*   **`IngressCharacterInspectView.vue`**: A detailed view shown when investigating a character.
*   **`IngressUpgradeView.vue`**: The interface for viewing and purchasing upgrades. 