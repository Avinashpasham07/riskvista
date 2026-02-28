const mongoose = require('mongoose');
const FinancialRecord = require('./models/FinancialRecord');

async function testQuery() {
    await mongoose.connect('mongodb://127.0.0.1:27017/startup-risk-platform');
    const records = await FinancialRecord.find({}).sort({ createdAt: -1 }).limit(1);
    console.log(JSON.stringify(records, null, 2));
    process.exit();
}
testQuery();
