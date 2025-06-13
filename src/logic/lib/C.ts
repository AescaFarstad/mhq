/**
 * C contains game-wide constants and configuration values.
 * This is a flat class with static constants for easy access.
 */
export class C {
    // === Character & Leveling Constants ===
    public static readonly XP_EXPONENT = 1.1;
    public static readonly BASE_LEVEL_XP = 1000; // XP needed for level 1 to 2
    
    // === Task System Constants ===
    public static readonly EFFORT_TO_XP_RATIO = 0.01;
    public static readonly CLUTTER_STEP = 10;
    public static readonly DEFAULT_LAST_SKILL_MULTIPLIER = 0.1;
    public static readonly MIN_EFFORT_FOR_STEP = 60;
    public static readonly TASK_STEP_RANDOMIZATION_RANGE = 0.25; // +/- 25%
    public static readonly MAX_COMPLETED_TASKS_HISTORY = 20;
    public static readonly MAX_ACTIVE_MAINTENANCE_TASKS = 20;
    public static readonly MAX_MAINTENANCE_ATTEMPTS = 5;
    
    // === Task Step Generation Constants ===
    public static readonly MIN_EXPECTED_TASK_EFFORT = 100;
    public static readonly MAX_EXPECTED_TASK_EFFORT = 3000;
    public static readonly MIN_TASK_STEPS_BASE = 3;
    public static readonly MAX_TASK_STEPS_BASE = 30;
    
    // === Game Timing Constants ===
    public static readonly DEFAULT_MIN_DELTA_TIME = 0.05;
    public static readonly MAINTENANCE_SLOW_TICK_INTERVAL = 5.0;
    public static readonly ASSIGNMENT_SLOW_TICK_INTERVAL = 1.5;
    
    // === Skill Multipliers for Task Speed ===
    public static readonly SKILL_MULTIPLIERS: { [count: number]: number[] } = {
        1: [1],
        2: [0.6, 0.5],
        3: [0.5, 0.5, 0.2],
        4: [0.4, 0.4, 0.3, 0.2],
    };
    
    // === Debug Constants ===
    public static readonly DEBUG_MODE = false;
    public static readonly LOG_LEVEL = "info";
} 