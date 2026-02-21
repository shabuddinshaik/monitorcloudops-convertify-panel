import { test, expect } from '@grafana/plugin-e2e';

test('should display "No data" in case panel data is empty', async ({
  gotoPanelEditPage,
  readProvisionedDashboard,
}) => {
  test.setTimeout(120_000);
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard.json' });
  const panelEditPage = await gotoPanelEditPage({
    dashboard,
    id: '2',
    waitUntil: 'domcontentloaded',
    timeout: 90_000,
  });
  await expect(panelEditPage.panel.locator).toContainText('No data');
});
