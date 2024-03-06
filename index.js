require('dotenv').config();
const {
  Bot,
  GrammyError,
  HttpError,
  Keyboard,
  InlineKeyboard,
} = require('grammy');
const { hydrate } = require('@grammyjs/hydrate');

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());

//  myCommands

bot.api.setMyCommands([
  { command: 'start', description: 'Начало работы' },
  { command: 'id', description: 'Показать свой Telegram ID' },
  { command: 'mood', description: 'Узнать настроение' },
  { command: 'share', description: 'Поделиться данными' },
  { command: 'menu', description: 'Вызывать меню' }
]);

// Commands

bot.command('start', async (ctx) => {
  await ctx.react('👍');
  await ctx.reply(
    'Привет! Я бот написанный пользователем sly2m. https://t.me/sly_grammy_bot',
    {
      parse_mode: 'HTML',
      disable_web_page_preview: false,
    }
  );
});

bot.command(['ID', 'id', 'Id', 'iD'], async (ctx) => {
  await ctx.reply(
    `Telegram ID пользователя ${ctx.msg.from.username} - ${ctx.msg.from.id}`
  );
});

bot.command('mood', async (ctx) => {
  const keyboard = new Keyboard()
    .text('Хорошо')
    .row()
    .text('Средне')
    .row()
    .text('Плохо')
    .resized()
    .oneTime();
  await ctx.reply('Как настроение?', {
    reply_markup: keyboard,
  });
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

bot.command('keyboard', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('1', 'button-1')
    .row()
    .text('2', 'button-2')
    .row()
    .text('3', 'button-3');

  await ctx.reply('Выбери кнопку', {
    reply_markup: keyboard,
  });
});

bot.callbackQuery(/button-[1-3]/, async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(`Ты нажал кнопку: ${ctx.callbackQuery.data}`);
});

bot.command('jump', async (ctx) => {
  const keyboard = new InlineKeyboard().url(
    'Перейти google.com',
    'https://google.com'
  );
  await ctx.reply('Уйти из телеграма?', {
    reply_markup: keyboard,
  });
});

const menuKeyboard = new InlineKeyboard()
  .text('Узнать статус заказа', 'status')
  .row()
  .text('Помощь', 'support');

const backKeyboard = new InlineKeyboard().text('< Назад в меню', 'back');

bot.command('menu', async (ctx) => {
  await ctx.reply('Выберите пункт меню', {
    reply_markup: menuKeyboard,
  });
});

bot.callbackQuery('status', async (ctx) => {
    await ctx.callbackQuery.message.editText('Статус заказа: в пути', {
    reply_markup: backKeyboard,
    });
await ctx.answerCallbackQuery();
});

bot.callbackQuery('support', async (ctx) => {
    await ctx.callbackQuery.message.editText('Напишите Ваш запрос', {
        reply_markup: backKeyboard,
    });
    await ctx.answerCallbackQuery();
});  

bot.callbackQuery('back', async (ctx) => {
    await ctx.callbackQuery.message.editText('Выберете пункт меню', {
        reply_markup: menuKeyboard,
    });
    await ctx.answerCallbackQuery();
});  

// Messages

bot.hears('Хорошо', async (ctx) => {
  await ctx.reply('Ура!');
});

bot.hears(['Средне', 'Плохо'], async (ctx) => {
  await ctx.reply('Не ура.');
});

bot.hears([/пипец/, /поц/], async (ctx) => {
  await ctx.reply('Ругательства запрещены!');
});

bot.on(':contact', async (ctx) => {
  await ctx.reply('Спасибо за контакт!');
});

bot.on('msg', async (ctx) => {
  console.log(ctx.msg);
});

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

bot.start();
