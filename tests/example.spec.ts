import { test, expect } from '@playwright/test';

import {
  BatchInfo,
  Configuration,
  EyesRunner,
  ClassicRunner,
  VisualGridRunner,
  BrowserType,
  DeviceName,
  ScreenOrientation,
  Eyes,
  Target
} from '@applitools/eyes-playwright';

// Settings to control how tests are run.
// These could be set by environment variables or other input mechanisms.
// They are hard-coded here to keep the example project simple.
export const USE_ULTRAFAST_GRID: boolean = true;

// Applitools objects to share for all tests
export let Batch: BatchInfo;
export let Config: Configuration;
export let Runner: EyesRunner;

test.beforeAll(async () => {

  if (USE_ULTRAFAST_GRID) {
    // Create the runner for the Ultrafast Grid.
    // Concurrency refers to the number of visual checkpoints Applitools will perform in parallel.
    // Warning: If you have a free account, then concurrency will be limited to 1.
    Runner = new VisualGridRunner({ testConcurrency: 1 });
  }
  else {
    // Create the classic runner.
    Runner = new ClassicRunner();
  }

  // Create a new batch for tests.
  // A batch is the collection of visual checkpoints for a test suite.
  // Batches are displayed in the Eyes Test Manager, so use meaningful names.
  const runnerName = (USE_ULTRAFAST_GRID) ? 'Ultrafast Grid' : 'Classic runner';
  Batch = new BatchInfo({ name: `Pruebas de Jelou Brain con ${runnerName}` });

  // Create a configuration for Applitools Eyes.
  Config = new Configuration();

  // Set the batch for the config.
  Config.setBatch(Batch);

  // If running tests on the Ultrafast Grid, configure browsers.
  if (USE_ULTRAFAST_GRID) {
    // Add 3 desktop browsers with different viewports for cross-browser testing in the Ultrafast Grid.
    // Other browsers are also available, like Edge and IE.
    // Config.addBrowser(1280, 800, BrowserType.CHROME);
    // Config.addBrowser(1366, 768, BrowserType.CHROME);
    // Config.addBrowser(1440, 900, BrowserType.CHROME);
    // Config.addBrowser(1536, 864, BrowserType.CHROME);
    // Config.addBrowser(1600, 900, BrowserType.CHROME);
    // Config.addBrowser(1920, 1080, BrowserType.CHROME);
    // Config.addBrowser(800, 600, BrowserType.CHROME);
    // Config.addBrowser(1600, 1200, BrowserType.FIREFOX);
    // Config.addBrowser(1024, 768, BrowserType.SAFARI);

    // Add 2 mobile emulation devices with different orientations for cross-browser testing in the Ultrafast Grid.
    // Other mobile devices are available.
    // Config.addDeviceEmulation(DeviceName.iPhone_11, ScreenOrientation.PORTRAIT);
    // Config.addDeviceEmulation(DeviceName.Nexus_10, ScreenOrientation.LANDSCAPE);

    Config.setApiKey("Iiijh2cWHfyBCgx7JBNxeDdWFYF109djdMQxklLZ0oyZM110");
  }
});

// This "describe" method contains related test cases with per-test setup and cleanup.
// In this example, there is only one test.
test.describe('Jelou Brain', () => {
  // Test-specific objects
  let eyes: Eyes;

  // This method sets up each test with its own Applitools Eyes object.
  test.beforeEach(async ({ page }) => {
    // Create the Applitools Eyes object connected to the runner and set its configuration.
    eyes = new Eyes(Runner, Config);

    // Open Eyes to start visual testing.
    // Each test should open its own Eyes for its own snapshots.
    // It is a recommended practice to set all four inputs below:
    await eyes.open(
      // The Playwright page object to "watch"
      page,

      // The name of the application under test.
      // All tests for the same app should share the same app name.
      // Set this name wisely: Applitools features rely on a shared app name across tests.
      'Jelou Brain',

      // The name of the test case for the given application.
      // Additional unique characteristics of the test may also be specified as part of the test name,
      // such as localization information ("Home Page - EN") or different user permissions ("Login by admin"). 
      test.info().title,

      // The viewport size for the local browser.
      // Eyes will resize the web browser to match the requested viewport size.
      // This parameter is optional but encouraged in order to produce consistent results.
      { width: 1916, height: 957 });
      await page.goto('https://apps-brain.jelou-apps.pages.dev/home');
      await page.getByRole('link', { name: 'Brain' }).click();
  });

  test('CRUD Brain', async ({ page }) => {
    // Crear Brain
    await test.step('Create Brain', async () => {
      await page.getByRole('button', { name: '+ Crear' }).click();
      //await eyes.check('create card', Target.window().fully().layout());
      await page.locator("input[name='name']").fill('Brain automation test');
      await page.locator("textarea[name='description']").fill('Brain descripción automation test');
      await page.getByRole('button', { name: 'Crear' }).click();
      await expect(page.getByRole('alert')).toBeVisible();
      await expect(page.getByRole('alert')).toContainText('Haz creado exitosamente el brain "Brain automation test"');
      await page.waitForTimeout(3000);
      //await eyes.check('create Brain', Target.window().fully().layout());
    });

    // Editar Brain
    await page.locator("input[type='search']").fill('automation');
    await page.waitForTimeout(3000); // Espera 3 segundos
    //await eyes.check('Search', Target.window().fully().layout());
    await page.click('[id*="headlessui-menu-button-:"]');
    //await eyes.check('Menu option', Target.window().fully().layout());
    await page.getByRole('button', { name: 'Editar' }).click();
    await expect(page.locator("input[value='Brain automation test']")).toBeVisible();
    await expect(page.getByText('Brain descripción automation test')).toBeVisible();
    //await eyes.check('Edit option', Target.window().fully().layout());
    await page.locator("input[name='name']").clear();
    await page.locator("input[name='name']").fill('Brain automation test EDITADO');
    await page.locator("textarea[name='description']").clear();
    await page.locator("textarea[name='description']").fill('Brain descripción automation test EDITADO');
    await expect(page.getByText('Brain descripción automation test EDITADO')).toBeVisible();
    //await eyes.check('Edit card', Target.window().fully().layout());
    await page.getByRole('button', { name: 'Actualizar' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('alert')).toContainText('Haz actualizado exitosamente el brain "Brain automation test EDITADO"');
    await page.waitForTimeout(3000);
    //await eyes.check('Edit Brain', Target.window().fully().layout());

    // Ver Brain
    await page.locator("input[type='search']").fill('automation');
    await page.waitForTimeout(3000); // Espera 3 segundos
    await page.click('[id*="headlessui-menu-button-:"]');
    await page.getByRole('button', { name: 'Ver' }).click();
    await page.getByRole('link', { name: 'Administra tus canales' }).click();
    await expect(page.getByText('Aún no tienes knowledges en Brain automation test Editado')).toBeVisible();
    //await eyes.check('Empty Brain', Target.window().fully().layout());

    // Ver Canales
    await page.getByRole('button', { name: 'Canales' }).click();
    await expect(page.getByText('Aún no tienes canales en Brain automation test')).toBeVisible();
    //await eyes.check('Empty channels', Target.window().fully().layout());

    // Eliminar Knowledge
    await page.getByRole('button', { name: 'Brains' }).click();
    await page.waitForTimeout(3000);
    await page.locator("input[type='search']").fill('automation');
    await page.waitForTimeout(3000); // Espera 3 segundos
    await page.click('[id*="headlessui-menu-button-:"]');
    await page.getByRole('button', { name: 'Eliminar' }).click();
    //await eyes.check('Delete Brain modal', Target.window().fully().layout());
    await expect(page.getByText('Eliminar Brain')).toBeVisible();
    await expect(page.getByText('¿Estás seguro de eliminar todo el Brain?')).toBeVisible();
    await expect(page.getByText('Recuerda que si eliminas este Brain perderás la información, para recuperarl')).toBeVisible();
    await page.getByRole('button', { name: 'Si, deseo eliminarlo' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('alert')).toContainText('Haz eliminado exitosamente el/la brain');
    await page.waitForTimeout(3000);
    //await eyes.check('Delete Brain', Target.window().fully().layout());
  });

  // This method performs cleanup after each test.
  test.afterEach(async () => {
    // Close Eyes to tell the server it should display the results.
    await eyes.close();
  });
});

test.afterAll(async () => {
  // Close the batch and report visual differences to the console.
  // Note that it forces Playwright to wait synchronously for all visual checkpoints to complete.
  const results = await Runner.getAllTestResults();
  console.log('Visual test results', results);
});
