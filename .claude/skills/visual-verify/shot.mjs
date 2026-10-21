// Headless Chrome screenshot of a page of the dev server, in a given theme.
//
//   node .claude/skills/visual-verify/shot.mjs <url> <light|dark> <out.png> [options]
//
//   --w 1400 --h 900     viewport size
//   --full               grow the viewport to the page height (capped at 6000px)
//   --hover <selector>   scroll to the first match and move the mouse over it
//   --js <code>          evaluate code in the page before the shot (focus, scroll, click)
//   --clip x,y,w,h       capture only that rectangle, at 2x
//   --wait 5000          ms to let SvelteKit hydrate before touching the page
//
// Chrome is found through CHROME_PATH, then the usual install locations.
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [url, theme, out, ...rest] = process.argv.slice(2);
if (!url || !theme || !out) {
	console.error('usage: shot.mjs <url> <light|dark> <out.png> [--w --h --full --hover --js --clip --wait]');
	process.exit(1);
}
const opt = (name, fallback) => {
	const i = rest.indexOf(`--${name}`);

	return i === -1 ? fallback : (rest[i + 1] ?? true);
};
const width = Number(opt('w', 1400));
const height = Number(opt('h', 900));
const full = rest.includes('--full');
const wait = Number(opt('wait', 5000));

const chromePath = [
	process.env.CHROME_PATH,
	'C:/Program Files/Google/Chrome/Application/chrome.exe',
	'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
	'/usr/bin/google-chrome',
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
].find((p) => p && existsSync(p));
if (!chromePath) {
	console.error('Chrome not found: set CHROME_PATH');
	process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn(chromePath, [
	'--headless=new',
	`--remote-debugging-port=${port}`,
	`--user-data-dir=${mkdtempSync(join(tmpdir(), 'vital-shot-'))}`,
	'--no-first-run',
	'--hide-scrollbars',
	'about:blank'
]);

let targets = [];
for (let i = 0; i < 40 && !targets.length; i++) {
	try {
		targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
	} catch {
		await sleep(250);
	}
}
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((resolve) => (ws.onopen = resolve));

let nextId = 0;
const pending = new Map();
ws.onmessage = (event) => {
	const message = JSON.parse(event.data);
	pending.get(message.id)?.(message);
	pending.delete(message.id);
};
const send = (method, params = {}) =>
	new Promise((resolve) => {
		const id = ++nextId;
		pending.set(id, resolve);
		ws.send(JSON.stringify({ id, method, params }));
	});
const evaluate = async (expression) =>
	(await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;
const viewport = (h) =>
	send('Emulation.setDeviceMetricsOverride', { width, height: h, deviceScaleFactor: 1, mobile: false });

await send('Page.enable');
await viewport(height);
await send('Page.navigate', { url });

// SSR text is on screen long before hydration: wait for content, then a fixed grace period.
for (let i = 0; i < 60; i++) {
	await sleep(500);
	if ((await evaluate('document.body ? document.body.innerText.length : 0')) > 200) {
		break;
	}
}
await sleep(wait);

await evaluate(
	`document.documentElement.setAttribute('data-theme', '${theme}'); try { localStorage.theme = '${theme}' } catch {}`
);
await sleep(600);

const hover = opt('hover');
if (hover) {
	const point = await evaluate(`(() => {
		const el = document.querySelector(${JSON.stringify(hover)});
		if (!el) return null;
		el.scrollIntoView({ block: 'center' });
		const r = el.getBoundingClientRect();
		return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
	})()`);
	if (point) {
		await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: point.x, y: point.y });
		await sleep(400);
	}
}
const js = opt('js');
if (js) {
	await evaluate(js);
	await sleep(400);
}
if (full) {
	const pageHeight = await evaluate('Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)');
	await viewport(Math.min(pageHeight, 6000));
	await sleep(500);
}

const clip = opt('clip');
const [x, y, w, h] = clip ? clip.split(',').map(Number) : [];
const shot = await send('Page.captureScreenshot', {
	format: 'png',
	...(clip ? { clip: { x, y, width: w, height: h, scale: 2 } } : {})
});
writeFileSync(out, Buffer.from(shot.result.data, 'base64'));

ws.close();
chrome.kill();
process.exit(0);
