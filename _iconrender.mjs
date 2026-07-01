import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox','--force-device-scale-factor=1'] });
const c = await b.newContext({ viewport:{width:1024,height:1024}, deviceScaleFactor:1 });
const p = await c.newPage();
await p.goto('file://'+process.cwd()+'/scratch-icon/icon.html');
await p.waitForTimeout(300);
await p.screenshot({ path:'scratch-icon/icon-1024.png', clip:{x:0,y:0,width:1024,height:1024} });
console.log('rendered');
await b.close();
