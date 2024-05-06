const {Telegraf} = require('telegraf')
const fs = require('fs')

function loadUsersData() {
  try {
      const data = fs.readFileSync('users.json');
      return JSON.parse(data);
  } catch (error) {
      // Если файл не существует или произошла ошибка при чтении, возвращаем пустой массив
      return [];
  }
}
function saveUsersData(usersData) {
  fs.writeFileSync('users.json', JSON.stringify(usersData, null, 2));
}
function getCurrentDateTimeInTashkent() {
  const now = new Date();
  const tashkentOffset = 5; // Смещение часового пояса Ташкента относительно UTC (на 5 часов вперед)

  // Вычисляем локальное время Ташкента с учетом смещения
  const tashkentTime = new Date(now.getTime() + tashkentOffset * 60 * 60 * 1000);

  return tashkentTime.toISOString();
}

function isAdmin(ctx) {
  return ctx.message.from.id === adminId;
}

// Объект для хранения сообщений, ожидающих отправки
const pendingMessages = {};


const BOT_ID = '6603078556:AAFBJLLeezcQ-aMN2dviczSYiC9Ify4DCwo'
const bot = new Telegraf(BOT_ID)
const adminId = 5939796099; // Ваш идентификатор

const users = JSON.parse(fs.readFileSync('users.json'));

bot.telegram.setMyCommands([
  {
    command: 'start',
    description: 'Перезапустить бота',
  },
  {
    command: 'manager',
    description: 'Связаться с менеджером 👩🏻‍💼',
  }
]);

bot.command('start', ctx => {
  ctx.reply('Вас приветствует Telegram bot Apexpizza Franchise!', {
    reply_markup: {
        inline_keyboard: [
            [ { text: "Информация ℹ️", callback_data: "info" }, { text: "Менеджер 👩🏻‍💼", callback_data: "manager" }],
        ]
    }
  })
  try {
    const { id, first_name, last_name } = ctx.from;
    let usersData = loadUsersData();
    const userExists = usersData.some(user => user.id === id);

    if (userExists) {
        return;
    }

    const createdAt = getCurrentDateTimeInTashkent()
    usersData.push({ id, first_name, last_name, created_at: createdAt });
    saveUsersData(usersData);
} catch (error) {
    console.error('Ошибка при обработке команды /start:', error);
    // Обработка ошибок, если что-то пошло не так
}
})
bot.command('sendfile', async (ctx) => {
  const channelUsername = '@keylogger_fx'; // Замените на username вашего публичного канала

  try {
      // Получаем информацию о канале
      const channelInfo = await ctx.telegram.getChat(channelUsername);
      
      // Проверяем, есть ли закрепленные сообщения в канале
      if (channelInfo.pinned_message) {
          // Извлекаем id файла из закрепленного сообщения
          const fileId = channelInfo.pinned_message.document.file_id;
          
          // Отправляем файл из канала в приватный чат с клиентом
          await ctx.telegram.sendDocument(ctx.chat.id, fileId, { caption: "Каталог франшизы" });
      } else {
          console.log('В канале нет закрепленных сообщений с файлами');
      }
  } catch (error) {
      console.error('Ошибка при отправке файла:', error);
      // Обработка ошибок, если не удалось отправить файл
  }
});
bot.on('callback_query', async ctx => {
  const data = ctx.callbackQuery.data
  const channelUsername = '@keylogger_fx'
  await ctx.answerCbQuery()
  if(data === 'info') {
    const message = `
    <b>Ссылки на соц.сети APEXPIZZA
▶️ Application:</b>
<a href="https://apps.apple.com/us/app/apexpizza/id1613508465">🔹 IPhone📱</a>
<a href="https://play.google.com/store/apps/developer?id=Apexpizza">🔹 Android🤖</a>

<a href="https://t.me/apexpizzabot">🔹Telegram bot</a>
<a href="Http://instagram.com/apexpizza.uz">🔹Instagram Apexpizza</a>
<a href="https://www.facebook.com/apexpizza.uz">🔹Facebook Apexpizza</a>
<a href="https://t.me/apexpizza_uz">🔹Telegram канал</a>
<a href="http://apexpizza-presentation.tilda.ws/">🔹Презентация</a>
<a href="https://apexpizza.uz/">🔹Сайт</a>
<a href="Http://instagram.com/apexpizza_franchise_">🔹Instagram Apexpizza Franchise</a>
<a href="https://t.me/apexpizza_franchise">🔹Telegram Apexpizza Franchise</a>

🔹<b>Franchise Expo 2023</b>
<a href="https://youtu.be/K_7RBrdBdkI">Ссылка</a>
<a href="https://youtu.be/JTsjSetuirU">Ссылка</a>`
    await ctx.replyWithHTML(message)
    try {
      const filePath = './files/financial_model.jpg'
      await ctx.telegram.sendDocument(ctx.chat.id, { source: fs.createReadStream(filePath), filename: 'financial_model.jpg' }, { caption: "Финансовый модель" });
      // Получаем информацию о канале
      const channelInfo = await ctx.telegram.getChat(channelUsername);
      
      // Проверяем, есть ли закрепленные сообщения в канале
      if (channelInfo.pinned_message) {
          // Извлекаем id файла из закрепленного сообщения
          const fileId = channelInfo.pinned_message.document.file_id;
          
          // Отправляем файл из канала в приватный чат с клиентом
          await ctx.telegram.sendDocument(ctx.chat.id, fileId, { caption: "Каталог франшизы" });
          await ctx.reply('Спасибо за ваш интерес к нашим услугам. Для получения дополнительной информации или помощи вы можете связаться с нашим менеджером напрямую в личном сообщении!', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Менеджер 👩🏻‍💼", url: "https://t.me/tomtitm" }],
                ]
            }
          })
      } else {
          console.log('В канале нет закрепленных сообщений с файлами');
      }
    } catch (error) {
      console.error('Ошибка при чтении файла:', error);
    }
  } else if(data === 'manager') {
    await ctx.reply('Привет! Спасибо за ваш интерес к нашим услугам. Для получения дополнительной информации или помощи вы можете связаться с нашим менеджером напрямую в личном сообщении!', {
      reply_markup: {
          inline_keyboard: [
              [{ text: "Менеджер 👩🏻‍💼", url: "https://t.me/tomtitm" }],
          ]
      }
    })
  }
})

bot.command('manager', ctx => {
  ctx.reply('Привет! Спасибо за ваш интерес к нашим услугам. Для получения дополнительной информации или помощи вы можете связаться с нашим менеджером напрямую в личном сообщении!', {
    reply_markup: {
        inline_keyboard: [
            [{ text: "Менеджер 👩🏻‍💼", url: "https://t.me/tomtitm" }],
        ]
    }
  })
})


bot.command('sendMsg', (ctx) => {
  if (!isAdmin(ctx)) {
      return ctx.reply('Извините, я не совсем понимаю ваше сообщение. Также, вы можете использовать команды:\n /start - для перезапуска бота или\n /manager - для связи с менеджером.');
  }

  // Определяем пользователя, который запустил команду
  const userId = ctx.message.from.id;
  pendingMessages[userId] = { userId };

  ctx.reply('Отправьте сообщение для рассылки.');
});

// Обработка сообщения от админа
bot.on('text', (ctx) => {
  if(!isAdmin(ctx)) {
    ctx.reply(`Извините, я не совсем понимаю ваше сообщение. Также, вы можете использовать команды:\n /start - для перезапуска бота или\n /manager - для связи с менеджером.`)
  }
  const userId = ctx.message.from.id;
  const pendingMessage = pendingMessages[userId];

  if (pendingMessage) {
      // Отправляем сообщение каждому пользователю
      for (const user of users) {
          bot.telegram.sendMessage(user.id, ctx.message.text);
      }

      // Удаляем сообщение из списка ожидающих
      delete pendingMessages[userId];
      ctx.reply('Рассылка сообщений завершена.');
  }
});


bot.on('message', ctx => {
  ctx.reply(`Извините, я не совсем понимаю ваше сообщение. Также, вы можете использовать команды:\n /start - для перезапуска бота или\n /manager - для связи с менеджером.`)
})

bot.launch().then(console.log("Bot is life!"));

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));