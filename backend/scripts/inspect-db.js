require('dotenv').config();
const mongoose = require('mongoose');
const FinancialRecord = require('../models/FinancialRecord');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const records = await FinancialRecord.find().sort({ periodDate: -1 }).limit(1);

        console.log("=====================================");
        console.log("LATEST RECORD IN DATABASE:");
        console.log(JSON.stringify(records[0], null, 2));
        console.log("=====================================");

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
