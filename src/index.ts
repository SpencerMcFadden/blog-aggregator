import { setUser, readConfig } from "./config.js";

function main() {
  setUser("Spencer");
  console.log(readConfig());
}

main();
