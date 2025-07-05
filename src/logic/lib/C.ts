/**
 * C contains game-wide constants and configuration values.
 * This is a flat class with static constants for easy access.
 */
export class C {
    // === UI Constants ===
    public static readonly ALL_TAB_IDS = ['Castle', 'Crew', 'Quests', 'Tasks', 'Discover', 'Debug'];
    
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


    public static readonly DISCOVERY_THRESHOLD = 7;
    
    // === Inspiration System Constants ===
    public static readonly INSPIRATION_MAX_PER_LEVEL = 10;
    public static readonly INSPIRATION_CHOICE_RAREST_COUNT = 7;
    public static readonly INSPIRATION_CHOICE_JUICY_COUNT = 5;
    public static readonly INSPIRATION_CHOICE_RANDOM_COUNT = 12;
    
    // === Discovery XP Rewards ===
    public static readonly DISCOVERY_XP_BRAINSTORM_SPECIALIZATION = 2;
    public static readonly DISCOVERY_XP_BRAINSTORM_SKILL = 5;
    public static readonly DISCOVERY_XP_DIRECT_SPECIALIZATION = 3;
    public static readonly DISCOVERY_XP_DIRECT_SKILL = 7;
    public static readonly DISCOVERY_XP_DIRECT_ATTRIBUTE = 10;
    public static readonly DISCOVERY_XP_DIRECT_ATTRIBUTE_CATEGORY = 15;
    public static readonly DISCOVERY_XP_DIRECT_BUILDING = 12;
    public static readonly DISCOVERY_XP_KEYWORDS_OVERFLOW = 5;
    
    // === UI Discovery Identifiers ===
    public static readonly DISCOVERY_SKILL_BROWSER = 'ui_skill_browser';
    public static readonly DISCOVERY_INNER_COSMOS = 'ui_inner_cosmos';
    public static readonly DISCOVERY_CRYSTAL_BALL = 'ui_crystal_ball';
    public static readonly DISCOVERY_KEYWORDS_OVERFLOW = 'ui_keywords_overflow';
    
    // === Keyword Constants ===
    public static readonly KEYWORDS_HEADER_HIDE_THRESHOLD = 50;
    
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
    
    // === Dialog System Constants ===
    public static readonly DEFAULT_DIALOG_TREE = 'dialog';
    
    // === Debug Constants ===
    public static readonly DEBUG_EFFECTS = false;
    public static readonly BEH_LOG_VERBOSE = false;
} 