/**
 * Standalone Test Runner
 * 
 * A simple, dependency-free testing framework that works in both Node.js and browser environments.
 * Designed specifically for the web game project to test core game logic without requiring
 * Vite, Vitest, or other web-specific testing tools.
 * 
 * Features:
 * - Environment detection (Node.js vs Browser)
 * - Zero external dependencies
 * - Simple assertion helpers
 * - Colored output in Node.js
 * - Integration with game systems
 */

// --- Type Definitions ---

export interface TestResult {
    success: boolean;
    message?: string;
    error?: Error;
}

export interface Test {
    name: string;
    run: () => TestResult | Promise<TestResult>;
}

export interface TestSuite {
    name: string;
    tests: Test[];
    setup?: () => void | Promise<void>;
    teardown?: () => void | Promise<void>;
}

export interface TestRunnerResults {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    suiteResults: Array<{
        suiteName: string;
        passed: number;
        failed: number;
        failures: Array<{
            testName: string;
            message: string;
        }>;
    }>;
}

// --- Environment Detection ---

declare const process: any;
declare const require: any;
declare const module: any;

const isNodeEnvironment = typeof window === 'undefined';

// --- Output Utilities ---

class TestOutput {
    private static colors = {
        reset: '\x1b[0m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        bold: '\x1b[1m',
    };

    static success(message: string): void {
        if (isNodeEnvironment) {
            console.log(`${this.colors.green}✓${this.colors.reset} ${message}`);
        } else {
            console.log(`✓ ${message}`);
        }
    }

    static failure(message: string): void {
        if (isNodeEnvironment) {
            console.log(`${this.colors.red}✗${this.colors.reset} ${message}`);
        } else {
            console.error(`✗ ${message}`);
        }
    }

    static info(message: string): void {
        if (isNodeEnvironment) {
            console.log(`${this.colors.blue}ℹ${this.colors.reset} ${message}`);
        } else {
            console.log(`ℹ ${message}`);
        }
    }

    static warning(message: string): void {
        if (isNodeEnvironment) {
            console.log(`${this.colors.yellow}⚠${this.colors.reset} ${message}`);
        } else {
            console.warn(`⚠ ${message}`);
        }
    }

    static header(message: string): void {
        if (isNodeEnvironment) {
            console.log(`\n${this.colors.bold}${this.colors.blue}${message}${this.colors.reset}`);
        } else {
            console.log(`\n${message}`);
        }
    }

    static summary(results: TestRunnerResults): void {
        const { totalTests, failedTests } = results;
        
        if (failedTests > 0) {
            TestOutput.failure(`Failed: ${failedTests}/${totalTests} tests`);
            
            // Show details of failures
            results.suiteResults.forEach(suite => {
                if (suite.failures.length > 0) {
                    TestOutput.failure(`\nFailures in ${suite.suiteName}:`);
                    suite.failures.forEach(failure => {
                        TestOutput.failure(`  - ${failure.testName}: ${failure.message}`);
                    });
                }
            });
        }
    }
}

// --- Assertion Helpers ---

export class TestAssert {
    static equals<T>(actual: T, expected: T, message?: string): TestResult {
        const isEqual = actual === expected;
        if (isEqual) {
            return { success: true };
        } else {
            return {
                success: false,
                message: message || `Expected ${expected}, but got ${actual}`
            };
        }
    }

    static notEquals<T>(actual: T, expected: T, message?: string): TestResult {
        const isNotEqual = actual !== expected;
        if (isNotEqual) {
            return { success: true };
        } else {
            return {
                success: false,
                message: message || `Expected ${actual} to not equal ${expected}`
            };
        }
    }

    static true(actual: boolean, message?: string): TestResult {
        if (actual === true) {
            return { success: true };
        } else {
            return {
                success: false,
                message: message || `Expected true, but got ${actual}`
            };
        }
    }

    static false(actual: boolean, message?: string): TestResult {
        if (actual === false) {
            return { success: true };
        } else {
            return {
                success: false,
                message: message || `Expected false, but got ${actual}`
            };
        }
    }

    static throws(fn: () => void, message?: string): TestResult {
        try {
            fn();
            return {
                success: false,
                message: message || 'Expected function to throw an error, but it did not'
            };
        } catch (error) {
            return { success: true };
        }
    }

    static doesNotThrow(fn: () => void, message?: string): TestResult {
        try {
            fn();
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: message || `Expected function not to throw, but it threw: ${error}`
            };
        }
    }

    static arrayEquals<T>(actual: T[], expected: T[], message?: string): TestResult {
        if (actual.length !== expected.length) {
            return {
                success: false,
                message: message || `Array lengths differ: expected ${expected.length}, got ${actual.length}`
            };
        }

        for (let i = 0; i < actual.length; i++) {
            if (actual[i] !== expected[i]) {
                return {
                    success: false,
                    message: message || `Arrays differ at index ${i}: expected ${expected[i]}, got ${actual[i]}`
                };
            }
        }

        return { success: true };
    }

    static approximately(actual: number, expected: number, tolerance: number = 0.001, message?: string): TestResult {
        const difference = Math.abs(actual - expected);
        if (difference <= tolerance) {
            return { success: true };
        } else {
            return {
                success: false,
                message: message || `Expected ${actual} to be approximately ${expected} (tolerance: ${tolerance}), difference was ${difference}`
            };
        }
    }
}

// --- Test Runner Core ---

export async function runTest(test: Test): Promise<{ test: Test; result: TestResult }> {
    try {
        const result = await test.run();
        return { test, result };
    } catch (error) {
        return {
            test,
            result: {
                success: false,
                message: `Test threw an error: ${error}`,
                error: error instanceof Error ? error : new Error(String(error))
            }
        };
    }
}

export async function runTestSuite(suite: TestSuite): Promise<TestRunnerResults> {
    // Run setup if provided
    if (suite.setup) {
        try {
            await suite.setup();
        } catch (error) {
            TestOutput.failure(`Setup failed: ${error}`);
            return {
                totalTests: suite.tests.length,
                passedTests: 0,
                failedTests: suite.tests.length,
                suiteResults: [{
                    suiteName: suite.name,
                    passed: 0,
                    failed: suite.tests.length,
                    failures: suite.tests.map(test => ({
                        testName: test.name,
                        message: `Setup failed: ${error}`
                    }))
                }]
            };
        }
    }

    const results: Array<{ test: Test; result: TestResult }> = [];
    
    // Run all tests
    for (const test of suite.tests) {
        const testResult = await runTest(test);
        results.push(testResult);
        
        // Only log failures
        if (!testResult.result.success) {
            TestOutput.failure(`${test.name} - ${testResult.result.message || 'Unknown error'}`);
        }
    }

    // Run teardown if provided
    if (suite.teardown) {
        try {
            await suite.teardown();
        } catch (error) {
            TestOutput.warning(`Teardown failed: ${error}`);
        }
    }

    // Calculate results
    const passed = results.filter(r => r.result.success).length;
    const failed = results.filter(r => !r.result.success).length;
    const failures = results
        .filter(r => !r.result.success)
        .map(r => ({
            testName: r.test.name,
            message: r.result.message || 'Unknown error'
        }));

    return {
        totalTests: suite.tests.length,
        passedTests: passed,
        failedTests: failed,
        suiteResults: [{
            suiteName: suite.name,
            passed,
            failed,
            failures
        }]
    };
}

// --- Main Test Runner ---

export async function runAllTests(): Promise<TestRunnerResults> {
    // Import test suites
    //const { createStringObfuscationTests } = await import('./stringObfuscation.test');
    const { createDiscoveryTests } = await import('./discovery.test');

    const testSuites = [
        //createStringObfuscationTests(), //these tests are outdated
        createDiscoveryTests(),
    ];

    const allResults: TestRunnerResults = {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        suiteResults: []
    };

    // Run each test suite
    for (const suite of testSuites) {
        const suiteResult = await runTestSuite(suite);
        
        allResults.totalTests += suiteResult.totalTests;
        allResults.passedTests += suiteResult.passedTests;
        allResults.failedTests += suiteResult.failedTests;
        allResults.suiteResults.push(...suiteResult.suiteResults);
    }

    // Only log summary if there are failures
    if (allResults.failedTests > 0) {
        TestOutput.summary(allResults);
    }
    
    return allResults;
}

// --- Simple Synchronous Runner ---

export function runTests(): void {
    runAllTests().then(results => {
        if (results.failedTests > 0) {
            console.error(`❌ Tests failed: ${results.failedTests}/${results.totalTests}`);
            // Show details of failures
            results.suiteResults.forEach(suite => {
                if (suite.failures.length > 0) {
                    console.error(`Failures in ${suite.suiteName}:`);
                    suite.failures.forEach(failure => {
                        console.error(`  - ${failure.testName}: ${failure.message}`);
                    });
                }
            });
        }
        // No logging for success - silent pass
    }).catch(error => {
        console.error('❌ Test runner failed:', error);
    });
}

// --- Standalone Execution ---

// If this file is run directly with Node.js, execute all tests
// Check for standalone execution in both CommonJS and ES module environments
const isMainModule = isNodeEnvironment && (
    (typeof require !== 'undefined' && require.main === module) ||
    (typeof import.meta !== 'undefined' && import.meta.url === `file://${process.argv[1]}`)
);

if (isMainModule) {
    runAllTests().then(results => {
        // Exit with error code if any tests failed
        const exitCode = results.failedTests > 0 ? 1 : 0;
        process.exit(exitCode);
    }).catch(error => {
        console.error('Test runner crashed:', error);
        process.exit(1);
    });
} 