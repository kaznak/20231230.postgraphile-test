import "dotenv/config";
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { makePgService } from "postgraphile/adaptors/pg";

const env = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  connectionString: process.env.CONNECTION_STRING || "postgres:///my_db",
};

/** @type {GraphileConfig.Preset} */
const preset = {
  extends: [PostGraphileAmberPreset],
  grafserv: { port: env.port },
  pgServices: [makePgService({ connectionString: env.connectionString })],
};

export default preset;
