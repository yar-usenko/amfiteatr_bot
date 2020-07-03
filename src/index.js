import fs from 'fs';
import path from 'path';
import { Telegraf, Markup } from 'telegraf';

const USERS_PATH = path.join(__dirname, '..', 'data/users.json');

const keyboard = {
  zero: Markup
    .keyboard(['Тут будет клавиатура'])
    .oneTime()
    .resize()
    .extra(),
};

const config = {
  token: process.env.TELEGRAM_TOKEN,
  admins: (process.env.ADMIN_IDS || '').split(',').map((id) => Number(id)),
  users: JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8')),
};

const bot = new Telegraf(config.token);

const isAdmin = (userId) => config.admins.includes(userId);

const forwardToAdmin = async (ctx) => {
  const reply = ctx.message.reply_to_message;

  await Promise.all(
    config.admins
      .filter((adminId) => ctx.from.id !== adminId && (reply
        && reply.forward_from && reply.forward_from.id !== adminId))
      .map((adminId) => ctx.forwardMessage(adminId, ctx.from.id, ctx.message.id)),
  );
};

bot.use(async (ctx, next) => {
  if (ctx.update.message.from) {
    const user = ctx.update.message.from;
    const currentUser = Object.keys(config.users).find((id) => user.id.toString() === id);

    if (!currentUser) {
      config.users[user.id] = user;
      fs.writeFileSync(USERS_PATH, JSON.stringify(config.users, null, 2));
    }
  }
  return next();
});

bot.start(async (ctx) => {
  if (isAdmin(ctx.message.from.id)) {
    await ctx.reply('Привет 👋');
    await ctx.reply('Рад тебя видеть, мастер!', keyboard.zero);
  } else {
    await ctx.reply('Привет 👋');
    await ctx.reply('Я бот открытого пространства "Амфитеатр"');
    await ctx.reply('Я создан, чтоб объединить людей под открытым небом 🌿🍃!');
    await ctx.reply('Я оповещу тебя о новых мероприятиях');
    await ctx.reply('Покажу, что на них происходит');
    await ctx.reply('Ну и может мои создатели ко мне еще что-то прикрутят🤔', keyboard.zero);
  }
});

bot.on('message', async (ctx) => {
  if (ctx.message.reply_to_message
        && ctx.message.reply_to_message.forward_from
        && isAdmin(ctx.message.from.id)) {
    await ctx.telegram.sendCopy(ctx.message.reply_to_message.forward_from.id, ctx.message);
    await forwardToAdmin(ctx);
  } else {
    await forwardToAdmin(ctx);
  }
});

bot.catch(async (err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

bot.launch();
