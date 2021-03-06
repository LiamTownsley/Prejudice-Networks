const { msToString } = require('../modules/functions');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '\n > ',
});

module.exports = (bot) => {
    if(process.argv[2] == '--test') {
        bot.destroy();  
    } 
    
    bot.user.setActivity('Predjudice Networks', {
        type: 'WATCHING',
    });

    bot.log('The bot is now \x1b[36mready\x1b[0m. View some information below:');
    bot.log('Status: \x1b[36mWatching Prejudice Networks\x1b[0m');
    bot.log(`Total Guild Members: \x1b[36m${bot.users.cache.array().length}\x1b[0m`);
    bot.log(`Raid Status: \x1b[36m${bot.raid}\x1b[0m`);
    bot.log(`Loading took: ${msToString(new Date() - bot.loadingStarted)}`);
    const guild = bot.guilds.cache.get('721112680848556034');
    function updateMembers() {
        const memberCount = guild.members.cache.filter(member => !member.user.bot).size;
        const memberCountChannel = bot.channels.cache.get('722650147397566464');
        if (memberCountChannel.name == `Guild Members: ${memberCount}`) return;
        memberCountChannel.setName(`Guild Members: ${memberCount || '...'}`);
    }
    function updateBans() {
        guild.fetchBans()
            .then(bans => {
                const banCount = bans.array().length;
                const banCountChannel = bot.channels.cache.get('722650236132130818');
                if (banCountChannel.name == `Guild Bans: ${banCount}`) return;
                banCountChannel.setName(`Guild Bans: ${banCount || '...'}`);
            });
    }

    function askEval() {
        rl.question('\x1b[36m>\x1b[0m ', function(input) {
            try {
                if(input == 'exit') return process.exit();
                let evaled = eval(input);

                if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
                askEval();
            }
            catch (err) {
                console.log('ERROR:\n' + err);
                askEval();
            }
        });
    }
    askEval();

    updateMembers();
    updateBans();
    setInterval(updateMembers, 60000 * 5);
    setInterval(updateBans, 60000 * 5);
};

