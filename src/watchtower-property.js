
const properties = [
    // Property:
    //   GDPR Article 7 - Processing of data must occur only after consent was given
    //   and not revoked since then.
    {
        name: 'gdpr7',
        quantifiedVariables: ['uuid'],
        projections: [['uuid']],
        stateMachine: {
            'GOT_CONSENT': {
                params: [
                    'uuid'
                ],
                'INITIAL' : {
                    to: 'consented'
                },
            },
            'REVOKED_CONSENT': {
                params: [
                    'uuid'
                ],
                'consented': {
                    to: 'INITIAL'
                }
            },

            'PROCESSING_DATA': {
                params: [
                    'uuid'
                ],
                'INITIAL': {
                    to: 'FAILURE'
                },
                'consented': {
                    to: 'SUCCESS'
                }
            },
            // 'PROCESSING_NO_ID': {},
        }
    },
    {
        name: 'tests-i',
        quantifiedVariables: ['article-id', 'user-uuid'],
        projections: [['user-uuid'], ['article-id', 'user-uuid']],
        stateMachine: {
            'LOGGED_IN': {
                params: ['user-uuid'],
                'INITIAL' : {
                    to: 'logged-in'
                },
            },
            'LOGGED_OUT': {
                params: ['user-uuid'],
                'logged-in' : {
                    to: 'INITIAL'
                },
            },
            'PUBLISHED_ARTICLE': {
                params: ['article-id', 'user-uuid'],
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
        quantifiedVariables: ['article-slug'],
        projections: [['article-slug']],
        stateMachine: {
            'PUBLISHED_ARTICLE': {
                params: ['article-slug'],
                'INITIAL': {
                    to: 'published'
                },
            },
            'DELETED_ARTICLE': {
                params: ['article-slug'],
                'published' : {
                    to: 'INITIAL'
                },
            },
            'RETRIEVED_ARTICLE': {
                params: ['article-slug'],
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
        quantifiedVariables: ['article-slug', 'user-uuid'],
        projections: [['article-slug', 'user-uuid'], ['user-uuid']],
        stateMachine: {
            'LOGGED_IN': {
                params: ['user-uuid'],
                'INITIAL' : {
                    to: 'logged-in'
                },
                'published-logged-out': {
                    to: 'published'
                }
            },
            'LOGGED_OUT': {
                params: ['user-uuid'],
                'logged-in' : {
                    to: 'INITIAL'
                },
                'published': {
                    to: 'published-logged-out'
                }
            },
            'PUBLISHED_ARTICLE': {
                params: ['article-slug', 'user-uuid'],
                'INITIAL': {
                    to: 'FAILURE'
                },
                'logged-in': {
                    to: 'published'
                }
            },
            'DELETED_ARTICLE': {
                params: ['article-slug', 'user-uuid'],
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
        quantifiedVariables: ['article-slug', 'user-uuid'],
        projections: [['article-slug', 'user-uuid'], ['user-uuid']],
        stateMachine: {
            'LOGGED_IN': {
                params: ['user-uuid'],
                'INITIAL' : {
                    to: 'logged-in'
                },
                'published': {
                    to: 'published-logged-in'
                }
            },
            'LOGGED_OUT': {
                params: ['user-uuid'],
                'logged-in' : {
                    to: 'INITIAL'
                },
                'published-logged-in': {
                    to: 'published'
                }
            },
            'PUBLISHED_ARTICLE': {
                params: ['article-slug', 'user-uuid'],
                'INITIAL': {
                    to: 'published'
                },
                'logged-in': {
                    to: 'published-logged-in'
                }
            },
            'DELETED_ARTICLE': {
                params: ['article-slug', 'user-uuid'],
                'published-logged-in' : {
                    to: 'logged-in'
                },
                'published': {
                    to: 'INITIAL'
                },
            },
            'FAVED': {
                params: ['article-slug', 'user-uuid'],
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
];

module.exports = properties;
