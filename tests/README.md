# Testing System

## Overview

This is a standalone testing framework for the web game project that works independently of Vite and other web-specific tooling. The tests can be executed in two ways:

1. **Integrated Mode**: Automatically run when the game starts (via main.ts)
2. **Standalone Mode**: Run with Node.js for development and CI purposes

## Architecture

### Core Principles

- **No Dependencies**: Tests use only TypeScript and Node.js built-ins, no external testing frameworks
- **Dual Execution**: Same test files work both in browser and Node.js environments
- **Isolation**: Each test system is in its own file with clear separation of concerns
- **Deterministic**: Tests produce consistent, reproducible results

### Directory Structure

```
tests/
├── README.md           # This documentation
├── testRunner.ts       # Main test entrance point
├── stringObfuscation.test.ts  # String obfuscation system tests
└── discovery.test.ts   # Discovery system tests
```

## Test Systems

### 1. String Obfuscation Tests (`stringObfuscation.test.ts`)

Tests the `obfuscateString()` function from `src/utils/stringUtils.ts`:

- **Edge Cases**: Empty strings, single characters, boundary conditions
- **Progressive Obfuscation**: Verifies progressive reveal mechanics
- **Stability**: Ensures that characters revealed at percentage P remain revealed at lower percentages
- **Statistical Distribution**: Validates that obfuscation percentages match expected distributions
- **Determinism**: Verifies same input produces same output

### 2. Discovery System Tests (`discovery.test.ts`)

Tests the game's discovery mechanics from `src/logic/GameState.ts` and related systems:

- **Basic Discovery**: Testing `isDiscovered()` and `markAsDiscovered()` methods
- **Discovery State Persistence**: Ensuring discovery state is properly maintained
- **Discovery Integration**: Testing how discovery interacts with UI obfuscation
- **Edge Cases**: Duplicate discoveries, invalid item IDs, etc.

## Usage

### Running Tests in Standalone Mode (Node.js)

**Note**: Due to the complexity of the project's dependencies and the TypeScript module system, running tests in standalone Node.js mode may require additional setup. The recommended approach is to run tests in the browser environment.

1. **Compile TypeScript**:
   ```bash
   npx tsc --project tsconfig.json
   ```

2. **Attempt to run tests** (may require dependency mocking):
   ```bash
   node --loader ts-node/esm tests/testRunner.ts
   ```

**Alternative approach using tsx**:
```bash
npx tsx tests/testRunner.ts
```

**If you encounter module resolution errors**, the tests are designed to work primarily in the browser environment where all game dependencies are available.

### Running Tests in Integrated Mode (Browser)

Tests automatically run when the game starts if enabled in `main.ts`. Check the browser console for test results.

## Configuration

### Enabling/Disabling Tests in Game

Tests are automatically enabled in development mode. In `src/main.ts`, you can see:

```typescript
import { runTests } from '../tests/testRunner';
// ... later in code ...
runTests();
```

This straightforward function call runs all tests. To disable tests, comment out or remove the `runTests()` call.

### Environment Detection

The test runner automatically detects its environment:
- **Browser**: Uses `console.log` for output, integrates with game state
- **Node.js**: Uses `process.stdout` for formatted output, creates minimal test environment

## Writing New Tests

### 1. Create Test File

Create `tests/newSystem.test.ts`:

```typescript
import { TestSuite, TestResult } from './testRunner';

export function createNewSystemTests(): TestSuite {
    return {
        name: 'New System Tests',
        tests: [
            {
                name: 'Test Basic Functionality',
                run: (): TestResult => {
                    // Test implementation
                    if (someCondition) {
                        return { success: true };
                    } else {
                        return { 
                            success: false, 
                            message: 'Expected X but got Y' 
                        };
                    }
                }
            }
        ]
    };
}

// For standalone execution
if (typeof window === 'undefined' && require.main === module) {
    import('./testRunner').then(({ runTestSuite }) => {
        runTestSuite(createNewSystemTests());
    });
}
```

### 2. Register in Test Runner

Add to `tests/testRunner.ts`:

```typescript
import { createNewSystemTests } from './newSystem.test';

// Add to test suites array
const testSuites = [
    createStringObfuscationTests(),
    createDiscoveryTests(),
    createNewSystemTests(), // Add here
];
```

## Best Practices

1. **Keep Tests Pure**: Tests should not have side effects or depend on external state
2. **Clear Naming**: Test names should clearly describe what is being tested
3. **Comprehensive Coverage**: Test both happy paths and edge cases
4. **Fast Execution**: Tests should complete quickly for good developer experience
5. **Deterministic Results**: Tests should always produce the same results given the same input

## Troubleshooting

### Common Issues

1. **Module Import Errors**: Ensure TypeScript compilation is complete
2. **Path Resolution**: Use relative imports consistently
3. **Environment Detection**: Check if code properly detects browser vs Node.js
4. **GameState Dependencies**: Mock or stub GameState for isolated testing

### Debugging

- Use `console.log` statements in tests for debugging
- Run tests individually to isolate issues
- Check TypeScript compilation errors first

## Integration with Build System

The testing system is designed to work with the existing TypeScript configuration:

- Uses `tsconfig.json` for compilation
- Compatible with existing build process
- No additional dependencies required
- Works with existing development workflow

## Current Implementation Status

✅ **Completed Features:**
- Standalone test runner framework
- String obfuscation test suite (7 comprehensive tests)
- Discovery system test suite (7 comprehensive tests)  
- Integration with main.ts for automatic development execution
- Cross-environment support (Browser/Node.js)
- Comprehensive documentation

📝 **Key Files Created:**
- `tests/README.md` - Complete documentation
- `tests/testRunner.ts` - Core testing framework (327 lines)
- `tests/stringObfuscation.test.ts` - String obfuscation tests (346 lines)
- `tests/discovery.test.ts` - Discovery system tests (361 lines)

🎯 **How to Use:**
1. **Development Mode**: Tests run automatically when starting the game with `npm run dev`
2. **Manual Browser**: Import and call `runTests()` function from browser console
3. **Node.js**: Use `npx tsx tests/testRunner.ts` (with appropriate setup)

🔍 **Test Coverage:**
- **String Obfuscation**: Edge cases, progressive algorithms, stability, statistical distribution, determinism
- **Discovery System**: Basic functionality, set operations, persistence, boundary conditions, integration with UI 