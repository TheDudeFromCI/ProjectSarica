import { Vec3 } from "vec3";
import { Entity } from "prismarine-entity";
import { Bot } from "mineflayer";

/**
 * A data object representing the mental stimuli that the bot feels toward an object.
 */
export class Interest
{
    private value: number;

    /**
     * Creates a new interest object which defaults to 0.
     */
    constructor()
    {
        this.value = 0;
    }

    /**
     * Gets the total interest value on the object.
     */
    getValue(): number
    {
        return this.value;
    }

    /**
     * Sets the interest value on the object.
     * 
     * @param value - The interest value.
     */
    setValue(value: number): void
    {
        this.value = value;
    }
}

/**
 * An object which that bot can be interested in.
 */
export interface InterestHolder
{
    /**
     * Gets the position the bot should look at when interested in this object.
     */
    getLookPosition(): Vec3;

    /**
     * Gets the current interest in this object.
     */
    getInterest(): Interest;
}

/**
 * A collection of all of the objects which the bot is considering when
 * evaluating interest.
 */
export class InterestDatabase
{
    private readonly interestHolders: Array<InterestHolder> = new Array<InterestHolder>();
    private readonly entities: Array<EntityInterestHolder> = new Array();
    readonly bot: Bot;

    /**
     * Creates a new interest database.
     * 
     * @param bot - The bot this interest database is for.
     */
    constructor(bot: Bot)
    {
        this.bot = bot;

        this.bot.on("entitySpawn", (e) => this.onEntitySpawned(e));
        this.bot.on("entityGone", (e) => this.onEntityDespawned(e));
    }

    /**
     * Adds a new interest holder to this database, to be considered.
     * 
     * @param interestHolder - The interest holder to add.
     */
    addInterestHolder(interestHolder: InterestHolder): void
    {
        this.interestHolders.push(interestHolder);
    }

    /**
     * Removes an interest holder from this database.
     * 
     * @param interestHolder - The interest holder to remove.
     */
    removeInterestHolder(interestHolder: InterestHolder): void
    {
        const index = this.interestHolders.indexOf(interestHolder, 0);
        if (index > -1)
            this.interestHolders.splice(index, 1);
    }

    /**
     * Gets the most interesting object in this list.
     * 
     * @returns The most interesting object, or null if this list is empty.
     */
    getMostInteresting(): InterestHolder | null
    {
        if (this.interestHolders.length == 0)
            return null;

        let best = this.interestHolders[0];
        let value = best.getInterest().getValue();

        for (let i = 1; i < this.interestHolders.length; i++)
        {
            let newValue = this.interestHolders[i].getInterest().getValue();
            if (newValue > value)
            {
                best = this.interestHolders[i];
                value = newValue;
            }
        }

        return best;
    }

    /**
     * Called when a new entity is added to the world.
     * 
     * @param entity - The entity which was spawned.
     */
    private onEntitySpawned(entity: Entity): void
    {
        if (!entity || entity === this.bot.entity)
            return;

        console.log(`Registered new entity '${entity.displayName}' to interest database.`);

        const holder = new EntityInterestHolder(this.bot, entity);
        this.entities.push(holder);

        this.addInterestHolder(holder);
    }

    /**
     * Called when a new entity is remove from the world.
     *
     * @param entity - The entity which was spawned.
     */
    private onEntityDespawned(entity: Entity): void
    {
        if (!entity || entity === this.bot.entity)
            return;

        console.log(`Unregistered entity '${entity.displayName}' from interest database.`);

        let holder = this.getEntityInterestHolder(entity);

        if (holder)
            this.removeInterestHolder(holder);
    }

    /**
     * Gets the interest holder for the given entity.
     * 
     * @param entity - The entity.
     */
    private getEntityInterestHolder(entity: Entity): EntityInterestHolder | null
    {
        for (let i = 0; i < this.entities.length; i++)
            if (this.entities[i].entity === entity)
                return this.entities[i];

        return null;
    }
}

/**
 * A wrapper for entities which can hold the bot's interest.
 */
class EntityInterestHolder implements InterestHolder
{
    private readonly interest: Interest = new Interest();
    readonly bot: Bot;
    readonly entity: Entity;

    constructor(bot: Bot, entity: Entity)
    {
        this.bot = bot;
        this.entity = entity;
    }

    getLookPosition(): typeof Vec3
    {
        // @ts-ignore
        return this.entity.position.offset(0, this.entity.height, 0);
    }

    getInterest(): Interest
    {
        // @ts-ignore
        let distance = this.entity.position.distanceTo(this.bot.entity.position);
        distance = 5 / distance; // scale interest inversely with distance.

        // TODO Set interest to 0 if bot can't see entity.

        this.interest.setValue(distance);
        return this.interest;
    }

}
