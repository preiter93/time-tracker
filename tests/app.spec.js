import { test, expect } from '@playwright/test';

test('happy path', async ({ page }) => {
	await page.goto('/');

	// Sanity check that the app has started
	const title = page.getByText('Time Tracker').first()
	await expect(title).toBeVisible()

	// Clicks the create timer button
	await page.click('.add-button');

	// Count the number of timers
	const timers = page.locator('.timer');
	expect(await timers.count()).toBe(1);
	let firstTimer = timers.first();

	// Timer name and times are displayed correctly
	const firstTimerName = firstTimer.locator('.name');
	const firstTimerTime = firstTimer.locator('.time');
	const totalTime = page.locator('.total-time');
	await expect(firstTimerName).toHaveValue('Timer 1');
	await expect(firstTimerTime).toHaveValue('00:00:00');
	await expect(totalTime).toHaveText('Total time:00:00:00');

	// Starts a timer and wait for 2 seconds
	await firstTimer.getByTestId('play').click();
	await page.waitForTimeout(2200);

	// Pauses a timer
	await firstTimer.getByTestId('pause').click();
	await expect(firstTimerTime).toHaveValue('00:00:02');
	await expect(totalTime).toHaveText('Total time:00:00:02');

	// Create a second timer
	await page.click('.add-button');
	expect(await timers.count()).toBe(2);
	let secondTimer = timers.last();
	const secondTimerName = secondTimer.locator('.name');
	const secondTimerTime = secondTimer.locator('.time');
	await expect(secondTimerName).toHaveValue('Timer 2');

	// Update the time of timer 2
	await secondTimerTime.fill("01:00:00");
	await secondTimerTime.press('Enter');
	await expect(secondTimerTime).toHaveValue('01:00:00');
	await expect(totalTime).toHaveText('Total time:01:00:02');

	// Delete timer 1
	await firstTimer.locator('.cancel-button').click();
	await page.waitForTimeout(500); // settle animation
	expect(await timers.count()).toBe(1);
	await expect(totalTime).toHaveText('Total time:01:00:00');

	// Reset timer 2
	await secondTimer.getByTestId('stop').click();
	await expect(secondTimerTime).toHaveValue('00:00:00');
	await expect(totalTime).toHaveText('Total time:00:00:00');

	// For testing in headed mode
	// await page.waitForTimeout(1000);
});
