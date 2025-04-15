const { generateText } = require('./analyzeImage');

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
  
    const attachment = message.attachments.first();
    if (attachment && attachment.contentType.startsWith('image/')) {
      await message.channel.send('Думаю над ответом...');
  
      const reply = await generateText(attachment.url);
      await message.reply(reply);
    }
  });