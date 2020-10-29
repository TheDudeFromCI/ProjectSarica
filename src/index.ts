import * as mineflayer from 'mineflayer';
import { default as armorManagerPlugin} from 'mineflayer-armor-manager';
import { pathfinder as pathfinderPlugin} from 'mineflayer-pathfinder';
import { plugin as pvpPlugin } from 'mineflayer-pvp';
import { plugin as collectBlockPlugin } from 'mineflayer-collectblock';
import { plugin as cmdPlugin } from 'mineflayer-cmd';
import { plugin as toolPlugin } from 'mineflayer-tool';
import { loadPrismarineViewer } from './PrismarineViewer';

if (process.argv.length < 4 || process.argv.length > 6)
{
    console.log('Usage: <host> <port> [username] [password]');
    process.exit(1);
}

const bot = mineflayer.createBot({
    host: process.argv[2],
    port: parseInt(process.argv[3]),
    username: process.argv[4],
    password: process.argv[5],
});

bot.loadPlugin(pvpPlugin);
bot.loadPlugin(armorManagerPlugin);
bot.loadPlugin(collectBlockPlugin);
bot.loadPlugin(pathfinderPlugin);
bot.loadPlugin(cmdPlugin);
bot.loadPlugin(toolPlugin);

loadPrismarineViewer(bot);