import app from './src/app.js';
import dotenv from 'dotenv';
import db from "./src/config/db.js"

dotenv.config({ path: './config.env' });

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
  await db.query('SELECT NOW()')
  console.log(`Database connected successfully`);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  } catch (err) {
    console.error('Database startup check failed:', err.message);
    await db.end();
    process.exitCode = 1;
  }
}

startServer()
