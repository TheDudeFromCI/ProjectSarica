const mineflayer = require('mineflayer');
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const sm = require('mineflayer-statemachine');

const bot = mineflayer.createBot({
    host: "localhost",
    port: process.argv[2],
    username: "Sarica",
});

sm.globalSettings.debugMode = true;
bot.loadPlugin(pathfinder);

bot.once('spawn', () =>
{
    const root = rootState();
    const fsm = new sm.BotStateMachine(bot, root);

    const webserver = new sm.StateMachineWebserver(bot, fsm);
    webserver.startServer();
});

function rootState()
{
    const targets = {};
    const mine = require('./src/mine')(bot, targets);

    const printStats = new sm.BehaviorPrintServerStats(bot);
    const main = new sm.BehaviorIdle();
    main.stateName = 'Waiting for Command';

    const transitions = [

        new sm.StateTransition({ // 0
            parent: printStats,
            child: main,
            shouldTransition: () => true,
        }),

        new sm.StateTransition({ // 1
            parent: main,
            child: mine,
        }),

        new sm.StateTransition({ // 2
            parent: mine,
            child: main,
            shouldTransition: () => mine.isFinished(),
            onTransition: () => console.log("Finished mining."),
        }),
    ];

    bot.on('chat', (username, message) =>
    {
        if (username === bot.username) return;

        if (message === 'mine')
            transitions[1].trigger();
    });

    const n = new sm.NestedStateMachine(transitions, printStats);
    n.stateName = 'Main';
    return n;
}
