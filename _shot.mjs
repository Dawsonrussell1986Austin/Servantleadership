import { chromium } from 'playwright-core';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
const c=await b.newContext({viewport:{width:430,height:932},deviceScaleFactor:2,isMobile:true});
const p=await c.newPage();
await p.goto('http://127.0.0.1:8099/liturgy/d-calling',{waitUntil:'networkidle',timeout:60000});
await p.waitForTimeout(2400);
// scroll down to reveal the action buttons
await p.evaluate(()=>window.scrollTo(0, 900));
await p.waitForTimeout(700);
await p.screenshot({path:'screenshots/_reader3.png'});
const ref=encodeURIComponent('Colossians 3:23–24');
const txt=encodeURIComponent('Whatever you do, work at it with all your heart, as working for the Lord.');
await p.goto(`http://127.0.0.1:8099/share?text=${txt}&reference=${ref}`,{waitUntil:'networkidle',timeout:60000});
await p.waitForTimeout(2000);
await p.screenshot({path:'screenshots/_sharecard.png'});
console.log('done');
await b.close();
