async function getFetch(url) {
    const fetch = (await import('node-fetch')).default;
    return fetch(url);
}

async function getRandomMeme(url) {
    let response = await getFetch(url);
    let json = await response.json();
    let memes = [];
    if (json['meta']['status'] !== 'Success') {
        if (
            typeof json['meta']['errorMessage'] !== 'undefined' &&
            json['meta']['errorMessage'] !== ''
        ) {
            return null;
        } else {
            return null;
        }
    } else {
        for (let i = 0; i < json.data.posts.length; i++) {
            if (json.data.posts[i].images.image460sv) {
                // mp4 - animated
                memes.push(json.data.posts[i].images.image460sv.url);
            } else {
                if (json.data.posts[8].images.image700) {
                    // jpg - static
                    memes.push(json.data.posts[i].images.image700.url);
                } else {
                    memes.push(null);
                }
            }
        }
    }
    return memes[Math.floor(Math.random() * memes.length)];
}

module.exports = { getRandomMeme };
