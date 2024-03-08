require('dotenv').config();
const {
  Bot,
  GrammyError,
  HttpError,
  Keyboard,
  InlineKeyboard,
} = require('grammy');

const bot = new Bot(process.env.BOT_API_KEY);
const { getStockInfo, getStockNews } = require('./stock');

const stockAPIKey = process.env.STOCK_API_KEY;

//  myCommands

bot.api.setMyCommands([
  { command: 'start', description: 'Начало работы' },
  { command: 'id', description: 'Показать свой Telegram ID' },
  { command: 'share', description: 'Поделиться данными' },
  { command: 'stock', description: 'Цена акций компании "четырехбуквенный код NASDAQ"' },
  { command: 'news', description: 'Новости о компании "четырехбуквенный код NASDAQ"' },
]);

// Commands

bot.command('start', async (ctx) => {
  await ctx.react('👍');
  await ctx.reply(
    '<b>Привет! Я бот написанный пользователем sly2m.</b> https://t.me/sly_bot',
    {
      parse_mode: 'HTML',
    }
  );
});

bot.command(['ID', 'id', 'Id', 'iD'], async (ctx) => {
  await ctx.reply(`Твой Telegram ID: ${ctx.msg.from.id}`);
});

bot.command(['stock'], async (ctx) => {
  const symbol = ctx.match.toUpperCase();
  if (!symbol) {
    await ctx.reply('После команды требуется указать код компании.');
    return;
  }

  const stockInfo = await getStockInfo(symbol, stockAPIKey);
  if (!stockInfo) {
    await ctx.reply(`Не удалось получить информацию об акциях ${symbol}.`);
    return;
  } else {
    try {
      const data = await stockInfo.json();
      if (data.last[0]) {
        console.log(data);
        await ctx.reply(`Цена за акцию <b>${symbol}</b> сегодня ${data.last[0]} USD`,
        {
          parse_mode: 'HTML',
        });
        return;
      }      
    } catch (error) {
      console.error(`Ошибка при получении информации об акциях ${symbol} `, error);
      await ctx.reply(`Ошибка при получении информации об акциях ${symbol} `);
    }
  }
});

bot.command(['news'], async (ctx) => {
  const symbol = ctx.match.toUpperCase();
  if (!symbol) {
    await ctx.reply('После команды требуется указать код компании..');
    return;
  }

  const stockNews = await getStockNews(symbol, stockAPIKey);
  if (!stockNews) {
    await ctx.reply(`Не удалось получить новости о компании ${symbol}.`);
    return;
  } else {
    try {
      const data = await stockNews.json();
      if (data.headline[0]) {
        console.log(data);
        await ctx.reply(`Последние новости <b>${symbol}</b> на сегодня.`,
        {
          parse_mode: 'HTML',
        });      
        await ctx.reply(`<a href="${data.source[0]}">${data.source[0]}</a>`,
        {
          parse_mode: 'HTML',
        });
        return;
      }      
    } catch (error) {
      console.error(`Ошибка при получении информации о компании ${symbol} `, error);
      await ctx.reply(`Ошибка при получении информации о компании ${symbol} `);
    }
  }
});

bot.command('share', async (ctx) => {
  let keyboard = null;
  if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
    await ctx.reply('Данная команда доступна только в приватном чате.');
    return;
  } else {
    keyboard = new Keyboard()
      .requestLocation('Геолокация')
      .requestContact('Контакт')
      .requestPoll('Опрос')
      .placeholder('Выбери тип данных...')
      .resized()
      .oneTime();
  }

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

bot.on(':location', async (ctx) => {
  await ctx.reply('Спасибо за геолокацию!');
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
