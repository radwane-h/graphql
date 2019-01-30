const graphql = require('graphql')

const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql

// dummy data
var characteristics = [
    { code: 'SYS_24', name: 'Color' }
]

const CharacteristicType = new GraphQLObjectType({
    name:'Characteristic',
    fields: () => ({
        code: { type: GraphQLString },
        name: { type: GraphQLString }
    })
})

const RootQuery = new GraphQLObjectType ({
    name: 'RootQueryType',
    fields: {
        characteristic: {
            type: CharacteristicType,
            args: { code: { type: GraphQLString }},
            resolve(parent, args){
                return characteristics[0]
            }
        }
    }
})

module.exports = new GraphQLSchema ({
    query: RootQuery
})