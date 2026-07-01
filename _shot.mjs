import { chromium } from 'playwright-core';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
const c=await b.newContext({viewport:{width:430,height:932},deviceScaleFactor:2,isMobile:true});
const p=await c.newPage();
for (const [route,name] of [['/','home2'],['/liturgy/d-calling','reading2']]) {
  await p.goto('http://127.0.0.1:8099'+route,{waitUntil:'networkidle',timeout:60000});
  await p.waitForTimeout(2600);
  await p.screenshot({path:`screenshots/_${name}.png`});
  console.log('shot',name);
}
await b.close();console.log('done');
