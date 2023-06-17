const mongoose = require('mongoose');

const connectDB = async (DB_URI) => {
    mongoose.set('strictQuery', true);
    try {
        const connection = await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("\x1b[44m%s\x1b[0m", "Connecting Database on " + connection.connection.host);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDB;