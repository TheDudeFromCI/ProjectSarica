import { default as armorManagerPlugin } from 'mineflayer-armor-manager';
import { pathfinder as pathfinderPlugin } from 'mineflayer-pathfinder';
import { plugin as pvpPlugin } from 'mineflayer-pvp';
import { plugin as collectBlockPlugin } from 'mineflayer-collectblock';
import { plugin as cmdPlugin } from 'mineflayer-cmd';
import { plugin as toolPlugin } from 'mineflayer-tool';
import { loadPrismarineViewer } from './PrismarineViewer';
import { loadStateMachine } from './StateMachine';
import { createBot, Bot } from 'mineflayer';

// @ts-expect-error ; dashboard does not have a typescript header yet
import { default as dashboardPlugin } from 'mineflayer-dashboard';

export function initializeNewBot(host: string, port: number, username: string, password?: string): Bot
{
    const bot = createBot({
        host: host,
        port: port,
        username: username,
        password: password,
    });
    
    bot.loadPlugin(pvpPlugin);
    bot.loadPlugin(armorManagerPlugin);
    bot.loadPlugin(collectBlockPlugin);
    bot.loadPlugin(pathfinderPlugin);
    bot.loadPlugin(cmdPlugin);
    bot.loadPlugin(toolPlugin);
    bot.loadPlugin(dashboardPlugin);

    // Fix dashboard logging
    bot.once('spawn', () => {
        // @ts-expect-error
        global.console.log = bot.dashboard.log

        // @ts-expect-error
        global.console.error = bot.dashboard.log
    })
    
    loadPrismarineViewer(bot);
    loadStateMachine(bot);

    return bot;
}