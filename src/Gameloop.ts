import { setInterval } from "timers";

let updateListeners: Array<Function> = new Array();
let gameLoop: NodeJS.Timeout;

/**
 * Runs the logic code every Minecraft tick.
 */
function update(): void
{
    for (let i = 0; i < updateListeners.length; i++)
        updateListeners[i]();
}

/**
 * Starts the game loop timer.
 */
export function start(): void
{
    gameLoop = setInterval(() => update(), 50);
}

/**
 * Stops the game loop and clears all listeners.
 */
export function stop(): void
{
    clearInterval(gameLoop);
    updateListeners = new Array();
}

/**
 * Adds a function to this game loop to be run every tick.
 * @param func - The function to be run.
 */
export function addListener(func: Function): void
{
    updateListeners.push(func);
}
