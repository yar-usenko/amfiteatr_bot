const { Telegraf } = require('telegraf')

const bot = new Telegraf('838322407:AAHIEZORX9itZjc2qiWaIhguGxv9SgTSu_M')

bot.start(async ctx => {
  await ctx.reply('👋');
  await ctx.reply('Я бот открытого пространства "Амфитеатр"');
  await ctx.reply('Я создан, чтоб делать мир лучше!');
  await ctx.reply('Но пока я туповат...');
  await ctx.reply('Настолько туповат, что пока все что я умею - это существовать...');
  await ctx.reply('Хотя если я не мыслю, существую ли я🤔');
  await ctx.reply('Так стоп. Давай пока не бедум заморачиваться. Приходи позже и может мой создатель прикрутит ко мне что то полезное, а не только эти дебильные фразочки');
})

bot.launch()