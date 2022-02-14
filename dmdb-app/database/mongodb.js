/**
 * @author Danilo Zhu
 */
const mongoose = require('mongoose');
require('dotenv').config();

main().catch(err => console.err(err));

async function main() {
    await mongoose.connect(process.env.MONGODB);
}