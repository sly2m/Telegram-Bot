async function getMemes(url) {
    const cheerio = await import('cheerio');
    const got = (await import('got')).default;

    const response = await got(url);
    var $ = cheerio.load(response.body);

    var memes = $('h2.base-unit-title a' );

    for (let i = 0; i < memes.length; i++) {
        memes[i] = parseImageUrl(memes[i].attribs['href']);
    }  
    // return random meme from the list
    return memes[Math.floor(Math.random() * memes.length)];
}

function parseImageUrl(input) {
    const parts = input.split('/');
    const type = parts[1];
    const id = parts[2];
    const extension = type === 'gif' ? 'gif' : 'jpg';
    return `i.imgflip.com/${id}.${extension}`;
}

module.exports = { getMemes };
