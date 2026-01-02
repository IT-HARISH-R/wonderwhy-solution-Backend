import mongoose from 'mongoose'
import { MONGODB_URL, PORT } from './utils/config.js'
import app from './app.js'


mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log("\x1b[32m%s\x1b[0m", "✅ Database connected successfully");

        app.listen(PORT, () => {
            console.log("\x1b[36m%s\x1b[0m", `🚀 Server is running on http://localhost:${PORT}`);
        })
    })

    .catch((error) => {
        console.error("\x1b[31m%s\x1b[0m", "❌ Database connection failed:", error.message);
    });
