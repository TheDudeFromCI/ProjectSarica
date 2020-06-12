import { Bot } from "./Bot";
import { startGameLoop, addUpdateEvent } from "./Gameloop";

const args = require("minimist")(process.argv.slice(2));
const b = new Bot(args.login, args.host, args.port, args.password);
addUpdateEvent(() =>
{
    if (b.isReady())
        b.lookAtEntity(b.bot.players.TheDudeFromCI.entity)
});

startGameLoop();