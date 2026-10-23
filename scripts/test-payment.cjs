const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const card=require('../payment.js');

// Published, synthetic card numbers only. No payment processor is contacted.
for(const [number,network,formatted] of [
 ['4242424242424242','visa','4242 4242 4242 4242'],
 ['5555555555554444','mastercard','5555 5555 5555 4444'],
 ['2223003122003222','mastercard','2223 0031 2200 3222'],
 ['378282246310005','amex','3782 822463 10005']
]){
 assert.equal(card.detectNetwork(number).id,network);
 assert.equal(card.numberError(number),'');
 assert.equal(card.formatNumber(number),formatted);
 assert.notEqual(card.numberError(number.slice(0,-1)+'1'),'');
}
assert.equal(card.detectNetwork('4').id,'visa');
assert.equal(card.detectNetwork('37').id,'amex');
assert.equal(card.detectNetwork('2221').id,'mastercard');
assert.equal(card.detectNetwork('2720').id,'mastercard');
for(const number of ['2220','2721','5000','5600','6011',''])assert.equal(card.detectNetwork(number),null);
assert.notEqual(card.numberError('424242424242'),'');
assert.notEqual(card.numberError('0000000000000000'),'');
assert.equal(card.formatNumber('4242-4242 ab 4242 4242'),'4242 4242 4242 4242');
assert.equal(card.formatExpiry('1228'),'12 / 28');
const now=new Date(2026,9,23);
assert.equal(card.expiryError('10 / 26',now),'');
assert.equal(card.expiryError('12 / 28',now),'');
for(const expiry of ['09 / 26','12 / 25','00 / 28','13 / 28','12','12 / 99'])assert.notEqual(card.expiryError(expiry,now),'');
assert.equal(card.cvcError('123',card.detectNetwork('4')),'');
assert.notEqual(card.cvcError('1234',card.detectNetwork('4')),'');
assert.equal(card.cvcError('1234',card.detectNetwork('37')),'');
assert.notEqual(card.cvcError('123',card.detectNetwork('37')),'');
assert.notEqual(card.cvcError('12x',card.detectNetwork('4')),'');
const source=fs.readFileSync(path.join(__dirname,'../payment.js'),'utf8');
assert.doesNotMatch(source,/localStorage|sessionStorage|fetch\(|XMLHttpRequest|sendBeacon|console\./);
const fields=card.fields();
assert.doesNotMatch(fields,/<input[^>]*\bname=/);
assert.match(fields,/id="card-cvc" type="password"/);
assert.doesNotMatch(fields,/disabled/);
console.log('PASS: Visa, both Mastercard ranges, Amex, formatting, invalid checksums, expiry boundaries, network-specific CVC, no card persistence/transmission.');
