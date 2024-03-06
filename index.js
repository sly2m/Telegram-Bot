require ('dotenv').config();
const { Bot, GrammyError, HttpError } = require ('grammy');

const bot = new Bot (process.env.BOT_API_KEY);

//  myCommands 

bot.api.setMyCommands([
    {command: 'start', description: 'Начало работы'},
    {command: 'id', description: 'Показать свой Telegram ID'}  
]);

// Commands

bot.command('start', async (ctx) => {
    await ctx.react('👍');
    await ctx.reply('Привет! Я бот написанный пользователем sly2m. https://t.me/sly_grammy_bot', {
        parse_mode: 'HTML',
        disable_web_page_preview: false   
    });
});

bot.command(['ID', 'id', 'Id', 'iD'], async (ctx) => {
    await ctx.reply(`Telegram ID пользователя ${ctx.msg.from.username} - ${ctx.msg.from.id}`);
});

// Messages

bot.hears([/пипец/, /поц/], async (ctx) => {
   await ctx.reply('Ругательства запрещены!');
});

bot.on('msg', async (ctx) => {
    console.log(ctx.msg);   
 });


bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while hadling update ${ctx.update.update_id}:`);    
    const e = err.error;

    if (e instanceof GrammyError) {
        console.error("Error in request: ", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not connect to Telegram", e);
    } else {
        console.error("Unknown error: ", e);
    }

});

bot.start();