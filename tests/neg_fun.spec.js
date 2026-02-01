import { test, expect } from '@playwright/test';

test.use({ browserName: 'chromium' });

test.describe('Negative Functional Test Cases (Robustness & Edge Cases)', () => {

  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('https://www.swifttranslator.com/', { waitUntil: 'domcontentloaded' });
  });

  test.afterAll(async () => {
    await page?.close();
  });

  async function typeAndCheck(input, expectedOutput) {
    const inputBox = page.locator('textarea').first();
    const outputLocator = page.locator('div.bg-slate-50');

    await inputBox.click();
    await inputBox.fill('');

    await inputBox.pressSequentially(input, { delay: 100 });

    await page.waitForTimeout(500);

    await expect(outputLocator).not.toBeEmpty({ timeout: 20000 });

    const actualOutput = (await outputLocator.textContent())?.trim() ?? '';
    expect(actualOutput).toBe(expectedOutput);
  }

  async function rapidTypeClearAndCheck() {
    const inputBox = page.locator('textarea').first();
    const outputLocator = page.locator('div.bg-slate-50');

    await inputBox.click();
    await inputBox.fill('');

    await inputBox.fill('mama gedhara yanavaa.');
    await expect(outputLocator).not.toBeEmpty({ timeout: 20000 });

    await inputBox.fill('');
    await inputBox.fill('api heta yanavaa.');

    await expect(outputLocator).not.toBeEmpty({ timeout: 20000 });

    const actualOutput = (await outputLocator.textContent())?.trim() ?? '';

    expect(actualOutput).toBe('අපි හෙට යනවා');
    expect(actualOutput).not.toBe('මම ගෙදර යනවා.');
  }


  test('Neg_Fun_01: Joined words without spaces', async () => {

    await typeAndCheck('mamagedharainnee', 'මම ගෙදර ඉන්නේ'); 
  });

  test('Neg_Fun_02: Extra spaces between words', async () => {

    await typeAndCheck('api    heta    yanavaa', 'අපි හෙට යනවා');
  });

  test('Neg_Fun_03: Verb spelling typo', async () => {
 
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