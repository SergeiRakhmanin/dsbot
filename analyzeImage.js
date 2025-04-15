const { Groq } = require('groq-sdk');
const fetch = require('node-fetch');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function describeImage(imageUrl) {
    const response = await fetch('https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
        },
        bode: JSON.stringify( {inputs: imageUrl }),
    });

    const result = await response.json();
    return result[0]?.generated_text || 'Хуйню прислал';
}

async function generateText(imageUrl) {
    const description = await describeImage(imageUrl);

    const chat = await groq.chat.completions.create({
        model: 'mixtral-8x7b-32768',
        messages: [
            {
                role: 'system',
                content: 'Ты комментируешь картинки как мемный гений. Отвечай смешно, лаконично, по-русски.',
              },
              {
                role: 'user',
                content: `На картинке: ${description}. Придумай мемную подпись.`,
              },
        ],
    });

    return chat.choices[0]?.message?.content || 'Не знаю что ответить';
}


module.exports = { generateCaption };