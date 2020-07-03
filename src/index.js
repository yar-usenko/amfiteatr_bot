import fs from 'fs';
import { Telegraf, Markup } from 'telegraf';

const ADMIN_IDS = (process.env.ADMIN_IDS || '').split(',');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

const users = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8'));

bot.catch(async (err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

bot.use(async (ctx, next) => {
  if (ctx.update.message.from) {
    const user = ctx.update.message.from;
    const currentUser = Object.keys(users).find((id) => user.id.toString() === id);
    if (!currentUser) {
      users[user.id] = user;
      fs.writeFileSync(`${__dirname}/data/users.json`, JSON.stringify(users, null, 2));
    }
  }
  return next();
});

bot.start(async (ctx, next) => {
  await ctx.reply('Привет 👋');
  await ctx.reply('Я бот открытого пространства "Амфитеатр"');
  await ctx.reply('Я создан, чтоб объединить людей под открытым небом 🌿🍃!');
  await ctx.reply('Я оповещу тебя о новых мероприятиях');
  await ctx.reply('Покажу, что на них происходит');
  await ctx.reply('Ну и может мои создатели ко мне еще что-то прикрутят🤔');
  await ctx.reply('Внизу например клавиатурка появилась (но пока она ничего не делает)', Markup
    .keyboard([
      [Markup.callbackButton('Мероприятия', 'Покажи следующие мероприятия'), '😎 Popular'], // Row1 with 2 buttons
      ['☸ Setting', '📞 Feedback'], // Row2 with 2 buttons
      ['📢 Ads', '⭐️ Rate us', '👥 Share'], // Row3 with 3 buttons
    ])
    .resize()
    .extra());

  return next();
});

bot.on('message', async (ctx, next) => {
  const { chat, message_id: messageId } = ctx.update.message;

  await Promise.all(
    ADMIN_IDS
      .filter((admin) => admin !== chat.id.toString())
      .map((admin) => ctx.forwardMessage(admin, chat.id, messageId)),
  );

  if (!ADMIN_IDS.includes(chat.id)) {
    console.log(ctx.update);
  } else {
    console.log(ctx.update.message);
    if (ctx.update.message.reply_to_message && ctx.update.message.reply_to_message.forward_from) {
      const chatId = ctx.update.message.reply_to_message.forward_from.id;
      ctx.telegram.sendCopy(chatId, ctx.update.message);
    }
  }

  return next();
});

bot.launch();
