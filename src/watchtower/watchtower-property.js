const properties = [
    {
        name: 'tests-ix',
        quantifiedVariables: ['article_slug', 'comment_uuid'],
        projections: [['article_slug', 'comment_uuid'], ['article_slug']],
        stateMachine: {
            'PUBLISHED_ARTICLE': {
                params: ['article_slug'],
                'INITIAL': { to: 'published' },
            },
            'DELETED_ARTICLE': {
                params: ['article_slug'],
                'published': { to: 'INITIAL' },
            },
            'COMMENTED': {
                params: ['article_slug', 'comment_uuid'],
                'INITIAL': { to: 'FAILURE' },
                'published': { to: 'commented' },
            },
            'DELETED_COMMENT': {
                params: ['article_slug', 'comment_uuid'],
                'INITIAL': { to: 'FAILURE' },
                'commented': { to: 'SUCCESS' }, // won't get the same comment id twice
                // 'published': { to: 'FAILURE' },
            },
            'RETRIEVED_COMMENT': {
                params: ['article_slug', 'comment_uuid'],
                'INITIAL': { to: 'FAILURE' },
                'published': { to: 'FAILURE' },
    		'commented': { to: 'commented' },
            }
        },
    },
];

module.exports = properties;
