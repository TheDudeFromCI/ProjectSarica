import { Bot } from "./Bot";

const args = require("minimist")(process.argv.slice(2));
if (args.port === undefined) args.port = 25565;

const b = new Bot(args.login, args.host, args.port, args.password);
