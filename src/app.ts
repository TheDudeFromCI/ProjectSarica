import mineflayer from "mineflayer";
import { Entity } from "prismarine-entity";
import { InterestDatabase } from "./Interest";

const args = require("minimist")(process.argv.slice(2));

console.log(`Starting bot '${args.login}' on ${args.host}:${args.port || 25565}`);
const bot = mineflayer.createBot({
    username: args.login,
    password: args.password,
    host: args.host,
    port: args.port,
});

new InterestDatabase(bot);
let initialized: boolean = false;
let ready: boolean = false;

bot.loadPlugin(require('mineflayer-pathfinder').pathfinder);

bot.on("chat", (username, message) => onChat(username, message));
bot.on("entityHurt", (entity) => onEntityHurt(entity));
bot.on("spawn", () => onSpawn());
bot.on("kicked", () => onKick());

/**
 * Checks if this bot has spawned in the world and is ready to be used.
 * Returns false if the bot is not yet logged in, or is kicked from the server.
 */
function isReady(): boolean
{
    return ready;
}

/**
 * Called when the bot spawns in the world, or respawns after dying.
 */
function onSpawn(): void
{
    ready = true;

    if (initialized) return;
    initialized = true;

    logStats();
}

/**
 * Causes this bot to log itself out.
 */
function logout(): void
{
    onKick();
    bot.quit();
}

/**
 * Called when the bot is kicked from the server.
 */
function onKick(): void
{
    ready = false;
}

/**
 * Logs debug information about the server when first connecting to the server.
 */
function logStats(): void
{
    console.log(`Joined server.`);
    console.log(`Username: ${bot.username}`);
    console.log(`Game Mode: ${bot.game.gameMode}`);
    console.log(`World: ${bot.game.dimension}`);
    console.log(`Difficulty: ${bot.game.difficulty}`);
    console.log(`Version: ${bot.version}`);

    let playerNames = Object.keys(bot.players);
    console.log(`Online Players: ${playerNames.length}`);

    for (let playerName of playerNames)
        console.log(`  - ${playerName}`);
}

/**
 * Called when a user writes a message in chat.
 * 
 * @param username - The username of the sender.
 * @param message - The message.
 */
function onChat(username: string, message: string): void
{
    if (username === bot.username) return;
    bot.chat(message);
}

/**
 * Called when an entity is damaged.
 * 
 * @param entity - The entity that was damaged.
 */
function onEntityHurt(entity: Entity): void
{
    if (entity !== bot.entity) return;
    bot.chat("Ow!");
}
