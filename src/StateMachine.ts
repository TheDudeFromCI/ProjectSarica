import { Bot } from 'mineflayer';

import { StateTransition, BotStateMachine, NestedStateMachine,
         StateBehavior, BehaviorIdle, BehaviorPrintServerStats } from 'mineflayer-statemachine';

/**
 * Creates a new state transition from the parent to the child.
 * 
 * @param parent - The parent state.
 * @param child - The child state.
 * @param name - The name of this transition.
 * @param shouldTransition - The function to run each frame to check if a transition should occur.
 * @param onTransition - A function called when the transition is triggered.
 */
function trans(parent: StateBehavior, child: StateBehavior, name: string, shouldTransition = () => false, onTransition = () => {}): StateTransition
{
    return new StateTransition({
        parent: parent,
        child: child,
        name: name,
        shouldTransition: shouldTransition,
        onTransition: onTransition,
    });
}

/**
 * Creates the default state machine for the bot.
 * 
 * @param bot - The bot.
 */
function createState(bot: Bot): void
{
    const printServerStats = new BehaviorPrintServerStats(bot);
    const defaultState = new BehaviorIdle();

    const transitions: StateTransition[] = [
        trans(printServerStats, defaultState, 'Finish Printing Server Stats', () => true)
    ];

    const rootLayer = new NestedStateMachine(transitions, printServerStats);
    new BotStateMachine(bot, rootLayer);
}

/**
 * Loads the state machine for the given bot.
 * This triggers the state machine to be loaded once the bot has spawned.
 * 
 * @param bot - The bot to load the state machine for.
 */
export function loadStateMachine(bot: Bot): void
{
    bot.once('spawn', () => createState(bot));
}