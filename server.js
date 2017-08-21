const express = require('express'),
    expressGraphQL = require('express-graphql'),
    schema = require('./schema.js'),
    app = express(),
    axios = require('axios'),
    redis = require('redis'),
    client = redis.createClient(),
    fs = require('fs')

app.use('/graphql', expressGraphQL({schema: schema, graphiql: true}))

// var jsonServer = require('json-server') var server = jsonServer.create()
// server.use(jsonServer.defaults) server.use('/customers',
// jsonServer.router('customers.json')) server.use('/sources',
// jsonServer.router('sources.json')) server.listen(3000)

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
                    console.log("I: " + i)
                    data["sources"].push(sources[i])
                }
                fs.writeFile("./sources.json", JSON.stringify(data))
            })
    })

    console.log('Server is listening at localhost:4000')
})