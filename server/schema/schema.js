const graphql = require("graphql")
const axios = require("axios")

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLList
} = graphql

// dummy data
var characteristics = [{ code: "SYS_24", name: "Color" }]

const CharacteristicType = new GraphQLObjectType({
  name: "CharacteristicType",
  fields: () => ({
    code: { type: GraphQLString },
    name: { type: GraphQLString },
    domainCode: { type: GraphQLString },
    unitOfMeasurement: { type: GraphQLString }
  })
})

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    characteristic: {
      type: CharacteristicType,
      args: { code: { type: GraphQLString } },
      async resolve(parent, args) {
        return await axios
          .get(
            `http://pp-api-pim.vpback.vpgrp.io/v1/nomenclature/characteristic/${
              args.code
            }`
          )
          .then(resp => resp.data)
      }
    },

    characteristics: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(CharacteristicType))
      ),
      args: { code: { type: GraphQLString } },
      async resolve(parent, args) {
        return await axios
          .get(
            `http://pp-api-pim.vpback.vpgrp.io/v1/nomenclature/category/${
              args.code
            }/characteristics`
          )
          .then(resp => resp.data)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})
