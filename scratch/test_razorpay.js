const fs = require('fs');
const path = require('path');
const Razorpay = require(path.join(__dirname, '../backend/node_modules/razorpay'));

const envFile = fs.readFileSync(path.join(__dirname, '../backend/.env'), 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    envVars[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^"|"$/g, '');
  }
});

console.log('Using Key ID:', envVars['RAZORPAY_KEY_ID']);

const instance = new Razorpay({
  key_id: envVars['RAZORPAY_KEY_ID'],
  key_secret: envVars['RAZORPAY_KEY_SECRET'],
});

async function testOrder() {
  try {
    const order = await instance.orders.create({
      amount: 100, // 1 INR in paise
      currency: 'INR',
      receipt: 'test_rcpt_' + Date.now(),
    });
    console.log('Order created successfully:', order);
  } catch (err) {
    console.error('Order creation error:', err);
  }
}

testOrder();
