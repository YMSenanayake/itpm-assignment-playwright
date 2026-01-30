import { test, expect } from '@playwright/test';

test.use({ browserName: 'chromium' });

test.describe('Negative Functional Test Cases (Robustness & Edge Cases)', () => {
  test.describe.configure({ mode: 'serial' }); // ✅ Share one page for speed

  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('https://www.swifttranslator.com/', { waitUntil: 'domcontentloaded' });
  });

  test.afterAll(async () => {
    await page?.close();
  });

  // Helper: clear input, type slowly, wait for output, assert
  async function typeAndCheck(input, expectedOutput) {
    const inputBox = page.locator('textarea').first();
    const outputLocator = page.locator('div.bg-slate-50');

    // ✅ Clear previous input
    await inputBox.click();
    await inputBox.fill('');

    // ✅ Type with delay to trigger real-time conversion
    await inputBox.pressSequentially(input, { delay: 100 });

    // Stability wait
    await page.waitForTimeout(500);

    // ✅ Wait until output becomes non-empty
    await expect(outputLocator).not.toBeEmpty({ timeout: 20000 });

    const actualOutput = (await outputLocator.textContent())?.trim() ?? '';
    expect(actualOutput).toBe(expectedOutput);
  }

  // --- Negative / Robustness Scenarios ---

  test('Neg_Fun_01: Ambiguous "th" mapping (Robustness)', async () => {
    // System often confuses dental 'th' vs alveolar 't'. Testing literal output.
    await typeAndCheck('paththara', 'පත්තර'); 
  });

  test('Neg_Fun_02: URL Transliteration (Unwanted Conversion)', async () => {
    // The tool should ignore URLs, but it blindly converts them. 
    // We test that it converts "w" to "ව්" instead of crashing.
    await typeAndCheck('www.google.com', 'ව්ව්ව්.ගූග්ල්.කොම්');
  });

  test('Neg_Fun_03: Chat Shorthand (Context Failure)', async () => {
    // "mk" implies "mokada", but tool outputs literal "mk" sound.
    await typeAndCheck('mk', 'ම්ක්');
  });

  test('Neg_Fun_04: Email Address Corruption', async () => {
    // Verifies that special chars like @ do not break the converter, 
    // even if the domain name gets transliterated.
    await typeAndCheck('kamal@gmail.com', 'කමල්@ග්මේල්.කොම්');
  });

  test('Neg_Fun_05: Consonant Cluster Ambiguity', async () => {
    // Testing if 'kra' becomes 'krama' or 'karama'.
    await typeAndCheck('krama', 'ක්‍රම');
  });

  test('Neg_Fun_06: Excessive Vowel Repetition', async () => {
    // Testing that infinite vowels don't crash the logic.
    await typeAndCheck('ammoooooooo', 'අම්මොඔඔඔඔඔ');
  });

  test('Neg_Fun_07: Missing Space (Number/Text)', async () => {
    // Testing edge case where number is glued to text.
    await typeAndCheck('paan3k', 'පාන්3ක්');
  });

  test('Neg_Fun_08: Dental vs Retroflex Ambiguity', async () => {
    // User expects 'bada' (Stomach - බඩ), but 'd' defaults to dental 'da' (ද).
    // This confirms the limitation of the 'd' key.
    await typeAndCheck('bada', 'බද');
  });

  test('Neg_Fun_09: English Sentence (Blind Transliteration)', async () => {
    // Tool fails to detect English language and converts it phonetically.
    await typeAndCheck('The server is down.', 'ද සර්වර් ඊස් ඩවුන්.');
  });

  test('Neg_Fun_10: Missing Vowels (SMS Style)', async () => {
    // "kLmba" (Colombo) without vowels results in consonant clutter.
    await typeAndCheck('kLmba', 'ක්ල්ම්බ');
  });

  test('Neg_Fun_11: HTML Tag Injection', async () => {
    // Testing XSS prevention/Handling. It should just transliterate the tag names.
    await typeAndCheck('<b>bold</b>', '<b>බොල්ඩ්</b>');
  });

  test('Neg_Fun_12: Emoji Handling', async () => {
    // Emojis should ideally be preserved.
    await typeAndCheck('Hello 👋', 'හෙලෝ 👋');
  });

  test('Neg_Fun_13: ZWJ / Complex Script Failure', async () => {
    // "Raksha" often transliterates incorrectly depending on the engine.
    await typeAndCheck('raksha', 'රක්ෂ');
  });

  test('Neg_Fun_14: Extreme Vowel Sequence', async () => {
    // Nonsense input robustness.
    await typeAndCheck('aaeeeeiiiii', 'ආඒඊඊඊඊඊ');
  });

  test('Neg_Fun_15: Special Characters Only', async () => {
    // Should return the characters as is, no crash.
    await typeAndCheck('@@@###', '@@@###');
  });

  test('Neg_Fun_16: URL Parameters', async () => {
    // Testing mixed symbols and text.
    await typeAndCheck('site.com?id=123', 'සිටේ.කොම්?ඉඩ්=123');
  });

  test('Neg_Fun_17: Mixed Case Chaos', async () => {
    // Uppercase usually doesn't change phonetic mapping in this tool, but we test consistency.
    await typeAndCheck('KaMaL', 'කමල්');
  });

  test('Neg_Fun_18: SQL Keyword Transliteration', async () => {
    // Code should not be converted, but it is.
    await typeAndCheck('SELECT * FROM users', 'සෙලෙක්ට් * ෆ්‍රොම් යූසර්ස්');
  });

  test('Neg_Fun_19: Tamil Phonetic Input', async () => {
    // Inputting Tamil sound "Vanakkam" results in Sinhala script.
    await typeAndCheck('Vanakkam', 'වණක්කම්');
  });

  test('Neg_Fun_20: Nonsense/Typo Input', async () => {
    // Random keys should generate corresponding random Sinhala letters.
    await typeAndCheck('asdfgh', 'අස්ඩ්ෆ්ඝ්');
  });

});