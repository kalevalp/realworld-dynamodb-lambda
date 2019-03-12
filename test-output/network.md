```
DELETE /__TESTUTILS__/purge
```
```
200 OK

"Purged all data!"
```
# Article
```
POST /users

{
  "user": {
    "email": "author-igrcpd@email.com",
    "username": "author-igrcpd",
    "password": "password"
  }
}
```
```
200 OK

{
  "user": {
    "email": "author-igrcpd@email.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF1dGhvci1pZ3JjcGQiLCJpYXQiOjE1NTI0MjAxMTIsImV4cCI6MTU1MjU5MjkxMn0.vPr2kF0j8BoaYZE6dM4O6EoqrTvDw-TSDuQ5Ct208kk",
    "username": "author-igrcpd",
    "bio": "",
    "image": ""
  }
}
```
```
POST /users

{
  "user": {
    "email": "authoress-iijri6@email.com",
    "username": "authoress-iijri6",
    "password": "password"
  }
}
```
```
200 OK

{
  "user": {
    "email": "authoress-iijri6@email.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF1dGhvcmVzcy1paWpyaTYiLCJpYXQiOjE1NTI0MjAxMTIsImV4cCI6MTU1MjU5MjkxMn0.cthqcBK1kPLegAIGMMubYnpOIRQwvSqASk0muJ-lAi4",
    "username": "authoress-iijri6",
    "bio": "",
    "image": ""
  }
}
```
```
POST /users

{
  "user": {
    "email": "non-author-o14kv9@email.com",
    "username": "non-author-o14kv9",
    "password": "password"
  }
}
```
```
200 OK

{
  "user": {
    "email": "non-author-o14kv9@email.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5vbi1hdXRob3ItbzE0a3Y5IiwiaWF0IjoxNTUyNDIwMTEyLCJleHAiOjE1NTI1OTI5MTJ9.zGjymPQO2jJ3eCttGzXEPPzfpWVHSHB0psYqHvVtE_s",
    "username": "non-author-o14kv9",
    "bio": "",
    "image": ""
  }
}
```
## Create
### should create article
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body"
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-k4ld5u",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1552420112931,
    "updatedAt": 1552420112931,
    "author": {
      "username": "author-igrcpd",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
### should create article with tags
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "tag_a",
      "tag_b"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-jsftbr",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1552420112974,
    "updatedAt": 1552420112974,
    "author": {
      "username": "author-igrcpd",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "tag_a",
      "tag_b"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
### should disallow unauthenticated user
```
POST /articles

{}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Must be logged in."
    ]
  }
}
```
### should enforce required fields
```
POST /articles

{}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Article must be specified."
    ]
  }
}
```
```
POST /articles

{
  "article": {}
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "title must be specified."
    ]
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "description must be specified."
    ]
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "body must be specified."
    ]
  }
}
```
## Get
### should get article by slug
```
GET /articles/title-k4ld5u
```
```
200 OK

{
  "article": {
    "createdAt": 1552420112931,
    "author": {
      "username": "author-igrcpd",
      "bio": "",
      "image": "",
      "following": false
    },
    "description": "description",
    "title": "title",
    "body": "body",
    "slug": "title-k4ld5u",
    "updatedAt": 1552420112931,
    "tagList": [],
    "favoritesCount": 0,
    "favorited": false
  }
}
```
### should get article with tags by slug
```
GET /articles/title-jsftbr
```
```
200 OK

{
  "article": {
    "tagList": [
      "tag_a",
      "tag_b"
    ],
    "createdAt": 1552420112974,
    "author": {
      "username": "author-igrcpd",
      "bio": "",
      "image": "",
      "following": false
    },
    "description": "description",
    "title": "title",
    "body": "body",
    "slug": "title-jsftbr",
    "updatedAt": 1552420112974,
    "favoritesCount": 0,
    "favorited": false
  }
}
```
### should disallow unknown slug
```
GET /articles/if5klf
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Article not found: [if5klf]"
    ]
  }
}
```
## Update
### should update article
```
PUT /articles/title-jsftbr

{
  "article": {
    "title": "newtitle"
  }
}
```
```
200 OK

{
  "article": {
    "tagList": [
      "tag_a",
      "tag_b"
    ],
    "createdAt": 1552420112974,
    "author": {
      "username": "author-igrcpd",
      "bio": "",
      "image": "",
      "following": false
    },
    "description": "description",
    "title": "newtitle",
    "body": "body",
    "slug": "title-jsftbr",
    "updatedAt": 1552420112974,
    "favoritesCount": 0,
    "favorited": false
  }
}
```
```
PUT /articles/title-jsftbr

{
  "article": {
    "description": "newdescription"
  }
}
```
```
200 OK

{
  "article": {
    "tagList": [
      "tag_a",
      "tag_b"
    ],
    "createdAt": 1552420112974,
    "author": {
      "username": "author-igrcpd",
      "bio": "",
      "image": "",
      "following": false
    },
    "description": "newdescription",
    "title": "newtitle",
    "body": "body",
    "slug": "title-jsftbr",
    "updatedAt": 1552420112974,
    "favoritesCount": 0,
    "favorited": false
  }
}
```
```
PUT /articles/title-jsftbr

{
  "article": {
    "body": "newbody"
  }
}
```
```
200 OK

{
  "article": {
    "tagList": [
      "tag_a",
      "tag_b"
    ],
    "createdAt": 1552420112974,
    "author": {
      "username": "author-igrcpd",
      "bio": "",
      "image": "",
      "following": false
    },
    "description": "newdescription",
    "title": "newtitle",
    "body": "newbody",
    "slug": "title-jsftbr",
    "updatedAt": 1552420112974,
    "favoritesCount": 0,
    "favorited": false
  }
}
```
### should disallow missing mutation
```
PUT /articles/title-jsftbr

{}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Article mutation must be specified."
    ]
  }
}
```
### should disallow empty mutation
```
PUT /articles/title-jsftbr

{
  "article": {}
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "At least one field must be specified: [title, description, article]."
    ]
  }
}
```
### should disallow unauthenticated update
```
PUT /articles/title-jsftbr

{
  "article": {
    "title": "newtitle"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Must be logged in."
    ]
  }
}
```
### should disallow updating non-existent article
```
PUT /articles/foo-title-jsftbr

{
  "article": {
    "title": "newtitle"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Article not found: [foo-title-jsftbr]"
    ]
  }
}
```
### should disallow non-author from updating
```
PUT /articles/title-jsftbr

{
  "article": {
    "title": "newtitle"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Article can only be updated by author: [author-igrcpd]"
    ]
  }
}
```
## Favorite
### should favorite article
```
POST /articles/title-k4ld5u/favorite

{}
```
```
200 OK

{
  "article": {
    "createdAt": 1552420112931,
    "author": {
      "username": "author-igrcpd",
      "bio": "",
      "image": "",
      "following": false
    },
    "description": "description",
    "title": "title",
    "body": "body",
    "slug": "title-k4ld5u",
    "updatedAt": 1552420112931,
    "favoritedBy": [
      "non-author-o14kv9"
    ],
    "favoritesCount": 1,
    "tagList": [],
    "favorited": true
  }
}
```
```
GET /articles/title-k4ld5u
```
```
200 OK

{
  "article": {
    "createdAt": 1552420112931,
    "author": {
      "username": "author-igrcpd",
      "bio": "",
      "image": "",
      "following": false
    },
    "description": "description",
    "title": "title",
    "body": "body",
    "favoritesCount": 1,
    "slug": "title-k4ld5u",
    "updatedAt": 1552420112931,
    "tagList": [],
    "favorited": true
  }
}
```
### should disallow favoriting by unauthenticated user
```
POST /articles/title-k4ld5u/favorite

{}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Must be logged in."
    ]
  }
}
```
### should disallow favoriting unknown article
```
POST /articles/title-k4ld5u_foo/favorite

{}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Article not found: [title-k4ld5u_foo]"
    ]
  }
}
```
### should unfavorite article
```
DELETE /articles/title-k4ld5u/favorite
```
```
200 OK

{
  "article": {
    "createdAt": 1552420112931,
    "author": {
      "username": "author-igrcpd",
      "bio": "",
      "image": "",
      "following": false
    },
    "description": "description",
    "title": "title",
    "body": "body",
    "favoritesCount": 0,
    "slug": "title-k4ld5u",
    "updatedAt": 1552420112931,
    "tagList": [],
    "favorited": false
  }
}
```
## Delete
### should delete article
```
DELETE /articles/title-k4ld5u
```
```
200 OK

{}
```
```
GET /articles/title-k4ld5u
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Article not found: [title-k4ld5u]"
    ]
  }
}
```
### should disallow deleting by unauthenticated user
```
DELETE /articles/foo
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Must be logged in."
    ]
  }
}
```
### should disallow deleting unknown article
```
DELETE /articles/foobar
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Article not found: [foobar]"
    ]
  }
}
```
### should disallow deleting article by non-author
```
DELETE /articles/title-jsftbr
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Article can only be deleted by author: [author-igrcpd]"
    ]
  }
}
```
## List
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "lltpg2",
      "tag_0",
      "tag_mod_2_0",
      "tag_mod_3_0"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-kqirn1",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1552420113966,
    "updatedAt": 1552420113966,
    "author": {
      "username": "authoress-iijri6",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "lltpg2",
      "tag_0",
      "tag_mod_2_0",
      "tag_mod_3_0"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "27pfhb",
      "tag_1",
      "tag_mod_2_1",
      "tag_mod_3_1"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-8ss5ek",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1552420113993,
    "updatedAt": 1552420113993,
    "author": {
      "username": "author-igrcpd",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "27pfhb",
      "tag_1",
      "tag_mod_2_1",
      "tag_mod_3_1"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "99m2ai",
      "tag_2",
      "tag_mod_2_0",
      "tag_mod_3_2"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-ly6e81",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1552420114016,
    "updatedAt": 1552420114016,
    "author": {
      "username": "authoress-iijri6",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "99m2ai",
      "tag_2",
      "tag_mod_2_0",
      "tag_mod_3_2"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "vdqnqe",
      "tag_3",
      "tag_mod_2_1",
      "tag_mod_3_0"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-48dk2x",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1552420114039,
    "updatedAt": 1552420114039,
    "author": {
      "username": "author-igrcpd",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "vdqnqe",
      "tag_3",
      "tag_mod_2_1",
      "tag_mod_3_0"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "bsj5j",
      "tag_4",
      "tag_mod_2_0",
      "tag_mod_3_1"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-ju4ghl",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1552420114064,
    "updatedAt": 1552420114064,
    "author": {
      "username": "authoress-iijri6",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "bsj5j",
      "tag_4",
      "tag_mod_2_0",
      "tag_mod_3_1"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "iizvuf",
      "tag_5",
      "tag_mod_2_1",
      "tag_mod_3_2"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-3isd9h",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1552420114090,
    "updatedAt": 1552420114090,
    "author": {
      "username": "author-igrcpd",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "iizvuf",
      "tag_5",
      "tag_mod_2_1",
      "tag_mod_3_2"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "vek7nf",
      "tag_6",
      "tag_mod_2_0",
      "tag_mod_3_0"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-a3b6z8",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1552420114118,
    "updatedAt": 1552420114118,
    "author": {
      "username": "authoress-iijri6",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "vek7nf",
      "tag_6",
      "tag_mod_2_0",
      "tag_mod_3_0"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "sl98t1",
      "tag_7",
      "tag_mod_2_1",
      "tag_mod_3_1"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-5sgguc",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1552420114140,
    "updatedAt": 1552420114140,
    "author": {
      "username": "author-igrcpd",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "sl98t1",
      "tag_7",
      "tag_mod_2_1",
      "tag_mod_3_1"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "2lp17p",
      "tag_8",
      "tag_mod_2_0",
      "tag_mod_3_2"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-pq1fd5",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1552420114162,
    "updatedAt": 1552420114162,
    "author": {
      "username": "authoress-iijri6",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "2lp17p",
      "tag_8",
      "tag_mod_2_0",
      "tag_mod_3_2"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "7qkc6b",
      "tag_9",
      "tag_mod_2_1",
      "tag_mod_3_0"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-nz7t5k",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1552420114201,
    "updatedAt": 1552420114201,
    "author": {
      "username": "author-igrcpd",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "7qkc6b",
      "tag_9",
      "tag_mod_2_1",
      "tag_mod_3_0"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "h7g4az",
      "tag_10",
      "tag_mod_2_0",
      "tag_mod_3_1"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-3rc1wv",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1552420114238,
    "updatedAt": 1552420114238,
    "author": {
      "username": "authoress-iijri6",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "h7g4az",
      "tag_10",
      "tag_mod_2_0",
      "tag_mod_3_1"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "oeg45t",
      "tag_11",
      "tag_mod_2_1",
      "tag_mod_3_2"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-4mcmle",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1552420114260,
    "updatedAt": 1552420114260,
    "author": {
      "username": "author-igrcpd",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "oeg45t",
      "tag_11",
      "tag_mod_2_1",
      "tag_mod_3_2"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "xom5o0",
      "tag_12",
      "tag_mod_2_0",
      "tag_mod_3_0"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-5kximo",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1552420114284,
    "updatedAt": 1552420114284,
    "author": {
      "username": "authoress-iijri6",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "xom5o0",
      "tag_12",
      "tag_mod_2_0",
      "tag_mod_3_0"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "cq1n4c",
      "tag_13",
      "tag_mod_2_1",
      "tag_mod_3_1"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-p2vs40",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1552420114315,
    "updatedAt": 1552420114315,
    "author": {
      "username": "author-igrcpd",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "cq1n4c",
      "tag_13",
      "tag_mod_2_1",
      "tag_mod_3_1"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "u6ucsg",
      "tag_14",
      "tag_mod_2_0",
      "tag_mod_3_2"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-vqdycn",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1552420114339,
    "updatedAt": 1552420114339,
    "author": {
      "username": "authoress-iijri6",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "u6ucsg",
      "tag_14",
      "tag_mod_2_0",
      "tag_mod_3_2"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "s4icay",
      "tag_15",
      "tag_mod_2_1",
      "tag_mod_3_0"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-nfdkzp",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1552420114365,
    "updatedAt": 1552420114365,
    "author": {
      "username": "author-igrcpd",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "s4icay",
      "tag_15",
      "tag_mod_2_1",
      "tag_mod_3_0"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "e8kdbr",
      "tag_16",
      "tag_mod_2_0",
      "tag_mod_3_1"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-m6lux",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1552420114394,
    "updatedAt": 1552420114394,
    "author": {
      "username": "authoress-iijri6",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "e8kdbr",
      "tag_16",
      "tag_mod_2_0",
      "tag_mod_3_1"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "xjol7u",
      "tag_17",
      "tag_mod_2_1",
      "tag_mod_3_2"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-s569pr",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1552420114432,
    "updatedAt": 1552420114432,
    "author": {
      "username": "author-igrcpd",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "xjol7u",
      "tag_17",
      "tag_mod_2_1",
      "tag_mod_3_2"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "8qj4m6",
      "tag_18",
      "tag_mod_2_0",
      "tag_mod_3_0"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-lwv54p",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1552420114453,
    "updatedAt": 1552420114453,
    "author": {
      "username": "authoress-iijri6",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "8qj4m6",
      "tag_18",
      "tag_mod_2_0",
      "tag_mod_3_0"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "z8dzsy",
      "tag_19",
      "tag_mod_2_1",
      "tag_mod_3_1"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-25midn",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1552420114484,
    "updatedAt": 1552420114484,
    "author": {
      "username": "author-igrcpd",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "z8dzsy",
      "tag_19",
      "tag_mod_2_1",
      "tag_mod_3_1"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
### should list articles
```
GET /articles
```
```
200 OK

{
  "articles": [
    {
      "tagList": [
        "tag_19",
        "tag_mod_2_1",
        "tag_mod_3_1",
        "z8dzsy"
      ],
      "createdAt": 1552420114484,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-25midn",
      "updatedAt": 1552420114484,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "8qj4m6",
        "tag_18",
        "tag_mod_2_0",
        "tag_mod_3_0"
      ],
      "createdAt": 1552420114453,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-lwv54p",
      "updatedAt": 1552420114453,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_17",
        "tag_mod_2_1",
        "tag_mod_3_2",
        "xjol7u"
      ],
      "createdAt": 1552420114432,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-s569pr",
      "updatedAt": 1552420114432,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "e8kdbr",
        "tag_16",
        "tag_mod_2_0",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420114394,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-m6lux",
      "updatedAt": 1552420114394,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "s4icay",
        "tag_15",
        "tag_mod_2_1",
        "tag_mod_3_0"
      ],
      "createdAt": 1552420114365,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-nfdkzp",
      "updatedAt": 1552420114365,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_14",
        "tag_mod_2_0",
        "tag_mod_3_2",
        "u6ucsg"
      ],
      "createdAt": 1552420114339,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-vqdycn",
      "updatedAt": 1552420114339,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "cq1n4c",
        "tag_13",
        "tag_mod_2_1",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420114315,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-p2vs40",
      "updatedAt": 1552420114315,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_12",
        "tag_mod_2_0",
        "tag_mod_3_0",
        "xom5o0"
      ],
      "createdAt": 1552420114284,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-5kximo",
      "updatedAt": 1552420114284,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "oeg45t",
        "tag_11",
        "tag_mod_2_1",
        "tag_mod_3_2"
      ],
      "createdAt": 1552420114260,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-4mcmle",
      "updatedAt": 1552420114260,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "h7g4az",
        "tag_10",
        "tag_mod_2_0",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420114238,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-3rc1wv",
      "updatedAt": 1552420114238,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "7qkc6b",
        "tag_9",
        "tag_mod_2_1",
        "tag_mod_3_0"
      ],
      "createdAt": 1552420114201,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-nz7t5k",
      "updatedAt": 1552420114201,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "2lp17p",
        "tag_8",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1552420114162,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-pq1fd5",
      "updatedAt": 1552420114162,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "sl98t1",
        "tag_7",
        "tag_mod_2_1",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420114140,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-5sgguc",
      "updatedAt": 1552420114140,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_6",
        "tag_mod_2_0",
        "tag_mod_3_0",
        "vek7nf"
      ],
      "createdAt": 1552420114118,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-a3b6z8",
      "updatedAt": 1552420114118,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "iizvuf",
        "tag_5",
        "tag_mod_2_1",
        "tag_mod_3_2"
      ],
      "createdAt": 1552420114090,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-3isd9h",
      "updatedAt": 1552420114090,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "bsj5j",
        "tag_4",
        "tag_mod_2_0",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420114064,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-ju4ghl",
      "updatedAt": 1552420114064,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_3",
        "tag_mod_2_1",
        "tag_mod_3_0",
        "vdqnqe"
      ],
      "createdAt": 1552420114039,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-48dk2x",
      "updatedAt": 1552420114039,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "99m2ai",
        "tag_2",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1552420114016,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-ly6e81",
      "updatedAt": 1552420114016,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "27pfhb",
        "tag_1",
        "tag_mod_2_1",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420113993,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-8ss5ek",
      "updatedAt": 1552420113993,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "lltpg2",
        "tag_0",
        "tag_mod_2_0",
        "tag_mod_3_0"
      ],
      "createdAt": 1552420113966,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-kqirn1",
      "updatedAt": 1552420113966,
      "favoritesCount": 0,
      "favorited": false
    }
  ]
}
```
### should list articles with tag
```
GET /articles?tag=tag_7
```
```
200 OK

{
  "articles": [
    {
      "tagList": [
        "sl98t1",
        "tag_7",
        "tag_mod_2_1",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420114140,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-5sgguc",
      "updatedAt": 1552420114140,
      "favoritesCount": 0,
      "favorited": false
    }
  ]
}
```
```
GET /articles?tag=tag_mod_3_2
```
```
200 OK

{
  "articles": [
    {
      "tagList": [
        "tag_17",
        "tag_mod_2_1",
        "tag_mod_3_2",
        "xjol7u"
      ],
      "createdAt": 1552420114432,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-s569pr",
      "updatedAt": 1552420114432,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_14",
        "tag_mod_2_0",
        "tag_mod_3_2",
        "u6ucsg"
      ],
      "createdAt": 1552420114339,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-vqdycn",
      "updatedAt": 1552420114339,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "oeg45t",
        "tag_11",
        "tag_mod_2_1",
        "tag_mod_3_2"
      ],
      "createdAt": 1552420114260,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-4mcmle",
      "updatedAt": 1552420114260,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "2lp17p",
        "tag_8",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1552420114162,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-pq1fd5",
      "updatedAt": 1552420114162,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "iizvuf",
        "tag_5",
        "tag_mod_2_1",
        "tag_mod_3_2"
      ],
      "createdAt": 1552420114090,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-3isd9h",
      "updatedAt": 1552420114090,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "99m2ai",
        "tag_2",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1552420114016,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-ly6e81",
      "updatedAt": 1552420114016,
      "favoritesCount": 0,
      "favorited": false
    }
  ]
}
```
### should list articles by author
```
GET /articles?author=authoress-iijri6
```
```
200 OK

{
  "articles": [
    {
      "tagList": [
        "8qj4m6",
        "tag_18",
        "tag_mod_2_0",
        "tag_mod_3_0"
      ],
      "createdAt": 1552420114453,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-lwv54p",
      "updatedAt": 1552420114453,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "e8kdbr",
        "tag_16",
        "tag_mod_2_0",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420114394,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-m6lux",
      "updatedAt": 1552420114394,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_14",
        "tag_mod_2_0",
        "tag_mod_3_2",
        "u6ucsg"
      ],
      "createdAt": 1552420114339,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-vqdycn",
      "updatedAt": 1552420114339,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_12",
        "tag_mod_2_0",
        "tag_mod_3_0",
        "xom5o0"
      ],
      "createdAt": 1552420114284,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-5kximo",
      "updatedAt": 1552420114284,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "h7g4az",
        "tag_10",
        "tag_mod_2_0",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420114238,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-3rc1wv",
      "updatedAt": 1552420114238,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "2lp17p",
        "tag_8",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1552420114162,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-pq1fd5",
      "updatedAt": 1552420114162,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_6",
        "tag_mod_2_0",
        "tag_mod_3_0",
        "vek7nf"
      ],
      "createdAt": 1552420114118,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-a3b6z8",
      "updatedAt": 1552420114118,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "bsj5j",
        "tag_4",
        "tag_mod_2_0",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420114064,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-ju4ghl",
      "updatedAt": 1552420114064,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "99m2ai",
        "tag_2",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1552420114016,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-ly6e81",
      "updatedAt": 1552420114016,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "lltpg2",
        "tag_0",
        "tag_mod_2_0",
        "tag_mod_3_0"
      ],
      "createdAt": 1552420113966,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-kqirn1",
      "updatedAt": 1552420113966,
      "favoritesCount": 0,
      "favorited": false
    }
  ]
}
```
### should list articles favorited by user
```
GET /articles?favorited=non-author-o14kv9
```
```
200 OK

{
  "articles": []
}
```
### should list articles by limit/offset
```
GET /articles?author=author-igrcpd&limit=2
```
```
200 OK

{
  "articles": [
    {
      "tagList": [
        "tag_19",
        "tag_mod_2_1",
        "tag_mod_3_1",
        "z8dzsy"
      ],
      "createdAt": 1552420114484,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-25midn",
      "updatedAt": 1552420114484,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_17",
        "tag_mod_2_1",
        "tag_mod_3_2",
        "xjol7u"
      ],
      "createdAt": 1552420114432,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-s569pr",
      "updatedAt": 1552420114432,
      "favoritesCount": 0,
      "favorited": false
    }
  ]
}
```
```
GET /articles?author=author-igrcpd&limit=2&offset=2
```
```
200 OK

{
  "articles": [
    {
      "tagList": [
        "s4icay",
        "tag_15",
        "tag_mod_2_1",
        "tag_mod_3_0"
      ],
      "createdAt": 1552420114365,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-nfdkzp",
      "updatedAt": 1552420114365,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "cq1n4c",
        "tag_13",
        "tag_mod_2_1",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420114315,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-p2vs40",
      "updatedAt": 1552420114315,
      "favoritesCount": 0,
      "favorited": false
    }
  ]
}
```
### should list articles when authenticated
```
GET /articles
```
```
200 OK

{
  "articles": [
    {
      "tagList": [
        "tag_19",
        "tag_mod_2_1",
        "tag_mod_3_1",
        "z8dzsy"
      ],
      "createdAt": 1552420114484,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-25midn",
      "updatedAt": 1552420114484,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "8qj4m6",
        "tag_18",
        "tag_mod_2_0",
        "tag_mod_3_0"
      ],
      "createdAt": 1552420114453,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-lwv54p",
      "updatedAt": 1552420114453,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_17",
        "tag_mod_2_1",
        "tag_mod_3_2",
        "xjol7u"
      ],
      "createdAt": 1552420114432,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-s569pr",
      "updatedAt": 1552420114432,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "e8kdbr",
        "tag_16",
        "tag_mod_2_0",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420114394,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-m6lux",
      "updatedAt": 1552420114394,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "s4icay",
        "tag_15",
        "tag_mod_2_1",
        "tag_mod_3_0"
      ],
      "createdAt": 1552420114365,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-nfdkzp",
      "updatedAt": 1552420114365,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_14",
        "tag_mod_2_0",
        "tag_mod_3_2",
        "u6ucsg"
      ],
      "createdAt": 1552420114339,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-vqdycn",
      "updatedAt": 1552420114339,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "cq1n4c",
        "tag_13",
        "tag_mod_2_1",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420114315,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-p2vs40",
      "updatedAt": 1552420114315,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_12",
        "tag_mod_2_0",
        "tag_mod_3_0",
        "xom5o0"
      ],
      "createdAt": 1552420114284,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-5kximo",
      "updatedAt": 1552420114284,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "oeg45t",
        "tag_11",
        "tag_mod_2_1",
        "tag_mod_3_2"
      ],
      "createdAt": 1552420114260,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-4mcmle",
      "updatedAt": 1552420114260,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "h7g4az",
        "tag_10",
        "tag_mod_2_0",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420114238,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-3rc1wv",
      "updatedAt": 1552420114238,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "7qkc6b",
        "tag_9",
        "tag_mod_2_1",
        "tag_mod_3_0"
      ],
      "createdAt": 1552420114201,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-nz7t5k",
      "updatedAt": 1552420114201,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "2lp17p",
        "tag_8",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1552420114162,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-pq1fd5",
      "updatedAt": 1552420114162,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "sl98t1",
        "tag_7",
        "tag_mod_2_1",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420114140,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-5sgguc",
      "updatedAt": 1552420114140,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_6",
        "tag_mod_2_0",
        "tag_mod_3_0",
        "vek7nf"
      ],
      "createdAt": 1552420114118,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-a3b6z8",
      "updatedAt": 1552420114118,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "iizvuf",
        "tag_5",
        "tag_mod_2_1",
        "tag_mod_3_2"
      ],
      "createdAt": 1552420114090,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-3isd9h",
      "updatedAt": 1552420114090,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "bsj5j",
        "tag_4",
        "tag_mod_2_0",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420114064,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-ju4ghl",
      "updatedAt": 1552420114064,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_3",
        "tag_mod_2_1",
        "tag_mod_3_0",
        "vdqnqe"
      ],
      "createdAt": 1552420114039,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-48dk2x",
      "updatedAt": 1552420114039,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "99m2ai",
        "tag_2",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1552420114016,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-ly6e81",
      "updatedAt": 1552420114016,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "27pfhb",
        "tag_1",
        "tag_mod_2_1",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420113993,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-8ss5ek",
      "updatedAt": 1552420113993,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "lltpg2",
        "tag_0",
        "tag_mod_2_0",
        "tag_mod_3_0"
      ],
      "createdAt": 1552420113966,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-kqirn1",
      "updatedAt": 1552420113966,
      "favoritesCount": 0,
      "favorited": false
    }
  ]
}
```
### should disallow multiple of author/tag/favorited
```
GET /articles?tag=foo&author=bar
```
```
GET /articles?author=foo&favorited=bar
```
```
GET /articles?favorited=foo&tag=bar
```
## Feed
### should get feed
```
GET /articles/feed
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Only one of these can be specified: [tag, author, favorited]"
    ]
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Only one of these can be specified: [tag, author, favorited]"
    ]
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Only one of these can be specified: [tag, author, favorited]"
    ]
  }
}
```
```
200 OK

{
  "articles": []
}
```
```
POST /profiles/authoress-iijri6/follow

{}
```
```
200 OK

{
  "profile": {
    "username": "authoress-iijri6",
    "bio": "",
    "image": "",
    "following": true
  }
}
```
```
GET /articles/feed
```
```
200 OK

{
  "articles": [
    {
      "tagList": [
        "8qj4m6",
        "tag_18",
        "tag_mod_2_0",
        "tag_mod_3_0"
      ],
      "createdAt": 1552420114453,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-lwv54p",
      "updatedAt": 1552420114453,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "e8kdbr",
        "tag_16",
        "tag_mod_2_0",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420114394,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-m6lux",
      "updatedAt": 1552420114394,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_14",
        "tag_mod_2_0",
        "tag_mod_3_2",
        "u6ucsg"
      ],
      "createdAt": 1552420114339,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-vqdycn",
      "updatedAt": 1552420114339,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_12",
        "tag_mod_2_0",
        "tag_mod_3_0",
        "xom5o0"
      ],
      "createdAt": 1552420114284,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-5kximo",
      "updatedAt": 1552420114284,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "h7g4az",
        "tag_10",
        "tag_mod_2_0",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420114238,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-3rc1wv",
      "updatedAt": 1552420114238,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "2lp17p",
        "tag_8",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1552420114162,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-pq1fd5",
      "updatedAt": 1552420114162,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_6",
        "tag_mod_2_0",
        "tag_mod_3_0",
        "vek7nf"
      ],
      "createdAt": 1552420114118,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-a3b6z8",
      "updatedAt": 1552420114118,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "bsj5j",
        "tag_4",
        "tag_mod_2_0",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420114064,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-ju4ghl",
      "updatedAt": 1552420114064,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "99m2ai",
        "tag_2",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1552420114016,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-ly6e81",
      "updatedAt": 1552420114016,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "lltpg2",
        "tag_0",
        "tag_mod_2_0",
        "tag_mod_3_0"
      ],
      "createdAt": 1552420113966,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-kqirn1",
      "updatedAt": 1552420113966,
      "favoritesCount": 0,
      "favorited": false
    }
  ]
}
```
```
POST /profiles/author-igrcpd/follow

{}
```
```
200 OK

{
  "profile": {
    "username": "author-igrcpd",
    "bio": "",
    "image": "",
    "following": true
  }
}
```
```
GET /articles/feed
```
```
200 OK

{
  "articles": [
    {
      "tagList": [
        "tag_19",
        "tag_mod_2_1",
        "tag_mod_3_1",
        "z8dzsy"
      ],
      "createdAt": 1552420114484,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-25midn",
      "updatedAt": 1552420114484,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "8qj4m6",
        "tag_18",
        "tag_mod_2_0",
        "tag_mod_3_0"
      ],
      "createdAt": 1552420114453,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-lwv54p",
      "updatedAt": 1552420114453,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_17",
        "tag_mod_2_1",
        "tag_mod_3_2",
        "xjol7u"
      ],
      "createdAt": 1552420114432,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-s569pr",
      "updatedAt": 1552420114432,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "e8kdbr",
        "tag_16",
        "tag_mod_2_0",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420114394,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-m6lux",
      "updatedAt": 1552420114394,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "s4icay",
        "tag_15",
        "tag_mod_2_1",
        "tag_mod_3_0"
      ],
      "createdAt": 1552420114365,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-nfdkzp",
      "updatedAt": 1552420114365,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_14",
        "tag_mod_2_0",
        "tag_mod_3_2",
        "u6ucsg"
      ],
      "createdAt": 1552420114339,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-vqdycn",
      "updatedAt": 1552420114339,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "cq1n4c",
        "tag_13",
        "tag_mod_2_1",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420114315,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-p2vs40",
      "updatedAt": 1552420114315,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_12",
        "tag_mod_2_0",
        "tag_mod_3_0",
        "xom5o0"
      ],
      "createdAt": 1552420114284,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-5kximo",
      "updatedAt": 1552420114284,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "oeg45t",
        "tag_11",
        "tag_mod_2_1",
        "tag_mod_3_2"
      ],
      "createdAt": 1552420114260,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-4mcmle",
      "updatedAt": 1552420114260,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "h7g4az",
        "tag_10",
        "tag_mod_2_0",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420114238,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-3rc1wv",
      "updatedAt": 1552420114238,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "7qkc6b",
        "tag_9",
        "tag_mod_2_1",
        "tag_mod_3_0"
      ],
      "createdAt": 1552420114201,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-nz7t5k",
      "updatedAt": 1552420114201,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "2lp17p",
        "tag_8",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1552420114162,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-pq1fd5",
      "updatedAt": 1552420114162,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "sl98t1",
        "tag_7",
        "tag_mod_2_1",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420114140,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-5sgguc",
      "updatedAt": 1552420114140,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_6",
        "tag_mod_2_0",
        "tag_mod_3_0",
        "vek7nf"
      ],
      "createdAt": 1552420114118,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-a3b6z8",
      "updatedAt": 1552420114118,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "iizvuf",
        "tag_5",
        "tag_mod_2_1",
        "tag_mod_3_2"
      ],
      "createdAt": 1552420114090,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-3isd9h",
      "updatedAt": 1552420114090,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "bsj5j",
        "tag_4",
        "tag_mod_2_0",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420114064,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-ju4ghl",
      "updatedAt": 1552420114064,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_3",
        "tag_mod_2_1",
        "tag_mod_3_0",
        "vdqnqe"
      ],
      "createdAt": 1552420114039,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-48dk2x",
      "updatedAt": 1552420114039,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "99m2ai",
        "tag_2",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1552420114016,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-ly6e81",
      "updatedAt": 1552420114016,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "27pfhb",
        "tag_1",
        "tag_mod_2_1",
        "tag_mod_3_1"
      ],
      "createdAt": 1552420113993,
      "author": {
        "username": "author-igrcpd",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-8ss5ek",
      "updatedAt": 1552420113993,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "lltpg2",
        "tag_0",
        "tag_mod_2_0",
        "tag_mod_3_0"
      ],
      "createdAt": 1552420113966,
      "author": {
        "username": "authoress-iijri6",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-kqirn1",
      "updatedAt": 1552420113966,
      "favoritesCount": 0,
      "favorited": false
    }
  ]
}
```
### should disallow unauthenticated feed
```
GET /articles/feed
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Must be logged in."
    ]
  }
}
```
## Tags
### should get tags
```
GET /tags
```
```
200 OK

{
  "tags": [
    "27pfhb",
    "tag_1",
    "tag_mod_2_1",
    "tag_mod_3_1",
    "h7g4az",
    "tag_10",
    "tag_mod_2_0",
    "lltpg2",
    "tag_0",
    "tag_mod_3_0",
    "tag_a",
    "tag_b",
    "tag_19",
    "z8dzsy",
    "sl98t1",
    "tag_7",
    "7qkc6b",
    "tag_9",
    "oeg45t",
    "tag_11",
    "tag_mod_3_2",
    "2lp17p",
    "tag_8",
    "bsj5j",
    "tag_4",
    "8qj4m6",
    "tag_18",
    "tag_17",
    "xjol7u",
    "e8kdbr",
    "tag_16",
    "tag_14",
    "u6ucsg",
    "s4icay",
    "tag_15",
    "tag_3",
    "vdqnqe",
    "cq1n4c",
    "tag_13",
    "iizvuf",
    "tag_5",
    "99m2ai",
    "tag_2",
    "tag_6",
    "vek7nf",
    "tag_12",
    "xom5o0"
  ]
}
```
# Comment
```
POST /users

{
  "user": {
    "email": "author-df75dr@email.com",
    "username": "author-df75dr",
    "password": "password"
  }
}
```
```
200 OK

{
  "user": {
    "email": "author-df75dr@email.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF1dGhvci1kZjc1ZHIiLCJpYXQiOjE1NTI0MjAxMTUsImV4cCI6MTU1MjU5MjkxNX0.lDxggjz4maiDxvd5oG6NBtLj-Tjw8FP9pdPzhv8JmcE",
    "username": "author-df75dr",
    "bio": "",
    "image": ""
  }
}
```
```
POST /users

{
  "user": {
    "email": "commenter-jfyfd4@email.com",
    "username": "commenter-jfyfd4",
    "password": "password"
  }
}
```
```
200 OK

{
  "user": {
    "email": "commenter-jfyfd4@email.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNvbW1lbnRlci1qZnlmZDQiLCJpYXQiOjE1NTI0MjAxMTUsImV4cCI6MTU1MjU5MjkxNX0.w29JCpHUq0I-2W6ABHLGES-qEoPzKDUpKC1EXEMkFYA",
    "username": "commenter-jfyfd4",
    "bio": "",
    "image": ""
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body"
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-kl90de",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1552420115931,
    "updatedAt": 1552420115931,
    "author": {
      "username": "author-df75dr",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
## Create
### should create comment
```
POST /articles/title-kl90de/comments

{
  "comment": {
    "body": "test comment gi80wj"
  }
}
```
```
200 OK

{
  "comment": {
    "id": "8f101960-9da3-4507-b96b-ef2064ccfa1b",
    "slug": "title-kl90de",
    "body": "test comment gi80wj",
    "createdAt": 1552420115969,
    "updatedAt": 1552420115969,
    "author": {
      "username": "commenter-jfyfd4",
      "bio": "",
      "image": "",
      "following": false
    }
  }
}
```
```
POST /articles/title-kl90de/comments

{
  "comment": {
    "body": "test comment bz69ke"
  }
}
```
```
200 OK

{
  "comment": {
    "id": "8d3be471-3aa7-45b6-ada1-4983b51b08d1",
    "slug": "title-kl90de",
    "body": "test comment bz69ke",
    "createdAt": 1552420116008,
    "updatedAt": 1552420116008,
    "author": {
      "username": "commenter-jfyfd4",
      "bio": "",
      "image": "",
      "following": false
    }
  }
}
```
```
POST /articles/title-kl90de/comments

{
  "comment": {
    "body": "test comment hbhiot"
  }
}
```
```
200 OK

{
  "comment": {
    "id": "16dc77b6-d370-4b94-a995-5d692ae9b8b4",
    "slug": "title-kl90de",
    "body": "test comment hbhiot",
    "createdAt": 1552420116044,
    "updatedAt": 1552420116044,
    "author": {
      "username": "commenter-jfyfd4",
      "bio": "",
      "image": "",
      "following": false
    }
  }
}
```
```
POST /articles/title-kl90de/comments

{
  "comment": {
    "body": "test comment 86ts4g"
  }
}
```
```
200 OK

{
  "comment": {
    "id": "6e2acd83-7d4c-4c36-8a19-4316dccbc4a1",
    "slug": "title-kl90de",
    "body": "test comment 86ts4g",
    "createdAt": 1552420116073,
    "updatedAt": 1552420116073,
    "author": {
      "username": "commenter-jfyfd4",
      "bio": "",
      "image": "",
      "following": false
    }
  }
}
```
```
POST /articles/title-kl90de/comments

{
  "comment": {
    "body": "test comment qir6sj"
  }
}
```
```
200 OK

{
  "comment": {
    "id": "c6180049-cf1d-401c-a8cc-7955bf09761e",
    "slug": "title-kl90de",
    "body": "test comment qir6sj",
    "createdAt": 1552420116104,
    "updatedAt": 1552420116104,
    "author": {
      "username": "commenter-jfyfd4",
      "bio": "",
      "image": "",
      "following": false
    }
  }
}
```
```
POST /articles/title-kl90de/comments

{
  "comment": {
    "body": "test comment gnyllf"
  }
}
```
```
200 OK

{
  "comment": {
    "id": "9cea06d1-7b36-4a12-ac76-6394fdc1d730",
    "slug": "title-kl90de",
    "body": "test comment gnyllf",
    "createdAt": 1552420116136,
    "updatedAt": 1552420116136,
    "author": {
      "username": "commenter-jfyfd4",
      "bio": "",
      "image": "",
      "following": false
    }
  }
}
```
```
POST /articles/title-kl90de/comments

{
  "comment": {
    "body": "test comment qredfq"
  }
}
```
```
200 OK

{
  "comment": {
    "id": "76e570e6-2cfc-4430-b979-2c9f3e8e1972",
    "slug": "title-kl90de",
    "body": "test comment qredfq",
    "createdAt": 1552420116167,
    "updatedAt": 1552420116167,
    "author": {
      "username": "commenter-jfyfd4",
      "bio": "",
      "image": "",
      "following": false
    }
  }
}
```
```
POST /articles/title-kl90de/comments

{
  "comment": {
    "body": "test comment 4yrrqp"
  }
}
```
```
200 OK

{
  "comment": {
    "id": "cd933575-3ca0-48f8-81e1-d02f854e3d8c",
    "slug": "title-kl90de",
    "body": "test comment 4yrrqp",
    "createdAt": 1552420116198,
    "updatedAt": 1552420116198,
    "author": {
      "username": "commenter-jfyfd4",
      "bio": "",
      "image": "",
      "following": false
    }
  }
}
```
```
POST /articles/title-kl90de/comments

{
  "comment": {
    "body": "test comment eiqbae"
  }
}
```
```
200 OK

{
  "comment": {
    "id": "7d40adcb-2763-45e3-9cc6-cc40085dc8db",
    "slug": "title-kl90de",
    "body": "test comment eiqbae",
    "createdAt": 1552420116242,
    "updatedAt": 1552420116242,
    "author": {
      "username": "commenter-jfyfd4",
      "bio": "",
      "image": "",
      "following": false
    }
  }
}
```
```
POST /articles/title-kl90de/comments

{
  "comment": {
    "body": "test comment 8vg7x"
  }
}
```
```
200 OK

{
  "comment": {
    "id": "7ce65ecc-b990-45a1-8dc9-62c282eb403a",
    "slug": "title-kl90de",
    "body": "test comment 8vg7x",
    "createdAt": 1552420116280,
    "updatedAt": 1552420116280,
    "author": {
      "username": "commenter-jfyfd4",
      "bio": "",
      "image": "",
      "following": false
    }
  }
}
```
### should disallow unauthenticated user
```
POST /articles/title-kl90de/comments

{}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Must be logged in."
    ]
  }
}
```
### should enforce comment body
```
POST /articles/title-kl90de/comments

{}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Comment must be specified."
    ]
  }
}
```
### should disallow non-existent article
```
POST /articles/foobar/comments

{
  "comment": {
    "body": "test comment clql3d"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Article not found: [foobar]"
    ]
  }
}
```
## Get
### should get all comments for article
```
GET /articles/title-kl90de/comments
```
```
200 OK

{
  "comments": [
    {
      "createdAt": 1552420116198,
      "id": "cd933575-3ca0-48f8-81e1-d02f854e3d8c",
      "body": "test comment 4yrrqp",
      "slug": "title-kl90de",
      "author": {
        "username": "commenter-jfyfd4",
        "bio": "",
        "image": "",
        "following": false
      },
      "updatedAt": 1552420116198
    },
    {
      "createdAt": 1552420116008,
      "id": "8d3be471-3aa7-45b6-ada1-4983b51b08d1",
      "body": "test comment bz69ke",
      "slug": "title-kl90de",
      "author": {
        "username": "commenter-jfyfd4",
        "bio": "",
        "image": "",
        "following": false
      },
      "updatedAt": 1552420116008
    },
    {
      "createdAt": 1552420116280,
      "id": "7ce65ecc-b990-45a1-8dc9-62c282eb403a",
      "body": "test comment 8vg7x",
      "slug": "title-kl90de",
      "author": {
        "username": "commenter-jfyfd4",
        "bio": "",
        "image": "",
        "following": false
      },
      "updatedAt": 1552420116280
    },
    {
      "createdAt": 1552420116044,
      "id": "16dc77b6-d370-4b94-a995-5d692ae9b8b4",
      "body": "test comment hbhiot",
      "slug": "title-kl90de",
      "author": {
        "username": "commenter-jfyfd4",
        "bio": "",
        "image": "",
        "following": false
      },
      "updatedAt": 1552420116044
    },
    {
      "createdAt": 1552420116136,
      "id": "9cea06d1-7b36-4a12-ac76-6394fdc1d730",
      "body": "test comment gnyllf",
      "slug": "title-kl90de",
      "author": {
        "username": "commenter-jfyfd4",
        "bio": "",
        "image": "",
        "following": false
      },
      "updatedAt": 1552420116136
    },
    {
      "createdAt": 1552420116073,
      "id": "6e2acd83-7d4c-4c36-8a19-4316dccbc4a1",
      "body": "test comment 86ts4g",
      "slug": "title-kl90de",
      "author": {
        "username": "commenter-jfyfd4",
        "bio": "",
        "image": "",
        "following": false
      },
      "updatedAt": 1552420116073
    },
    {
      "createdAt": 1552420116104,
      "id": "c6180049-cf1d-401c-a8cc-7955bf09761e",
      "body": "test comment qir6sj",
      "slug": "title-kl90de",
      "author": {
        "username": "commenter-jfyfd4",
        "bio": "",
        "image": "",
        "following": false
      },
      "updatedAt": 1552420116104
    },
    {
      "createdAt": 1552420116242,
      "id": "7d40adcb-2763-45e3-9cc6-cc40085dc8db",
      "body": "test comment eiqbae",
      "slug": "title-kl90de",
      "author": {
        "username": "commenter-jfyfd4",
        "bio": "",
        "image": "",
        "following": false
      },
      "updatedAt": 1552420116242
    },
    {
      "createdAt": 1552420115969,
      "id": "8f101960-9da3-4507-b96b-ef2064ccfa1b",
      "body": "test comment gi80wj",
      "slug": "title-kl90de",
      "author": {
        "username": "commenter-jfyfd4",
        "bio": "",
        "image": "",
        "following": false
      },
      "updatedAt": 1552420115969
    },
    {
      "createdAt": 1552420116167,
      "id": "76e570e6-2cfc-4430-b979-2c9f3e8e1972",
      "body": "test comment qredfq",
      "slug": "title-kl90de",
      "author": {
        "username": "commenter-jfyfd4",
        "bio": "",
        "image": "",
        "following": false
      },
      "updatedAt": 1552420116167
    }
  ]
}
```
## Delete
### should delete comment
```
DELETE /articles/title-kl90de/comments/8f101960-9da3-4507-b96b-ef2064ccfa1b
```
```
200 OK

{}
```
### only comment author should be able to delete comment
```
DELETE /articles/title-kl90de/comments/8d3be471-3aa7-45b6-ada1-4983b51b08d1
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Only comment author can delete: [commenter-jfyfd4]"
    ]
  }
}
```
### should disallow unauthenticated user
```
DELETE /articles/title-kl90de/comments/8d3be471-3aa7-45b6-ada1-4983b51b08d1
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Must be logged in."
    ]
  }
}
```
### should disallow deleting unknown comment
```
DELETE /articles/title-kl90de/comments/foobar_id
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Comment ID not found: [foobar_id]"
    ]
  }
}
```
# User
## Create
### should create user
```
POST /users

{
  "user": {
    "email": "user1-0.yhal7b7c5d@email.com",
    "username": "user1-0.yhal7b7c5d",
    "password": "password"
  }
}
```
```
200 OK

{
  "user": {
    "email": "user1-0.yhal7b7c5d@email.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxLTAueWhhbDdiN2M1ZCIsImlhdCI6MTU1MjQyMDExNiwiZXhwIjoxNTUyNTkyOTE2fQ.jRkFK0qRU121nPp3svD8uTbsSgDwekbxKVXMn4qR37Y",
    "username": "user1-0.yhal7b7c5d",
    "bio": "",
    "image": ""
  }
}
```
### should disallow same username
```
POST /users

{
  "user": {
    "email": "user1-0.yhal7b7c5d@email.com",
    "username": "user1-0.yhal7b7c5d",
    "password": "password"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Username already taken: [user1-0.yhal7b7c5d]"
    ]
  }
}
```
### should disallow same email
```
POST /users

{
  "user": {
    "username": "user2",
    "email": "user1-0.yhal7b7c5d@email.com",
    "password": "password"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Email already taken: [user1-0.yhal7b7c5d@email.com]"
    ]
  }
}
```
### should enforce required fields
```
POST /users

{}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "User must be specified."
    ]
  }
}
```
```
POST /users

{
  "user": {
    "foo": 1
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Username must be specified."
    ]
  }
}
```
```
POST /users

{
  "user": {
    "username": 1
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Email must be specified."
    ]
  }
}
```
```
POST /users

{
  "user": {
    "username": 1,
    "email": 2
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Password must be specified."
    ]
  }
}
```
## Login
### should login
```
POST /users/login

{
  "user": {
    "email": "user1-0.yhal7b7c5d@email.com",
    "password": "password"
  }
}
```
```
200 OK

{
  "user": {
    "email": "user1-0.yhal7b7c5d@email.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxLTAueWhhbDdiN2M1ZCIsImlhdCI6MTU1MjQyMDExNiwiZXhwIjoxNTUyNTkyOTE2fQ.jRkFK0qRU121nPp3svD8uTbsSgDwekbxKVXMn4qR37Y",
    "username": "user1-0.yhal7b7c5d",
    "bio": "",
    "image": ""
  }
}
```
### should disallow unknown email
```
POST /users/login

{
  "user": {
    "email": "0.11ym0y10e179",
    "password": "somepassword"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Email not found: [0.11ym0y10e179]"
    ]
  }
}
```
### should disallow wrong password
```
POST /users/login

{
  "user": {
    "email": "user1-0.yhal7b7c5d@email.com",
    "password": "0.1zukjpf2d1v"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Wrong password."
    ]
  }
}
```
### should enforce required fields
```
POST /users/login

{}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "User must be specified."
    ]
  }
}
```
```
POST /users/login

{
  "user": {}
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Email must be specified."
    ]
  }
}
```
```
POST /users/login

{
  "user": {
    "email": "someemail"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Password must be specified."
    ]
  }
}
```
## Get
### should get current user
```
GET /user
```
```
200 OK

{
  "user": {
    "email": "user1-0.yhal7b7c5d@email.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxLTAueWhhbDdiN2M1ZCIsImlhdCI6MTU1MjQyMDExNiwiZXhwIjoxNTUyNTkyOTE2fQ.jRkFK0qRU121nPp3svD8uTbsSgDwekbxKVXMn4qR37Y",
    "username": "user1-0.yhal7b7c5d",
    "bio": "",
    "image": ""
  }
}
```
### should disallow bad tokens
```
GET /user
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Token not present or invalid."
    ]
  }
}
```
```
GET /user
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Token not present or invalid."
    ]
  }
}
```
```
GET /user
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Token not present or invalid."
    ]
  }
}
```
```
GET /user
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Token not present or invalid."
    ]
  }
}
```
## Profile
### should get profile
```
GET /profiles/user1-0.yhal7b7c5d
```
```
200 OK

{
  "profile": {
    "username": "user1-0.yhal7b7c5d",
    "bio": "",
    "image": "",
    "following": false
  }
}
```
### should disallow unknown username
```
GET /profiles/foo_0.2mgcgkf0hds
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "User not found: [foo_0.2mgcgkf0hds]"
    ]
  }
}
```
### should follow/unfollow user
```
POST /users

{
  "user": {
    "username": "followed_user",
    "email": "followed_user@mail.com",
    "password": "password"
  }
}
```
```
200 OK

{
  "user": {
    "email": "followed_user@mail.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZvbGxvd2VkX3VzZXIiLCJpYXQiOjE1NTI0MjAxMTYsImV4cCI6MTU1MjU5MjkxNn0.FDiJQXjWwddkQm6gOZIaqKxo5qv9Ct1cq9G4pUXuYe4",
    "username": "followed_user",
    "bio": "",
    "image": ""
  }
}
```
```
POST /profiles/followed_user/follow
```
```
200 OK

{
  "profile": {
    "username": "followed_user",
    "bio": "",
    "image": "",
    "following": true
  }
}
```
```
POST /profiles/followed_user/follow
```
```
200 OK

{
  "profile": {
    "username": "followed_user",
    "bio": "",
    "image": "",
    "following": true
  }
}
```
```
GET /profiles/followed_user
```
```
200 OK

{
  "profile": {
    "username": "followed_user",
    "bio": "",
    "image": "",
    "following": true
  }
}
```
```
GET /profiles/followed_user
```
```
200 OK

{
  "profile": {
    "username": "followed_user",
    "bio": "",
    "image": "",
    "following": false
  }
}
```
```
POST /users

{
  "user": {
    "username": "user2-0.mit8v07axaq",
    "email": "user2-0.mit8v07axaq@mail.com",
    "password": "password"
  }
}
```
```
200 OK

{
  "user": {
    "email": "user2-0.mit8v07axaq@mail.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIyLTAubWl0OHYwN2F4YXEiLCJpYXQiOjE1NTI0MjAxMTcsImV4cCI6MTU1MjU5MjkxN30.RjGz26EHPQQah13J5wDiNpoyyIekN1tpD7JHDogqt7g",
    "username": "user2-0.mit8v07axaq",
    "bio": "",
    "image": ""
  }
}
```
```
POST /profiles/followed_user/follow
```
```
200 OK

{
  "profile": {
    "username": "followed_user",
    "bio": "",
    "image": "",
    "following": true
  }
}
```
```
DELETE /profiles/followed_user/follow
```
```
200 OK

{
  "profile": {
    "username": "followed_user",
    "bio": "",
    "image": "",
    "following": false
  }
}
```
```
DELETE /profiles/followed_user/follow
```
```
200 OK

{
  "profile": {
    "username": "followed_user",
    "bio": "",
    "image": "",
    "following": false
  }
}
```
```
DELETE /profiles/followed_user/follow
```
```
200 OK

{
  "profile": {
    "username": "followed_user",
    "bio": "",
    "image": "",
    "following": false
  }
}
```
### should disallow following with bad token
```
POST /profiles/followed_user/follow
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Token not present or invalid."
    ]
  }
}
```
## Update
### should update user
```
PUT /user

{
  "user": {
    "email": "updated-user1-0.yhal7b7c5d@email.com"
  }
}
```
```
200 OK

{
  "user": {
    "username": "user1-0.yhal7b7c5d",
    "email": "updated-user1-0.yhal7b7c5d@email.com",
    "image": "",
    "bio": "",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxLTAueWhhbDdiN2M1ZCIsImlhdCI6MTU1MjQyMDExNiwiZXhwIjoxNTUyNTkyOTE2fQ.jRkFK0qRU121nPp3svD8uTbsSgDwekbxKVXMn4qR37Y"
  }
}
```
```
PUT /user

{
  "user": {
    "password": "newpassword"
  }
}
```
```
200 OK

{
  "user": {
    "username": "user1-0.yhal7b7c5d",
    "email": "updated-user1-0.yhal7b7c5d@email.com",
    "image": "",
    "bio": "",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxLTAueWhhbDdiN2M1ZCIsImlhdCI6MTU1MjQyMDExNiwiZXhwIjoxNTUyNTkyOTE2fQ.jRkFK0qRU121nPp3svD8uTbsSgDwekbxKVXMn4qR37Y"
  }
}
```
```
PUT /user

{
  "user": {
    "bio": "newbio"
  }
}
```
```
200 OK

{
  "user": {
    "username": "user1-0.yhal7b7c5d",
    "bio": "newbio",
    "image": "",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxLTAueWhhbDdiN2M1ZCIsImlhdCI6MTU1MjQyMDExNiwiZXhwIjoxNTUyNTkyOTE2fQ.jRkFK0qRU121nPp3svD8uTbsSgDwekbxKVXMn4qR37Y"
  }
}
```
```
PUT /user

{
  "user": {
    "image": "newimage"
  }
}
```
```
200 OK

{
  "user": {
    "username": "user1-0.yhal7b7c5d",
    "image": "newimage",
    "bio": "newbio",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxLTAueWhhbDdiN2M1ZCIsImlhdCI6MTU1MjQyMDExNiwiZXhwIjoxNTUyNTkyOTE2fQ.jRkFK0qRU121nPp3svD8uTbsSgDwekbxKVXMn4qR37Y"
  }
}
```
### should disallow missing token/email in update
```
PUT /user
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Token not present or invalid."
    ]
  }
}
```
```
PUT /user

{}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "User must be specified."
    ]
  }
}
```
### should disallow reusing email
```
POST /users

{
  "user": {
    "email": "user2-0.2042b70jklb@email.com",
    "username": "user2-0.2042b70jklb",
    "password": "password"
  }
}
```
```
200 OK

{
  "user": {
    "email": "user2-0.2042b70jklb@email.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIyLTAuMjA0MmI3MGprbGIiLCJpYXQiOjE1NTI0MjAxMTcsImV4cCI6MTU1MjU5MjkxN30.9E3IuridNIaJVksttrvvxpys5pFOn68hwJEeemZBdSk",
    "username": "user2-0.2042b70jklb",
    "bio": "",
    "image": ""
  }
}
```
```
PUT /user

{
  "user": {
    "email": "user2-0.2042b70jklb@email.com"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Email already taken: [user2-0.2042b70jklb@email.com]"
    ]
  }
}
```
# Util
## Ping
### should ping
```
GET /ping
```
```
200 OK

{
  "pong": "2019-03-12T19:48:37.404Z",
  "AWS_REGION": "us-east-1",
  "DYNAMODB_NAMESPACE": "dev"
}
```
