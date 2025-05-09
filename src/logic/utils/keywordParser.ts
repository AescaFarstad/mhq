/**
 * Parses a keyword file content according to the specified format.
 * Format:
 * SkillOrSpecializationDisplayName
 * keyword1 keyword2 keyword3
 * keyword4 keyword5
 * 
 * SkillOrSpecializationDisplayName2
 * keyword6 keyword7
 *
 * @param fileContent The raw string content of the keyword file.
 * @returns A Map where keys are display names and values are arrays of keyword arrays (string[][]).
 */
export function parseKeywordsFromString(fileContent: string): Map<string, string[][]> {
    const keywordMap = new Map<string, string[][]>();
    const lines = fileContent.split(/\r?\n/); // Split by newline, handling CRLF and LF

    let currentDisplayName: string | null = null;
    let currentKeywords: string[][] = [];

    for (const line of lines) {
        const trimmedLine = line.trim();

        if (trimmedLine === '') {
            // Blank line separator: finalize the current entry if one exists
            if (currentDisplayName && currentKeywords.length > 0) {
                keywordMap.set(currentDisplayName, currentKeywords);
            }
            currentDisplayName = null; // Reset for the next block
            currentKeywords = [];
        } else if (currentDisplayName === null) {
            // This must be a new display name
            currentDisplayName = trimmedLine;
        } else {
            // This is a line of keywords for the current display name
            const keywordsInLine = trimmedLine.split(/\s+/).filter(kw => kw.length > 0); // Split by whitespace
            if (keywordsInLine.length > 0) {
              currentKeywords.push(keywordsInLine);
            }
        }
    }

    // Add the last entry if the file doesn't end with a blank line
    if (currentDisplayName && currentKeywords.length > 0) {
        keywordMap.set(currentDisplayName, currentKeywords);
    }

    return keywordMap;
}

// Example Usage (if run directly, or for testing):
/*
const exampleContent = `
Example Skill 1
keyword1 keyword2
keyword3 keyword4 keyword5

Example Skill 2
alpha beta
gamma
`;

const parsed = parseKeywordsFromString(exampleContent);
console.log(parsed);
*/ 