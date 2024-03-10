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
const { getRandomMeme } = require('./memeparser.js');
const { getAnekdot, getRandomAnekdot } = require('./joke.js');

const stockAPIKey = process.env.STOCK_API_KEY;
const memePageUrl = process.env.MEME_PAGE_URL;
const anekPageUrl = process.env.ANEK_PAGE_URL;
const anekSearchUrl = process.env.ANEK_SEARCH_URL;

//  myCommands //

bot.api.setMyCommands([
    { command: 'start', description: 'Начало работы' },
    { command: 'help', description: 'Список команд бота' },
    { command: 'id', description: 'Покажи мой Telegram ID' },
    {
        command: 'stock',
        description: 'Тикер компании, например /stock TSLA',
    },
    {
        command: 'news',
        description: 'Новости компании, например /news NVDA',
    },
    { command: 'meme', description: 'Покажи случайный мем' },
    { command: 'joke', description: 'Пошути' },
]);

const commands =
    'Для информации о цене акций компании введите /stock и тикер компании.\n' +
    'Например так: /stock TSLA\n' +
    '\n' +
    'Для новостей о компании введите /news и код компании.\n' +
    'Например так: /news NVDA\n' +
    '\n' +
    'Для случайного мема введите /meme\n' +
    '\n' +
    'Для случайной шутки введите /joke \n' +
    '\n' +
    "Для шутки на заданную тему введите /joke 'тема шутки'\n" +
    '\n' +
    'Для получения своего Telegram ID введите /id\n' +
    '\n' +
    'Чтобы увидеть список команд бота введите /help\n';

// Commands //

bot.command('start', async (ctx) => {
    await ctx.react('👍');
    await ctx.reply('<b>Поехали!</b>\n\n' + commands, { parse_mode: 'HTML' });
});

bot.command('help', async (ctx) => {
    await ctx.reply(commands, { parse_mode: 'HTML' });
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
                await ctx.reply(
                    `Цена за акцию <b>${symbol}</b> сегодня ${data.last[0]} USD`,
                    {
                        parse_mode: 'HTML',
                    }
                );
                return;
            }
        } catch (error) {
            console.error(
                `Ошибка при получении информации об акциях ${symbol} `,
                error
            );
            await ctx.reply(
                `Ошибка при получении информации об акциях ${symbol} `
            );
        }
    }
});

bot.command(['news'], async (ctx) => {
    const symbol = ctx.match.toUpperCase();
    if (!symbol) {
        await ctx.reply('После команды требуется указать код компании.');
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
                await ctx.reply(
                    `Последние новости <b>${symbol}</b> на сегодня.`,
                    {
                        parse_mode: 'HTML',
                    }
                );
                const randomIndex = Math.floor(
                    Math.random() * data.source.length
                );
                await ctx.reply(
                    `<a href="${data.source[randomIndex]}">${data.source[randomIndex]}</a>`,
                    {
                        parse_mode: 'HTML',
                    }
                );
                return;
            }
        } catch (error) {
            console.error(
                `Ошибка при получении информации о компании ${symbol} `,
                error
            );
            await ctx.reply(
                `Ошибка при получении информации о компании ${symbol} `
            );
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

bot.command(['meme'], async (ctx) => {
    var meme = await getRandomMeme(memePageUrl);

    if (!meme) {
        await ctx.reply(`Не удалось найти ни одного мема.`);
        return;
    } else {
        try {
            await ctx.reply(meme);
            return;
        } catch (error) {
            console.error(`Ошибка при поиске мема`, error);
            await ctx.reply(
                `Произошла ошибка при поиске мема. Попоробуйте еще раз через минуту.`
            );
        }
    }
});

bot.command(['joke'], async (ctx) => {
    var joke = '';
    const symbol = ctx.match;
    if (!symbol || symbol === '') {
        joke = await getRandomAnekdot(anekPageUrl);
    } else {
        joke = await getAnekdot(symbol, anekSearchUrl);
    }
    if (!joke) {
        await ctx.reply(`Не удалось найти такого анекдота.`);
        return;
    } else {
        try {
            await ctx.reply(joke, {
                parse_mode: 'HTML',
            });
            return;
        } catch (error) {
            console.error(`Ошибка при поиске анекдота`, error);
            await ctx.reply(
                `Произошла ошибка при поиске анекдота. Попоробуйте еще раз через минуту.`
            );
        }
    }
});

// Messages //

bot.on(':contact', async (ctx) => {
    await ctx.reply('Спасибо за контакт!');
});

bot.on(':location', async (ctx) => {
    await ctx.reply('Спасибо за геолокацию!');
});

// Errors //

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

// Start bot //

bot.start();
