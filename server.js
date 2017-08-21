const express = require('express'),
    expressGraphQL = require('express-graphql'),
    schema = require('./schema.js'),
    app = express(),
    axios = require('axios'),
    redis = require('redis'),
    client = redis.createClient(),
    fs = require('fs')

app.use('/graphql', expressGraphQL({schema: schema, graphiql: true}))

app.listen(4000, () => {
    process.once('SIGUSR2', () => {
        axios
            .get('https://newsapi.org/v1/sources?language=en')
            .then(res => {
                let sources = res.data.sources
                let data = {
                    "sources": []
                }
                for (let i = 0; i < sources.length; i++) {
                    data["sources"].push(sources[i])
                    axios.post('https://api.graph.cool/simple/v1/cj6lavmtv1sfn01651b4x0f00/source', {
                        sourceId: source.id,
                        name: source.name,
                        url: source.url,
                        description: source.description,
                        category: source.category,
                        language: source.language,
                        country: source.country
                    })
                }
                // for (let source in sources) {     source = sources[source]     axios
                // .get('https://newsapi.org/v1/articles?apiKey=ccfdc66609fc4b7b87258020b85d4380
                // &source=' + source.id)         .then(res => {             let articles =
                // res.data.articles             axios.post('http://localhost:3000/' +
                // source.id, {articles: articles})             //client.set("articles:" +
                // source.id, JSON.stringify(articles))         }) }
                client.set('sources', JSON.stringify(sources))

            })
    })

    console.log('Server is listening at localhost:4000')
})