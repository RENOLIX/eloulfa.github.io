const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const memory=new Map();
const context=vm.createContext({location:{hostname:'renolix.github.io',pathname:'/eloulfa.github.io/',search:''},localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)},document:{addEventListener(){},querySelectorAll(){return []}},window:{dispatchEvent(){}},CustomEvent:class{},Intl,URLSearchParams,crypto:require('node:crypto').webcrypto});
const source=fs.readFileSync(path.join(root,'store.js'),'utf8');
vm.runInContext(source+';globalThis.inspect={PRODUCTS,COUNTRIES,cartItems,saveCart,cartTotal,money,link,checkoutPage,thanksPage};',context);
const api=context.inspect;
assert.equal(api.PRODUCTS.length,2);
for(const product of api.PRODUCTS){
 assert.equal(product.price,80);
 assert.deepEqual(Array.from(product.sizes),Array.from({length:13},(_,i)=>String(34+i*2)));
 for(const image of product.images)assert.ok(fs.existsSync(path.join(root,image)));
 assert.ok(fs.existsSync(path.join(root,product.url,'index.html')));
}
assert.equal(api.link('/panier/'),'/eloulfa.github.io/panier/');
assert.equal(api.COUNTRIES.some(([code])=>code==='DZ'),false);
assert.ok(api.COUNTRIES.some(([code])=>code==='FR'));
memory.set('eloulfa-cart-v1',JSON.stringify([{id:'unknown',size:'34',quantity:1},{id:api.PRODUCTS[0].id,size:'33',quantity:1},{id:api.PRODUCTS[0].id,size:'34',quantity:2},{id:api.PRODUCTS[1].id,size:'58',quantity:1},{id:api.PRODUCTS[1].id,size:'58',quantity:-4}]));
assert.equal(api.cartItems().length,2);
assert.equal(api.cartTotal(),240);
assert.match(api.money(80),/80,00\s*€/);
assert.match(api.checkoutPage(),/disabled placeholder="••••/);
assert.doesNotMatch(source,/fetch\(|XMLHttpRequest|firebase|stripe\.com|fbq\(|khadidja|DZD|wilaya/i);
api.saveCart([]);assert.equal(api.cartTotal(),0);
const files=[];
function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){if(item.name.startsWith('.'))continue;const p=path.join(dir,item.name);if(item.isDirectory())walk(p);else files.push(p);}}
walk(root);
const html=files.filter(p=>p.endsWith('.html'));
for(const file of html){
 const text=fs.readFileSync(file,'utf8');
 assert.match(text,/<title>.+El Oulfa Création<\/title>/);
 assert.doesNotMatch(text,/khadidja|DZD|firebase|demo|démo/i);
 for(const [,target] of text.matchAll(/(?:src|href)="([^"#?]+)(?:\?[^"#]*)?"/g)){
  if(/^(https?:|mailto:|tel:)/.test(target))continue;
  assert.ok(fs.existsSync(path.resolve(path.dirname(file),target)),file+' -> '+target);
 }
}
console.log('PASS: 2 products at EUR 80, 13 sizes each, Europe destinations, valid cart totals, inactive card fields, no external order/payment calls, '+html.length+' page asset paths.');
