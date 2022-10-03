import { config as dotenvconfig } from "dotenv";

dotenvconfig();

export const config = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || "thisisalongstring",
};

export default config;
