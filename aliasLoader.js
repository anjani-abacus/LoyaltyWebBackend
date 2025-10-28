import { register } from "node:module";
import { pathToFileURL } from "node:url";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

register("./alias.mjs", pathToFileURL("./"));

const args = process.argv.slice(2);
const envArg = args.find((arg) => arg.startsWith("--env="));
const env = envArg ? envArg.split("=")[1] : process.env.NODE_ENV || "development";


const envFile = `.env.${env}`;
const envPath = path.resolve(process.cwd(), envFile);

if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: true });
    console.log(` Loaded ${envFile}`);
} else {
    console.warn(`⚠️  No ${envFile} found`);
}

