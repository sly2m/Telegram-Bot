async function getJoke(search, url) {
    const searchUrl = url + encodeURIComponent(search);
    return await getRandomJoke(searchUrl);
}

async function getRandomJoke(url) {
    const cheerio = await import('cheerio');
    const got = (await import('got')).default;

    const response = await got(url);
    var $ = cheerio.load(response.body);

    var aneks = $('div.text');

    for (let i = 0; i < aneks.length; i++) {
        aneks[i].text = parseJoke(aneks[i].children);
    }
    // return random meme from the list
    return aneks[Math.floor(Math.random() * aneks.length)].text;
}

function parseJoke(input) {
    var output = '';
    for (let i = 0; i < input.length; i++) {
        if (input[i].type === 'text') {
            output += input[i].data;
        } else if (input[i].type === 'tag' && input[i].name === 'br') {
            output += '\n';
        } else if (input[i].type === 'tag' && input[i].name === 'span') {
            output += input[i].children[0].data;
        }
    }
    return output;
}

module.exports = { getJoke, getRandomJoke };
