import mineflayer from "mineflayer";
import { BehaviorLogin } from "./loginState";
import { BehaviorLookAtEntities, EntityFilters, StateTransition, BotStateMachine, StateTransitionParameters } from "mineflayer-statemachine";

const args = require("minimist")(process.argv.slice(2));

console.log(`Starting bot '${args.login}' on ${args.host}:${args.port || 25565}`);
const bot = mineflayer.createBot({
    username: args.login,
    password: args.password,
    host: args.host,
    port: args.port,
});

// bot.loadPlugin(require('mineflayer-pathfinder').pathfinder);

const loginState = new BehaviorLogin(bot);

//@ts-ignore
const lookAtPlayers = new BehaviorLookAtEntities(bot, EntityFilters().PlayersOnly);

const transitions = [

    new StateTransition({
        parent: loginState,
        child: lookAtPlayers,
        shouldTransition: () => loginState.isLoggedIn(),
        onTransition: () => { }
    }),

    new StateTransition({
        parent: loginState,
        child: lookAtPlayers,
        shouldTransition: () => false,
        onTransition: () => { }
    })

];

new BotStateMachine(bot, transitions, loginState);