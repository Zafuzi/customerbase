const {
        GraphQLObjectType,
        GraphQLString,
        GraphQLInt,
        GraphQLSchema,
        GraphQLList,
        GraphQLNonNull
    } = require('graphql')

    const axios = require('axios'),
        redis = require('redis'),
        client = redis.createClient()

    client.on("error", function (err) {
        console.log("Error " + err);
    });

    // Customer Type
    const CustomerType = new GraphQLObjectType({
        name: 'Customer',
        description: 'Each customer represented in our database used by the test application.',
        fields: () => ({
            id: {
                type: GraphQLString
            },
            name: {
                type: GraphQLString
            },
            email: {
                type: GraphQLString
            },
            age: {
                type: GraphQLInt
            }
        })
    })

    const SourceType = new GraphQLObjectType({
        name: 'SourceType',
        fields: () => ({
            id: {
                type: GraphQLString
            },
            name: {
                type: GraphQLString
            },
            description: {
                type: GraphQLString
            },
            url: {
                type: GraphQLString
            },
            category: {
                type: GraphQLString
            },
            language: {
                type: GraphQLString
            },
            country: {
                type: GraphQLString
            },
            urlsToLogos: {
                type: GraphQLString
            },
            sortsByAvailables: {
                type: GraphQLString
            }
        })
    })

    const ArticleType = new GraphQLObjectType({
        name: 'Article',
        fields: () => ({
            author: {
                type: GraphQLString
            },
            title: {
                type: GraphQLString
            },
            description: {
                type: GraphQLString
            },
            url: {
                type: GraphQLString
            },
            urlToImage: {
                type: GraphQLString
            },
            publishedAt: {
                type: GraphQLString
            }
        })
    })

    const ArticleListType = new GraphQLObjectType({
        name: 'ArticleList',
        fields: () => ({
            status: {
                type: GraphQLString
            },
            source: {
                type: GraphQLString
            },
            sortBy: {
                type: GraphQLString
            },
            articles: {
                type: new GraphQLList(ArticleType)
            }
        })
    })

    // Root Query
    const RootQuery = new GraphQLObjectType({
        name: 'RootQueryType',
        description: "Root Query is the default query to load customer data",
        fields: {
            customer: {
                type: CustomerType,
                args: {
                    id: {
                        type: GraphQLString
                    }
                },
                resolve(parentValue, args) {
                    return axios
                        .get('http://localhost:3000/customers/' + args.id)
                        .then(res => res.data)
                }
            },
            customers: {
                type: new GraphQLList(CustomerType),
                resolve(parentValue, args) {
                    return axios
                        .get('http://localhost:3000/customers/')
                        .then(res => res.data)
                }
            },
            sources: {
                type: new GraphQLList(SourceType),
                resolve: async(parentValue, args) => {
                    return axios
                        .get('http://localhost:3000/sources/')
                        .then(res => res.data)
                }
            },
            article: {
                type: ArticleListType,
                args: {
                    id: {
                        type: GraphQLString
                    }
                },
                resolve(parentValue, args) {
                    return axios
                        .get('https://newsapi.org/v1/articles?apiKey=ccfdc66609fc4b7b87258020b85d4380&source=' + args.id)
                        .then(res => res.data)
                }
            }
        }
    })

    // Mutations
    const mutation = new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            addCustomer: {
                type: CustomerType,
                args: {
                    name: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    email: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    age: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve(parentValue, args) {
                    return axios
                        .post('http://localhost:3000/customers', {
                        name: args.name,
                        email: args.email,
                        age: args.age
                    })
                        .then(res => res.data)
                }
            },
            deleteCustomer: {
                type: CustomerType,
                args: {
                    id: {
                        type: GraphQLString
                    }
                },
                resolve(parentValue, args) {
                    return axios
                        .delete('http://localhost:3000/customers/' + args.id)
                        .then(res => res.data)
                }
            }
        }
    })

    module.exports = new GraphQLSchema({query: RootQuery, mutation})