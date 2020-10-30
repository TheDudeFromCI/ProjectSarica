import { default as armorManagerPlugin } from 'mineflayer-armor-manager';
import { pathfinder as pathfinderPlugin } from 'mineflayer-pathfinder';
import { plugin as pvpPlugin } from 'mineflayer-pvp';
import { plugin as collectBlockPlugin } from 'mineflayer-collectblock';
import { plugin as cmdPlugin } from 'mineflayer-cmd';
import { plugin as toolPlugin } from 'mineflayer-tool';
import { loadPrismarineViewer } from './PrismarineViewer';
import { loadStateMachine } from './StateMachine';
import { createBot, Bot } from 'mineflayer';

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
    
    loadPrismarineViewer(bot);
    loadStateMachine(bot);

    return bot;
}