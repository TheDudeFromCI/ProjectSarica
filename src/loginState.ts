import { StateBehavior, BehaviorIdle } from "mineflayer-statemachine";
import { Bot } from "mineflayer";

/**
 * A simple state which represents a bot that is waiting to
 * finish logging in.
 */
export class BehaviorLogin extends BehaviorIdle
{
    private readonly bot: Bot;
    private printedDebug: boolean = false;
    readonly stateName: string = "Login";

    /**
     * Creates a new login behavior state.
     * 
     * @param bot - The bot this behavior is acting on.
     */
    constructor(bot: Bot)
    {
        super();
        this.bot = bot;
        this.bot.on("spawn", () => this.onSpawn());
    }

    /**
     * Called when the bot spawns in the server, or respawns after death.
     */
    private onSpawn(): void
    {
        if (this.printedDebug)
            return;

        this.logStats();
    }

    /**
     * Logs debug information about the server when first connecting to
     * the server.
     */
    private logStats(): void
    {
        this.printedDebug = true;

        console.log(`Joined server.`);
        console.log(`Username: ${this.bot.username}`);
        console.log(`Game Mode: ${this.bot.game.gameMode}`);
        console.log(`World: ${this.bot.game.dimension}`);
        console.log(`Difficulty: ${this.bot.game.difficulty}`);
        console.log(`Version: ${this.bot.version}`);

        let playerNames = Object.keys(this.bot.players);
        console.log(`Online Players: ${playerNames.length}`);

        for (let playerName of playerNames)
            console.log(`  - ${playerName}`);
    }

    /**
     * Checks if the bot has finished logging it.
     * 
     * @returns True if the bot has logged in.
     */
    isLoggedIn(): boolean
    {
        return this.printedDebug;
    }
}