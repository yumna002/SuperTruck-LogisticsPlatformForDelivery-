import { setupSeeders } from "src/database/seeds/setup/seedersSetup";
import { Connection } from 'typeorm';



export async function setupApp(app) {
  await app.get(Connection).synchronize(true);
  await setupSeeders(app);
}
