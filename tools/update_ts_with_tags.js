const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../assets/remedy-tips.json');
const tsPath = path.join(__dirname, '../src/data/remedy-tips.ts');

const jsonData = fs.readFileSync(jsonPath, 'utf8');
let tsContent = fs.readFileSync(tsPath, 'utf8');

// 1. Update Interface
if (!tsContent.includes('tags?: string[];')) {
    tsContent = tsContent.replace(
        'type: TipType;',
        'type: TipType;\n    tags?: string[];'
    );
}

// 2. Replace RAW_TIPS array
// We look for "const RAW_TIPS: (Omit<Tip, 'type'> & { type?: TipType })[] = ["
// and the closing "];"
const startMarker = "const RAW_TIPS: (Omit<Tip, 'type'> & { type?: TipType })[] = [";
const endMarker = "];";

const startIndex = tsContent.indexOf(startMarker);
if (startIndex === -1) {
    console.error("Could not find RAW_TIPS start marker");
    process.exit(1);
}

const arrayStartIndex = startIndex + startMarker.length;
// Find the closing bracket for this array. Since we know the structure is specific,
// and we assume the file ends with the map logic, we can look for the last "];" before the export or search carefully.
// But better: we can construct the new file content.

const pre = tsContent.substring(0, arrayStartIndex);
// find where RAW_TIPS ends. It ends before "export const REMEDY_TIPS".
const postMarker = "export const REMEDY_TIPS";
const postIndex = tsContent.indexOf(postMarker);

if (postIndex === -1) {
    console.error("Could not find REMEDY_TIPS export");
    process.exit(1);
}

// We need to find the `];` that closes RAW_TIPS. It should be the last `];` before `postIndex`.
const segment = tsContent.substring(arrayStartIndex, postIndex);
const lastBracket = segment.lastIndexOf("];");

if (lastBracket === -1) {
    console.error("Could not find closing bracket for RAW_TIPS");
    process.exit(1);
}

// Reconstruct
const newContent =
    pre + "\n" +
    jsonData.trim().replace(/^\[/, "").replace(/\]$/, "") + // remove outer brackets from JSON as we effectively paste inside existing [] or we should just paste the whole JSON and remove the marker brackets?
    // Actually, RAW_TIPS = [ ... ];
    // jsonData = [ ... ]
    // So if we paste jsonData, we replace [ ... ] entirely.
    "\n" +
    tsContent.substring(arrayStartIndex + lastBracket + 2); // +2 for "];" ? No.

// Wait, let's just replace the whole variable declaration part if possible?
// Or simpler:
// pre is up to `... = [`
// jsonData is `[ ... ]`
// if I put jsonData there, I have `... = [[ ... ]]` potentially.

// Correct approach:
// Replace everything between `startMarker` and the closing `;` of that statement.
// But finding the closing `;` is hard with regex if nested.
// However, the structure is simple.
// I will just locate the `export const REMEDY_TIPS` line, go back to find the closing `];` of the previous block?
// Or trust that I can replace the whole array content.

const arrayContent = jsonData.substring(1, jsonData.length - 1); // strip [ and ]

const beforeArray = tsContent.substring(0, arrayStartIndex);
const afterArray = tsContent.substring(startIndex + startMarker.length + segment.lastIndexOf("];") + 1); // +1 only consumes ]

// We need to keep the closing ];
// segment contains everything from `[` (exclusive) to `export const...` (exclusive)
// lastBracket is index within segment of `];`.
// So segment.substring(0, lastBracket) is the content.
// We want to replace that with arrayContent.

const newFile =
    beforeArray +
    arrayContent +
    segment.substring(lastBracket); // This starts with ]; \n \n export ...
+ tsContent.substring(postIndex); // wait postIndex is included in segment if we go up to it?

// Actually simpler:
// 1. Read everything up to `const RAW_TIPS... = [` -> part1
// 2. Read `export const REMEDY_TIPS...` and everything after -> part2
// 3. Join part1 + jsonData + ";\n\n" + part2. 
// Note: jsonData includes []. So `const ... = ` + jsonData + `;` works perfect.

const part1 = tsContent.substring(0, startIndex + startMarker.length - 1); // remove the last `[` because jsonData has it.
// Actually startMarker has `[`.
// Let's perform exact split.
const splitPoint1 = tsContent.indexOf(startMarker);

// Find where to resume.
const searchFrom = splitPoint1 + 100;
const splitPoint2 = tsContent.indexOf("export const REMEDY_TIPS", searchFrom);

// Verify we found it
if (splitPoint1 === -1 || splitPoint2 === -1) {
    console.error("Markers not found");
    process.exit(1);
}

// The text between splitPoint1 and splitPoint2 contains the old array and the closing `];` and some newlines.
// effectively: `const RAW_TIPS ... = [ ...old content... ]; \n\n`
// I want to replace `[ ...old content... ]` with `jsonData`.
// But I need to be careful about the `const RAW_TIPS ... = ` part.

// Let's try this:
// Output = (content up to `= `) + jsonData + `;\n\n` + (content from `export const REMEDY_TIPS`)

// locate `= [`
const assignIdx = tsContent.indexOf("= [", splitPoint1);
if (assignIdx === -1) { console.error("Could not find assignment"); process.exit(1); }

const prefix = tsContent.substring(0, assignIdx + 2); // includes `= ` ? No, `= [` -> index points to `=`.
// assignIdx points to `=`. assignIdx+1 is space. assignIdx+2 is `[`.
// So substring(0, assignIdx + 1) gives `... =`. then space?
// Let's assume style ` = [`.

// Just use the startMarker I defined which includes ` = [`.
// const startMarker = "const RAW_TIPS: (Omit<Tip, 'type'> & { type?: TipType })[] = [";
// This ends with `[`.
// So `tsContent.substring(0, startIndex + startMarker.length)` includes the opening `[`.
// But `jsonData` also has `[`. So duplicate `[[`.
// So take substrings up to length-1.

const head = tsContent.substring(0, startIndex + startMarker.length - 1);
// head ends with `... = `

const tail = tsContent.substring(splitPoint2);
// tail starts with `export const REMEDY_TIPS ...`

// We missed the `;\n\n` between the array and the export.
const middle = ";\n\n";

const finalParams = head + jsonData + middle + tail;
fs.writeFileSync(tsPath, finalParams, "utf8");
console.log("Updated remedy-tips.ts with tags.");
