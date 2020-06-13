import { Entity } from "prismarine-entity";
import { Bot } from "mineflayer";
import { Movements, goals } from "mineflayer-pathfinder";

/**
 * A collection of all of the objects which the bot is considering when
 * evaluating interest.
 */
export class InterestDatabase
{
    readonly bot: Bot;

    /**
     * Creates a new interest database.
     * 
     * @param bot - The bot this interest database is for.
     */
    constructor(bot: Bot)
    {
        this.bot = bot;

        // @ts-ignore
        this.bot.on("physicTick", () => this.onTick());
    }

    /**
     * Gets the most interesting object in this list.
     * 
     * @returns The most interesting object, or null if this list is empty.
     */
    getMostInteresting(): Entity | null
    {
        const entities = Object.keys(this.bot.entities);

        let best = null;
        let value = 0;

        for (let entityName of entities)
        {
            let entity = this.bot.entities[entityName];

            if (entity === this.bot.entity)
                continue;

            let newValue = this.calculateEntityInterest(entity);

            if (!best || newValue > value)
            {
                best = entity;
                value = newValue;
            }
        }

        return best;
    }

    private calculateEntityInterest(entity: Entity): number
    {
        // @ts-ignore
        let distance = entity.position.distanceTo(this.bot.entity.position);
        distance = 5 / distance; // scale interest inversely with distance.

        // TODO Set interest to 0 if bot can't see entity.

        return distance;
    }

    /**
     * Moves the bot toward the interest holder.
     * 
     * @param holder - The interest holder the bot is focused on.
     */
    private updateMove(entity: Entity): void
    {
        if (entity === this.followTarget)
            return;

        this.followTarget = entity;

        const mcData = require('minecraft-data')(this.bot.version);
        const defaultMove = new Movements(this.bot, mcData);
        defaultMove.digCost = 1;
        defaultMove.allow1by1towers = true;
        defaultMove.maxDropDown = 4;

        // @ts-ignore
        this.bot.pathfinder.setMovements(defaultMove);

        let distance = 1.5;
        if (entity.entityType === mcData.entitiesByName.item.id
            || entity.entityType === mcData.entitiesByName.arrow.id)
            distance = 0;

        const goal = new goals.GoalFollow(entity, distance);

        // @ts-ignore
        this.bot.pathfinder.setGoal(goal, true);
    }
    private followTarget?: Entity;

    private onTick(): void
    {
        // if (!isReady()) return;

        let entity = this.getMostInteresting();
        if (entity)
        {
            // @ts-ignore
            let editing = this.bot.pathfinder.isMining() || this.bot.pathfinder.isBuilding();
            if (!editing)
            {
                // @ts-ignore
                this.bot.lookAt(entity.position.offset(0, entity.height, 0));
            }

            this.updateMove(entity);
        }
        // @ts-ignore
        this.bot.lookAt(entity.position.offset(0, entity.height, 0));

    }
}
