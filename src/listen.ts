import { dbPromise, seedDatabase } from './database';
import app from "./server";

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  const db = await dbPromise;
  await seedDatabase(db);
  console.log(`[server]: Server is running at http://localhost:${port}`);
});