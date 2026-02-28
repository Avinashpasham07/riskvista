require('dotenv').config();
const mongoose = require('mongoose');
const FinancialRecord = require('../models/FinancialRecord');

async function fix() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Wipe all financial records to reset the dashboard state
        const result = await FinancialRecord.deleteMany({});

        console.log("=====================================");
        console.log(`Deleted ${result.deletedCount} corrupted records.`);
        console.log("Database financial state is now completely clean.");
        console.log("=====================================");

        process.exit(0);
    } catch (err) {
        console.error("Error wiping database:", err);
        process.exit(1);
    }
}

fix();
