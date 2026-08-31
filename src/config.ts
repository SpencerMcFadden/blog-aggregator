import fs from "fs";
import os from "os";
import path from "path";

export function setUser(username: string): void {
  const config = readConfig();
  config.currentUserName = username;
  writeConfig(config);
}

export function readConfig(): Config {
  const config = fs.readFileSync(getConfigFilePath(), "utf-8");
  const rawConfig = JSON.parse(config);
  return validateConfig(rawConfig);
}

function getConfigFilePath(): string {
  return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(config: Config): void {
  const filePath = getConfigFilePath();
  const snakeCase = {
    db_url: config.dbUrl,
    current_user_name: config.currentUserName,
  };
  const configString = JSON.stringify(snakeCase, null, 2);
  fs.writeFileSync(filePath, configString, { encoding: "utf-8" });
}

function validateConfig(rawConfig: any): Config {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("db_url is required in config file");
  }
  return { dbUrl: rawConfig.db_url, currentUserName: rawConfig.current_user_name ?? "" };
}

type Config = {
  dbUrl: string;
  currentUserName: string;
};
