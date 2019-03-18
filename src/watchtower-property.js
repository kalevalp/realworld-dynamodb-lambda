// Property:
//   GDPR Article 7 - Processing of data must occur only after consent was given
//   and not revoked since then.

const property = {
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
};

module.exports = property;
