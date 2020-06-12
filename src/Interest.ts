import { Vec3 } from "vec3";

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
    private interestHolders: Array<InterestHolder> = new Array<InterestHolder>();

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
}
