/**
 * C contains game-wide constants and configuration values.
 * This is a flat class with static constants for easy access.
 */
export class C {
    // === UI Constants ===
    static ALL_TAB_IDS = ['Castle', 'Crew', 'Quests', 'Tasks', 'Discover', 'Debug'];
    // === Character & Leveling Constants ===
    static XP_EXPONENT = 1.1;
    static BASE_LEVEL_XP = 1000; // XP needed for level 1 to 2
    // === Task System Constants ===
    static EFFORT_TO_XP_RATIO = 0.01;
    static CLUTTER_STEP = 10;
    static DEFAULT_LAST_SKILL_MULTIPLIER = 0.1;
    static MIN_EFFORT_FOR_STEP = 60;
    static TASK_STEP_RANDOMIZATION_RANGE = 0.25; // +/- 25%
    static MAX_COMPLETED_TASKS_HISTORY = 20;
    static MAX_ACTIVE_MAINTENANCE_TASKS = 20;
    static MAX_MAINTENANCE_ATTEMPTS = 5;
    // === Task Step Generation Constants ===
    static MIN_EXPECTED_TASK_EFFORT = 100;
    static MAX_EXPECTED_TASK_EFFORT = 3000;
    static MIN_TASK_STEPS_BASE = 3;
    static MAX_TASK_STEPS_BASE = 30;
    // === Game Timing Constants ===
    static DEFAULT_MIN_DELTA_TIME = 0.05;
    static MAINTENANCE_SLOW_TICK_INTERVAL = 5.0;
    static ASSIGNMENT_SLOW_TICK_INTERVAL = 1.5;
    // === Skill Multipliers for Task Speed ===
    static SKILL_MULTIPLIERS = {
        1: [1],
        2: [0.6, 0.5],
        3: [0.5, 0.5, 0.2],
        4: [0.4, 0.4, 0.3, 0.2],
    };
    // === Debug Constants ===
    static DEBUG_MODE = false;
    static LOG_LEVEL = "info";
}
