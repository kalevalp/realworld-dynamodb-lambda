const axios = require('axios');
// API_URL=`serverless info --verbose | grep '^ServiceEndpoint:' | grep -o 'https://.*'`; API_URL=$API_URL/api

const API_URL = process.env.API_URL;
axios.defaults.baseURL = API_URL;

async function getAllArticles() {
    return (await axios.get(`/articles`)).data.articles;
}

async function getAllComments(slug) {
    return (await axios.get(`/articles/${slug}/comments`)).data.comments;
}

async function main() {
    const articles = (await getAllArticles()).map(item => item.slug);
    console.log('Got articles:', articles)

    for (const article of articles) {
        const comments = (await getAllComments(article)).map(item => ({id: item.id, article: item.slug}));
        console.log('Got comments:', comments);
    }
}

main();
