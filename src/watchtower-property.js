// TODO - Change the create article properties to work with author username instead of uuid + change the login event to match (i.e., username instead of uuid).
const properties = [
    // Property:
    //   GDPR Article 7 - Processing of data must occur only after consent was given
    //   and not revoked since then.
    {
        name: 'gdpr7',
        quantifiedVariables: ['user'],
        projections: [['user']],
        stateMachine: {
            'GOT_CONSENT': {
                params: [
                    'user'
                ],
                'INITIAL' : {
                    to: 'consented'
                },
            },
            'REVOKED_CONSENT': {
                params: [
                    'user'
                ],
                'consented': {
                    to: 'INITIAL'
                }
            },

            'PROCESSING_DATA': {
                params: [
                    'user'
                ],
                'INITIAL': {
                    to: 'FAILURE'
                },
                'consented': {
                    to: 'SUCCESS'
                }
            },
        }
    },
    {
        name: 'tests-i',
        quantifiedVariables: ['article_slug', 'user'],
        projections: [['user'], ['article_slug', 'user']],
        stateMachine: {
            'LOGGED_IN': {
                params: ['user'],
                'INITIAL' : {
                    to: 'logged-in'
                },
            },
            'LOGGED_OUT': {
                params: ['user'],
                'logged-in' : {
                    to: 'INITIAL'
                },
            },
            'PUBLISHED_ARTICLE': {
                params: ['article_slug', 'user'],
                'INITIAL' : {
                    to: 'FAILURE'
                },
                'logged-in' : {
                    to: 'SUCCESS'
                },
            },
        }
    },
    {
        name: 'tests-ii',
        quantifiedVariables: ['article_slug'],
        projections: [['article_slug']],
        stateMachine: {
            'PUBLISHED_ARTICLE': {
                params: ['article_slug'],
                'INITIAL': {
                    to: 'published'
                },
            },
            'DELETED_ARTICLE': {
                params: ['article_slug'],
                'published' : {
                    to: 'INITIAL'
                },
            },
            'RETRIEVED_ARTICLE': {
                params: ['article_slug'],
                'INITIAL': {
                    to: 'FAILURE'
                },
                'published' : {
                    to: 'SUCCESS'
                },
            },
        }
    },
    {
        name: 'tests-iii',
        quantifiedVariables: ['article_slug', 'user'],
        projections: [['article_slug', 'user'], ['user']],
        stateMachine: {
            'LOGGED_IN': {
                params: ['user'],
                'INITIAL' : {
                    to: 'logged-in'
                },
                'published-logged-out': {
                    to: 'published'
                }
            },
            'LOGGED_OUT': {
                params: ['user'],
                'logged-in' : {
                    to: 'INITIAL'
                },
                'published': {
                    to: 'published-logged-out'
                }
            },
            'PUBLISHED_ARTICLE': {
                params: ['article_slug', 'user'],
                'INITIAL': {
                    to: 'FAILURE'
                },
                'logged-in': {
                    to: 'published'
                }
            },
            'DELETED_ARTICLE': {
                params: ['article_slug', 'user'],
                'published' : {
                    to: 'deleted'
                },
                'logged-in': {
                    to: 'FAILURE'
                },
                'INITIAL': {
                    to: 'FAILURE'
                },
                'published-logged-out': {
                    to: 'FAILURE'
                },
                'deleted': {
                    to: 'FAILURE'
                }
            },
        }
    },
    {
        name: 'tests-iv',
        quantifiedVariables: ['article_slug', 'user'],
        projections: [['article_slug', 'user'], ['user']],
        stateMachine: {
            'LOGGED_IN': {
                params: ['user'],
                'INITIAL' : {
                    to: 'logged-in'
                },
                'published': {
                    to: 'published-logged-in'
                }
            },
            'LOGGED_OUT': {
                params: ['user'],
                'logged-in' : {
                    to: 'INITIAL'
                },
                'published-logged-in': {
                    to: 'published'
                }
            },
            'PUBLISHED_ARTICLE': {
                params: ['article_slug'],
                'INITIAL': {
                    to: 'published'
                },
                'logged-in': {
                    to: 'published-logged-in'
                }
            },
            'DELETED_ARTICLE': {
                params: ['article_slug'],
                'published-logged-in' : {
                    to: 'logged-in'
                },
                'published': {
                    to: 'INITIAL'
                },
            },
            'FAVED': {
                params: ['article_slug', 'user'],
                'published-logged-in': {
                    to: 'SUCCESS'
                },
                'published': {
                    to: 'FAILURE'
                },
                'INITIAL': {
                    to: 'FAILURE'
                },
                'logged-in': {
                    to: 'FAILURE'
                }
            }
        }
    },
    {
        name: 'tests-vi',
        quantifiedVariables: ['article_slug'],
        projections: [['article_slug']],
        stateMachine: {
            'PUBLISHED_ARTICLE': {
                params: ['article_slug'],
                'INITIAL': {
                    to: 'published'
                },
            },
            'LISTED': {
                params: ['article_slug'],
                'INITIAL': {
                    to: 'FAILURE'
                },
                'published': {
                    to: 'SUCCESS'
                },
            },
            'DELETED_ARTICLE': {
                params: ['article_slug'],
                'published': {
                    to: 'INITIAL'
                },
            },
        },
    },
    // This is an interesting example for the chain properties thing.
    {
        name: 'tests-vii',
        quantifiedVariables: ['article_slug', 'user', 'reader'],
        projections: [['article_slug', 'user', 'reader'], ['article_slug', 'user'], ['article_slug'],['user','reader']],
        stateMachine: {
            'PUBLISHED_ARTICLE': {
                params: ['article_slug', 'user'],
                'INITIAL': { to: 'published' },
                'followed': { to: 'published_and_followed' },
            },
            'DELETED_ARTICLE': {
                params: ['article_slug'],
                'published': { to: 'INITIAL' },
                'published_and_followed': { to: 'followed' },
            },
            'FOLLOWED': {
                params: ['reader', 'user'],
                'INITIAL': {to: 'followed'},
                'published': {to: 'published_and_followed'},
            },
            'UNFOLLOWED': {
                params: ['reader', 'user'],
                'followed': {to: 'INITIAL'},
                'published_and_followed': {to: 'published'},
            },
            'IN_FEED': { // The author id is actually not really necessary here.
                // Can do without it, need it for the property condition.
                params: ['article_slug', 'user', 'reader'],
                'INITIAL': { to: 'FAILURE' },
                'published': { to: 'FAILURE' },
                'followed': {to: 'FAILURE'},
                'published_and_followed': {to: 'SUCCESS'},
            },
        },
    },
    {
        name: 'tests-viii',
        quantifiedVariables: ['article_slug', 'comment_uuid', 'user'],
        projections: [['article_slug', 'comment_uuid', 'user'], ['article_slug'], ['user']],
        stateMachine: {
            'PUBLISHED_ARTICLE': {
                params: ['article_slug'],
                'INITIAL': { to: 'published' },
                'logged-in' : { to: 'published-and-logged-in' },
            },
            'DELETED_ARTICLE': {
                params: ['article_slug'],
                'published': { to: 'INITIAL' },
                'published-and-logged-in' : { to: 'logged-in' },
            },
            'LOGGED_IN': {
                params: ['user'],
                'INITIAL' : { to: 'logged-in' },
                'published': { to: 'published-and-logged-in' },
            },
            'LOGGED_OUT': {
                params: ['user'],
                'logged-in' : { to: 'INITIAL' },
                'published-and-logged-in': { to: 'published' },
            },
            'COMMENTED': {
                params: ['article_slug', 'comment_uuid', 'user'],
                'INITIAL': { to: 'FAILURE' },
                'logged-in': { to: 'FAILURE' },
                'published': { to: 'FAILURE' },
                'published-and-logged-in': { to: 'SUCCESS' },
            },
        },
    },
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
    		'commented': { to: 'SUCCESS' },
            }
        },
    },
];


if (process.env.WT_RW_PROP_COUNT) {
    module.exports = properties.slice(0,Number(process.env.WT_RW_PROP_COUNT));
} else {
    module.exports = properties;
}



// const eventTypes = {
// [V]  'PUBLISHED_ARTICLE': { params: ['article_slug', 'author_uuid']},
// [V]  'DELETED_ARTICLE': { params: ['article_slug', 'author_uuid'] },
// [V]  'RETRIEVED_ARTICLE': { params: ['article_slug'] },

// [V]  'COMMENTED': { params: ['article_slug', 'user_uuid', 'comment_uuid'] },
// [V]  'DELETED_COMMENT': { params: ['article_slug', 'comment_uuid'] },
// [V]  'RETRIEVED_COMMENT': { params: ['article_slug', 'comment_uuid'] },

// [V]  'FAVED': { params: ['article_slug', 'user_uuid'] },

// [V]  'FOLLOWED': {params: ['user_uuid', 'author_uuid'] },
// [V]  'UNFOLLOWED': {params: ['user_uuid', 'author_uuid'] },

// [V]  'GOT_CONSENT': { params: [ 'uuid' ] },
// [V]  'REVOKED_CONSENT': { params: [ 'uuid' ] },
// [V]  'PROCESSING_DATA': { params: [ 'uuid' ] },

// [V]  'IN_FEED': { params: ['article_slug', 'author_uuid', 'user_uuid'] },
// [V]  'LISTED': { params: ['article_slug'] },

// [V]  'LOGGED_IN': { params: ['user_uuid'] },
// [-]  'LOGGED_OUT': { params: ['user_uuid']},
// };
