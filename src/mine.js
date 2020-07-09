const sm = require('mineflayer-statemachine');

function enterState()
{
    const enter = new sm.BehaviorIdle();
    enter.stateName = 'Starting to Mine';
    return enter;
}

function exitState()
{
    const exit = new sm.BehaviorIdle();
    exit.stateName = 'Finished Mining';
    return exit;
}

function findOreState(bot, targets, mcData)
{
    const findOre = new sm.BehaviorFindBlock(bot, targets);
    findOre.stateName = 'Find Ore';

    findOre.blocks = [

        // Over world
        mcData.blocksByName.diamond_ore.id,
        mcData.blocksByName.coal_ore.id,
        mcData.blocksByName.iron_ore.id,
        mcData.blocksByName.gold_ore.id,
        mcData.blocksByName.emerald_ore.id,
        mcData.blocksByName.redstone_ore.id,
        mcData.blocksByName.lapis_ore.id,

        // Nether
        mcData.blocksByName.nether_quartz_ore.id,
        // mcData.blocksByName.nether_gold_ore?.id || -1, // 1.16
        // mcData.blocksByName.ancient_debris?.id || -1, // 1.16
    ];

    return findOre;
}

function findMiningPositionState(bot, targets)
{
    const findMiningPosition = new sm.BehaviorFindInteractPosition(bot, targets);
    findMiningPosition.stateName = 'Find Mining Position';

    return findMiningPosition;
}

function moveToOreState(bot, targets)
{
    const moveToOre = new sm.BehaviorMoveTo(bot, targets);
    moveToOre.stateName = 'Moving to Ore';

    return moveToOre;
}

function mineOreState(bot, targets)
{
    const mineOre = new sm.BehaviorMineBlock(bot, targets);
    mineOre.stateName = 'Mine Ore';

    return mineOre;
}

module.exports = function (bot, targets)
{
    const mcData = require('minecraft-data')(bot.version);

    const enter = enterState();
    const findOre = findOreState(bot, targets, mcData);
    const findMiningPosition = findMiningPositionState(bot, targets);
    const moveToOre = moveToOreState(bot, targets);
    const mineOre = mineOreState(bot, targets);
    const exit = exitState();

    const transitions = [

        new sm.StateTransition({
            parent: enter,
            child: findOre,
            shouldTransition: () => true,
        }),

        new sm.StateTransition({
            parent: findOre,
            child: exit,
            shouldTransition: () => targets.position === undefined,
            onTransition: () => console.log("Can't mine; no ore in area."),
        }),

        new sm.StateTransition({
            parent: findOre,
            child: findMiningPosition,
            shouldTransition: () => true,
            onTransition: () => targets.oreLoc = targets.position, // Move to temp
        }),

        new sm.StateTransition({
            parent: findMiningPosition,
            child: moveToOre,
            shouldTransition: () => true,
            onTransition: () => console.log("Moving to " + targets.position + " to mine " + targets.oreLoc),
        }),

        new sm.StateTransition({
            parent: moveToOre,
            child: mineOre,
            // shouldTransition: () => moveToOre.isFinished,
            shouldTransition: () => moveToOre.distanceToTarget() < 0.5,
            onTransition: () => targets.position = targets.oreLoc, // Retrieve from temp
        }),


        new sm.StateTransition({
            parent: mineOre,
            child: findOre,
            shouldTransition: () => mineOre.isFinished,
            onTransition: () => console.log("Finished mining ore."),
        }),

    ];

    const n = new sm.NestedStateMachine(transitions, enter, exit);
    n.stateName = 'Mine';
    return n;
};
