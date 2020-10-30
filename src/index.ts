import { initializeNewBot } from './BotLoader';

if (process.argv.length < 4 || process.argv.length > 6)
{
    console.log('Usage: npm <host> <port> [username] [password]');
    process.exit(1);
}

initializeNewBot(process.argv[2], parseInt(process.argv[3]), process.argv[4], process.argv[5]);
