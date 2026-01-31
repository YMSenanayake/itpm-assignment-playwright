import { test, expect } from '@playwright/test';

test.use({ browserName: 'chromium' });

test.describe('Negative Functional Test Cases (Robustness & Edge Cases)', () => {
  // REMOVED: test.describe.configure({ mode: 'serial' }); 
  // Now tests run independently. If one fails, the next one still runs.

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

    // We use soft assertions here? No, strict is fine if you want to see Failures in the report.
    // If you want the test to PASS even if the output is wrong (just to record it), 
    // you would need to change how you compare. 
    // For now, I am keeping your strict comparison so failures show up in red.
    const actualOutput = (await outputLocator.textContent())?.trim() ?? '';
    expect(actualOutput).toBe(expectedOutput);
  }

    // ✅ Neg_UI Helper: Rapid type + clear stress test (UI should not show stale output)
  async function rapidTypeClearAndCheck() {
    const inputBox = page.locator('textarea').first();
    const outputLocator = page.locator('div.bg-slate-50');

    // Start clean
    await inputBox.click();
    await inputBox.fill('');

    // Type something (fast)
    await inputBox.fill('mama gedhara yanavaa.');
    await expect(outputLocator).not.toBeEmpty({ timeout: 20000 });

    // Immediately clear + type new content quickly (race condition test)
    await inputBox.fill('');
    await inputBox.fill('api heta yanavaa.');

    // Wait until output stabilizes (should reflect the last input, not the old one)
    await expect(outputLocator).not.toBeEmpty({ timeout: 20000 });

    const actualOutput = (await outputLocator.textContent())?.trim() ?? '';

    // ✅ UI must show latest output, not stale previous output
    expect(actualOutput).toBe('අපි හෙට යනවා');
    expect(actualOutput).not.toBe('මම ගෙදර යනවා.');
  }


  // --- Negative / Robustness Scenarios ---

  test('Neg_Fun_01: Joined words without spaces', async () => {
    // Input: mamagedharainnee
    // If the tool is robust, it should figure out spaces. If not, it fails.
    await typeAndCheck('mamagedharainnee', 'මම ගෙදර ඉන්නේ'); 
  });

  test('Neg_Fun_02: Extra spaces between words', async () => {
    // Input with extra spaces
    await typeAndCheck('api    heta    yanavaa', 'අපි හෙට යනවා');
  });

  test('Neg_Fun_03: Verb spelling typo', async () => {
    // Typo: yannava -> yanava
    await typeAndCheck('mama gedhara yannava', 'මම ගෙදර යනවා');
  });

  test('Neg_Fun_04: Informal broken grammar', async () => {
    await typeAndCheck('oyaa enne nadda', 'ඔයා එන්නේ නැද්ද');
  });

  test('Neg_Fun_05: Slang with spelling errors', async () => {
    await typeAndCheck('adoo machn ela wedaa', 'අඩෝ මචන් එල වැඩ');
  });

  test('Neg_Fun_06: Capital and lowercase mix', async () => {
    await typeAndCheck('Mama Gedhara Yanavaa', 'මම ගෙදර යනවා');
  });

  test('Neg_Fun_07: Missing Space (Number/Text)', async () => {
    await typeAndCheck('paan3k', 'පාන් 3ක්');
  });

  test('Neg_Fun_08: Dual condition sentence', async () => {
    await typeAndCheck('mata headache ekai fever ekai dekama thiyenavaa', 'මට headache එකයි fever එකයි දෙකම තියෙනවා');
  });

  test('Neg_Fun_09: English Sentence (Blind Transliteration)', async () => {
    // Expecting the tool to NOT translate English sentence, but usually it transliterates blindly.
    // If you expect it to Fail to detect English, update expectedOutput to the Sinhala phonetic version.
    // Staying with your request:
    await typeAndCheck('The server is down.', 'The server is down.');
  });

  test('Neg_Fun_10: Negation statement', async () => {
    await typeAndCheck('eyaa project eka hariyata karala nae kiyalaa kiyannavaa', 'එයා project එක හරියට කරලා නෑ කියලා කියනවා');
  });

  test('Neg_Fun_11: Repeated emphasis words', async () => {
    await typeAndCheck('apihetaheta yamu yamu', 'අපි හෙට හෙට යමු යමු');
  });

  test('Neg_Fun_12: Brand + joined word', async () => {
    await typeAndCheck('mama GoogleDrive eke file upload karalaa thiyenavaa', 'මම Google Drive එකේ file upload කරලා තියෙනවා');
  });

    test('Neg_UI_01: Rapid type + clear should not keep stale output', async () => {
    await rapidTypeClearAndCheck();
  });


});