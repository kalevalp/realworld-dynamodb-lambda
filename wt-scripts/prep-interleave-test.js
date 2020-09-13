const axios = require('axios');
// API_URL=`serverless info --verbose | grep '^ServiceEndpoint:' | grep -o 'https://.*'`; API_URL=$API_URL/api

const API_URL = process.env.API_URL;
axios.defaults.baseURL = API_URL;

const { LoremIpsum } = require("lorem-ipsum");

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 12,
    min: 4
  },
  wordsPerSentence: {
    max: 20,
    min: 8
  }
});

async function createTestUser(username) {
    return (await axios.post(
        `/users`, {
            user: {
                email: `${username}@email.com`,
                username: username,
                password: 'password',
            }
        })).data.user;
}

async function createArticle(count, token) {
    return (await axios.post(`/articles`, {
        article: {
            title: `Article the ${count} of five`,
            description: lorem.generateParagraphs(1),
            body: lorem.generateParagraphs(12)
        },
    }, {
        headers: { Authorization: `Token ${token}` },
    })).data.article;
}

async function createComment(slug, token) {
    return (await axios.post(
        `/articles/${slug}/comments`, {
            comment: {
                body: lorem.generateParagraphs(1),
            },
        }, {
            headers: { Authorization: `Token ${token}` },
        })).data.comment;
}

async function main() {
    const author = await createTestUser('userauthor');
    console.log('Created author:', author)
    const reader = await createTestUser('usrereader');
    console.log('Created reader:', reader)

    const articles = [];
    articles.push(await createArticle('first', author.token));
    articles.push(await createArticle('second', author.token));
    articles.push(await createArticle('third', author.token));
    articles.push(await createArticle('fourth', author.token));
    articles.push(await createArticle('fifth', author.token));

    console.log('Created articles:', articles);

    const comments = [];

    for (const article of articles) {
        for (let i = 0; i < 5; i++) {
            comments.push(await createComment(article.slug, reader.token));
        }
    }

    console.log('Created comments:', comments);

}

main();
