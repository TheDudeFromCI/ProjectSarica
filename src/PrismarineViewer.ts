import { Bot } from 'mineflayer';
import * as config from './Config';

// @ts-expect-error ; p-viewer doesn't have typescript headers, yet.
import { mineflayer as startPViewer } from 'prismarine-viewer';

export function loadPrismarineViewer(bot: Bot): void
{
    bot.once('spawn', () => {
        const options = config.getObject('viewer', { port: 3000 });
        startPViewer(bot, options);
    })
}