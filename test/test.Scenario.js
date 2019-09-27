const TestUtil = require('./TestUtil');
const assert = require('assert');
const axios = require('axios');

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

const scenarioParams = {
    authorCount:    2,
    commenterCount: 4,
    readerCount:    16,
}

const globals = {
    authorUsers:     [],
    commenterUsers:  [],
    readerUsers:     [],
    createdComments: [],
    createdArticles: [],
};

describe('Scenario', async () => {

    before(async () => {
	globals.authorUsers = await Promise.all(
	    Array
		.from(Array(scenarioParams.authorCount))
		.map(() =>
		     TestUtil.createTestUser(
			 `author-${TestUtil.randomString()}`)));

	globals.commenterUsers = await Promise.all(
	    Array
		.from(Array(scenarioParams.commenterCount))
		.map(() =>
		     TestUtil.createTestUser(
			 `commenter-${TestUtil.randomString()}`)))

	globals.readerUsers = await Promise.all(
	    Array
		.from(Array(scenarioParams.readerCount))
		.map(() =>
		     TestUtil.createTestUser(
			 `reader-${TestUtil.randomString()}`)));
    });

    describe('Create', async () => {
	it('create articles', async () => {
	    globals.createdArticles = (await Promise.all(globals
						         .authorUsers.concat(globals.authorUsers) // Write two articles per author
						         .map(author =>
						              axios.post(`/articles`, {
							          article: {
							              title: lorem.generateSentences(1),
							              description: lorem.generateParagraphs(1),
							              body: lorem.generateParagraphs(12)
							          },
						              }, {
							          headers: { Authorization: `Token ${author.token}` },
						              })))).map(response => response.data.article);
	});


        it('create article with tags', async () => {
	    globals.createdArticles.push(...(await Promise.all(globals
						               .authorUsers.concat(globals.authorUsers)
						               .map(author =>
						                    axios.post(`/articles`, {
							                article: {
							                    title: lorem.generateSentences(1),
							                    description: lorem.generateParagraphs(1),
							                    body: lorem.generateParagraphs(12),
                                                                            tagList: lorem.generateWords(4),
							                },
						                    }, {
							                headers: { Authorization: `Token ${author.token}` },
						                    })))).map(response => response.data.article))
        });
    });

    describe('Get', async () => {
        for (i = 0; i < 5; i++) {
            it('get articles by slug', async () => {
                for (i = 0; i < 5; i++) {
                    await Promise.all(globals
                                      .createdArticles
                                      .map(article => axios.get(
                                          `/articles/${article.slug}`)));
                }
            });
        }
    });

    describe('Favorite', async () => {
        it('favorite articles', async () => {

            const allUsers = globals.authorUsers
                  .concat(globals.commenterUsers)
                  .concat(globals.readerUsers)

            for (user of allUsers) {
                await Promise.all(globals.createdArticles.map(article => axios.post(`/articles/` +
                                                                  `${article.slug}/favorite`, {}, {
                                                                      headers: { Authorization: `Token ${user.token}` },
                                                                  })));
            }
        });
        it('unfavorite articles', async () => {

            for(user of globals.authorUsers) {
                await Promise.all(globals.createdArticles.map(article => axios.delete(`/articles/` +
                                                                                      `${article.slug}/favorite`, {
                                                                                          headers: { Authorization: `Token ${user.token}` },
                                                                                      })));
            }
        });
    });

    describe('List', async () => {
        for (i = 0; i < 20; i++) {
            it('list articles', async () => {
                await axios.get(`/articles`);
            });
        }
    });

    describe('Follow', async () => {
        it('follow authors', async () => {
            await Promise.all(globals.readerUsers.map(reader =>
                                                      Promise.all(globals.authorUsers.map(author =>
                                                                                          axios({
                                                                                              method: 'POST',
                                                                                              url: `/profiles/${author.username}/follow`,
                                                                                              headers: { 'Authorization': `Token ${reader.token}` },
                                                                                          }))
                                                                 )))
        });
    });

    describe('Feed', async () => {
        it('get feed', async () => {
            await Promise.all(globals.readerUsers.map(user =>
                                                      axios.get(`/articles/feed`, {
                                                          headers: { Authorization: `Token ${user.token}` },
                                                      })))
        });
    });

    describe('Comment', async () => {
        for (let i = 0; i < 4; ++i) {
	    it('create comments', async () => {
		for (commenter of globals.commenterUsers) {
                    for (article of globals.createdArticles) {
                        globals.createdComments.push((await axios.post(
                            `/articles/${article.slug}/comments`, {
                                comment: {
                                    body: lorem.generateParagraphs(1),
                                },
                            }, {
                                headers: { Authorization: `Token ${commenter.token}` },
                            })).data.comment);
                    }
                }
            }
              )};
    });


    describe('Delete', async () => {

        // Delete all of the articles by one of the authors
        it('delete articles', async () => {
            const author = globals.authorUsers[0];
            const articles = globals.createdArticles.filter(article => article.author.username === author.username);

            await Promise.all(articles.map(article => axios.delete(
                `/articles/${article.slug}`,
                { headers: { Authorization: `Token ${author.token}` } },
            )))
            debugger;
            });
    });
});
