import { test, expect } from '@playwright/test';

test.use({ browserName: 'chromium' });

test.describe('Positive Functional Test Cases (Single Chromium Page)', () => {
  test.describe.configure({ mode: 'serial' }); // ✅ allow sharing same page safely

  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('https://www.swifttranslator.com/', { waitUntil: 'domcontentloaded' });
  });

  test.afterAll(async () => {
    await page?.close();
  });

test.setTimeout(60000); // ✅ each test 60s

async function typeAndCheck(input, expectedOutput) {
  const inputBox = page.locator('textarea').first();
  const outputLocator = page.locator('div.bg-slate-50').first();

  await inputBox.fill('');            // clear
  await inputBox.fill(input);         // ✅ fast

  // output non-empty වෙලා text change වෙනකම් බලන්න
  await expect(outputLocator).toHaveText(/.+/, { timeout: 30000 });

  const actual = (await outputLocator.textContent())?.trim() ?? '';
  expect(actual).toBe(expectedOutput);
}

async function clearAndCheckOutputEmpty() {
  const inputBox = page.locator('textarea').first();
  const outputLocator = page.locator('div.bg-slate-50').first();

  // First generate output
  await inputBox.fill('');
  await inputBox.fill('mama gedhara yanavaa.');

  await expect(outputLocator).toHaveText(/.+/, { timeout: 30000 });

  // Now clear input
  await inputBox.fill('');

  // Output empty වෙලාද කියලා check කරනවා
  await expect(outputLocator).toHaveText(/^\s*$/, { timeout: 10000 });
}


  test('Pos_Fun_01: Imperative command @sanity', async () => {
    await typeAndCheck('roogiyaata vahaama oksijan dhenna.', 'රෝගියාට වහාම ඔක්සිජන් දෙන්න.');
  });

  test('Pos_Fun_02: Polite Request (Formal) @sanity', async () => {
    await typeAndCheck('karuNaakara obagee ayadhumpatha heta dhinayata pera evanna.', 'කරුණාකර ඔබගේ අයදුම්පත හෙට දිනයට පෙර එවන්න.');
  });

  test('Pos_Fun_03: Complex Sentence (Time) @sanity', async () => {
    await typeAndCheck('oyaa enakam mama geet eka gaava innavaa.', 'ඔයා එනකම් මම ගේට් එක ගාව ඉන්නවා.');
  });

  test('Pos_Fun_04: Multi-word expression emphasis @sanity', async () => {
    await typeAndCheck('himiita himiita vaeda tika karamu.', 'හිමීට හිමීට වැඩ ටික කරමු.');
  });

  test('Pos_Fun_05: English Abbreviations & Numbers @sanity', async () => {
    await typeAndCheck('magee ID number eka 19951234V vee.', 'මගේ ID number එක 19951234V වේ.');
  });

  test('Pos_Fun_06: Currency and Price @sanity', async () => {
    await typeAndCheck('meekata USD 50 saha Rs. 2000 k yanavaa.', 'මේකට USD 50 සහ Rs. 2000 ක් යනවා.');
  });

  test('Pos_Fun_07: Slang/Colloquial (Friends) @sanity', async () => {
    await typeAndCheck('adoo machan, shape ekee yamu.', 'අඩෝ මචන්, shape එකේ යමු.');
  });

  test('Pos_Fun_08: Joined words @sanity', async () => {
    await typeAndCheck('matanidhimathayi', 'මටනිදිමතයි');
  });

  test('Pos_Fun_09: Negation @sanity', async () => {
    await typeAndCheck('mata eeka epaa.', 'මට ඒක එපා.');
  });

  test('Pos_Fun_10: Plural Subject @sanity', async () => {
    await typeAndCheck('ballo buranava.', 'බල්ලො බුරනව.');
  });

  test('Pos_Fun_11: Mixed Language @sanity', async () => {
    await typeAndCheck('oyaa Google Drive eken doc eka download karanna.', 'ඔයා Google Drive එකෙන් doc එක download කරන්න.');
  });

  test('Pos_Fun_12: Paragraph/Long Input @sanity', async () => {
    await typeAndCheck('lQQkaavee sundhara thaen balanna api giya sathiyee tour ekak giyaa. siigiriya saha dhaBAulla balalaa api godak sathutu vunaa. ee photos api Facebook ekata upload kaLaa. yaaluvo godak likes dhaalaa thibunaa.', 
      'ලංකාවේ සුන්දර තැන් බලන්න අපි ගිය සතියේ tour එකක් ගියා. සීගිරිය සහ දඹෞල්ල බලලා අපි ගොඩක් සතුටු වුනා. ඒ photos අපි Facebook එකට upload කළා. යාලුවො ගොඩක් likes දාලා තිබුනා.');
  });

  test('Pos_Fun_13: Place Name (English) @sanity', async () => {
    await typeAndCheck('api Kandy valata yanavaa.', 'අපි Kandy වලට යනවා.');
  });

  test('Pos_Fun_14: Punctuation heavy input @sanity', async () => {
    await typeAndCheck('ehema needha?', 'එහෙම නේද?');
  });

  test('Pos_Fun_15: Future Plan with English Date @sanity', async () => {
    await typeAndCheck('api December 25 venidhaata trip ekak yanavaa.', 'අපි December 25 වෙනිදාට trip එකක් යනවා.');
  });

  test('Pos_Fun_16: Pronoun Variation @sanity', async () => {
    await typeAndCheck('eyaalaa api ekka ekathu vunaa.', 'එයාලා අපි එක්ක එකතු වුනා.');
  });

  test('Pos_Fun_17: Measurement Units @sanity', async () => {
    await typeAndCheck('siini 500g ganna.', 'සීනි 500g ගන්න.');
  });

  test('Pos_Fun_18: Technical Instruction @sanity', async () => {
    await typeAndCheck('Router eka restart karanna.', 'Router එක restart කරන්න.');
  });

  test('Pos_Fun_19: Slang/Idiom @sanity', async () => {
    await typeAndCheck('elakiri machan.', 'එලකිරි මචන්.');
  });

  test('Pos_Fun_20: Abbreviation (Tech) @sanity', async () => {
    await typeAndCheck('mata OTP eka aavaa.', 'මට OTP එක ආවා.');
  });

  test('Pos_Fun_21: Complex Vowel Sounds @sanity', async () => {
    await typeAndCheck('maathRUU', 'මාතෲ');
  });

  test('Pos_Fun_22: Address Format @sanity', async () => {
    await typeAndCheck('No 12, malvaththa Road, Colombo 7.', 'No 12, මල්වත්ත Road, Colombo 7.');
  });

  test('Pos_Fun_23: Collocation @sanity', async () => {
    await typeAndCheck('boru kiyanna epaa.', 'බොරු කියන්න එපා.');
  });

  test('Pos_Fun_24: Emotional Exclamation @sanity', async () => {
    await typeAndCheck('Shaa! maara lassanayi nee.', 'ෂා! මාර ලස්සනයි නේ.');
  });

  test('Pos_Fun_25: Punctuation (Exclamation) @sanity', async () => {
    await typeAndCheck('hari Shook!', 'හරි ෂෝක්!');
  });

  test('Pos_UI_01: Clear input clears output @sanity', async () => {
  await clearAndCheckOutputEmpty();
});


 
});
