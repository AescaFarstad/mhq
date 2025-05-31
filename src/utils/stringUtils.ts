const MYSTERIOUS_CHARS: string[] = [
    'Ձ', 'Ճ', 'Յ', 'Շ', 'Վ', 'Ֆ', 'Ր', 'Ջ', 'Հ', 'ຢ', 'Ն', 'ລ', 'ກ', 'ຊ', 'ы', 'ю', 'ч', 'з', 'ь', '☋', '☡', 'ɻ', 'ɷ', 'ɕ', 'ɗ', 'ⵛ', 'ʋ', 'ɲ', 'ɦ', 'ⵓ', 'ଌ', 'ଓ', 'ઇ', 'ມ', 'Թ', 'Ո'
];

/**
 * Transforms a string into a gibberish string of the same length, deterministically.
 * The first symbol is '¿', the last is '?'. Middle symbols are chosen
 * from a predefined list of "mysterious" characters based on the original character's code,
 * the string's length, and its first/last characters, with the pattern shifting.
 * Spaces in the middle of the string are preserved.
 * @param text The input string.
 * @returns The obfuscated string.
 */
export function obfuscateString(text: string): string {
    if (!text) {
        return "";
    }

    const len = text.length;

    if (len === 0) {
        return "";
    }
    if (len === 1) {
        return "¿";
    }

    let result = "¿";

    const firstCharCode = text.charCodeAt(0) || 1;
    const lastCharCode = text.charCodeAt(len - 1) || 1;
    let seed = (firstCharCode * 31 + lastCharCode * 17 + len * 7) & 0xFFFFFFFF;

    if (len > 1) { 
        for (let i = 1; i < len - 1; i++) {
            const originalChar = text[i];
            if (originalChar === ' ') {
                result += ' ';
            } else {
                const originalCharCode: number = text.charCodeAt(i) || 1;
                seed = (seed * 1664525 + 1013904223 + originalCharCode) & 0xFFFFFFFF;
                const charIndex = (seed & 0x7FFFFFFF) % MYSTERIOUS_CHARS.length;
                result += MYSTERIOUS_CHARS[charIndex];
            }
        }
        result += "?";
    }
    return result;
} 