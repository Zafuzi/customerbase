const express = require('express'),
    expressGraphQL = require('express-graphql'),
    schema = require('./schema.js'),
    app = express(),
    axios = require('axios'),
    redis = require('redis'),
    client = redis.createClient()

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))

app.listen(4000, () => {
    axios.get('https://newsapi.org/v1/sources?language=en')
        .then(res => {
            //console.log(res.data.sources);
            client.set('sources', JSON.stringify(res.data.sources))
        })
    console.log('Server is listening at localhost:4000')
})