require('dotenv').config();
const { Bot, GrammyError, HttpErrorm, Keyboard, InlineKeyboard } = require('grammy');

const bot = new Bot(process.env.BOT_API_KEY);

//  myCommands

bot.api.setMyCommands([
  { command: 'start', description: 'Начало работы' },
  { command: 'id', description: 'Показать свой Telegram ID' },
  { command: 'share', description: 'Поделиться данными' }
]);

// Commands

bot.command('start', async (ctx) => {
  await ctx.react('👍');
  await ctx.reply(
    '<b>Привет! Я бот написанный пользователем sly2m.</b> https://t.me/sly_bot',
    {
      parse_mode: 'HTML'      
    }
  );
});

bot.command(['ID', 'id', 'Id', 'iD'], async (ctx) => {
  await ctx.reply(
    `Telegram ID пользователя ${ctx.msg.from.username} - ${ctx.msg.from.id}`
  );
  console.log(ctx.msg);
  console.log(ctx.chat);
  console.log(ctx.msg.from);
});

bot.command('share', async (ctx) => {
  const keyboard = new Keyboard()
    .requestLocation('Геолокация')
    .requestContact('Контакт')
    .requestPoll('Опрос')
    .placeholder('Выбери тип данных...')
    .resized()
    .oneTime();

  await ctx.reply('Чем хочешь поделиться?', {
    reply_markup: keyboard,
  });
});

bot.command('jump', async (ctx) => {
  const keyboard = new InlineKeyboard().url(
    'Перейти google.com',
    'http://google.com'
  );
  await ctx.reply('Уйти из телеграма?', {
    reply_markup: keyboard,
  });
});

// Messages

bot.on(':contact', async (ctx) => {
  await ctx.reply('Спасибо за контакт!');
});

// Errors

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while hadling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error('Error in request: ', e.description);
  } else if (e instanceof HttpError) {
    console.error('Could not connect to Telegram', e);
  } else {
    console.error('Unknown error: ', e);
  }
});

// Start bot

bot.start();
