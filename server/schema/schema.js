const graphql = require("graphql")
const axios = require("axios")

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
  GraphQLID,
  GraphQLEnumType
} = graphql

// dummy data
var characteristics = [
  { code: "SYS_24", name: "Color", ruleTeamplate: "SYS_24" }
]

const CaseEnum = new GraphQLEnumType({
  name: "Case",
  description: "Case",
  values: {
    NONE: { value: "NONE" },
    UPPERCASE: { value: "UPPERCASE" },
    LOWERCASE: { value: "LOWERCASE" },
    CAPITALIZE: { value: "CAPITALIZE" }
  }
})

var rules = new Map([
  [
    "SYS_04",
    {
      isInline: true,
      isInflow: false,
      showLabel: true,
      isBold: false,
      isItalic: false,
      prefix: "test",
      suffix: "",
      case_: "NONE",
      showUnit: true,
      lineBefore: false,
      lineAfter: false
    }
  ],

  [
    "Default",
    {
      isInline: false,
      isInflow: false,
      showLabel: false,
      isBold: false,
      isItalic: false,
      prefix: "",
      suffix: "",
      case_: "NONE",
      showUnit: false,
      lineBefore: false,
      lineAfter: false
    }
  ]
])

const RulesType = new GraphQLObjectType({
  name: "Rules",
  fields: () => ({
    isInline: { type: new GraphQLNonNull(GraphQLBoolean) },
    isInflow: { type: new GraphQLNonNull(GraphQLBoolean) },
    showLabel: { type: new GraphQLNonNull(GraphQLBoolean) },
    isBold: { type: new GraphQLNonNull(GraphQLBoolean) },
    isItalic: { type: new GraphQLNonNull(GraphQLBoolean) },
    prefix: { type: new GraphQLNonNull(GraphQLString) },
    suffix: { type: new GraphQLNonNull(GraphQLString) },
    case_: { type: new GraphQLNonNull(CaseEnum) },
    showUnit: { type: new GraphQLNonNull(GraphQLBoolean) },
    lineBefore: { type: new GraphQLNonNull(GraphQLBoolean) },
    lineAfter: { type: new GraphQLNonNull(GraphQLBoolean) }
  })
})

const CharacteristicType = new GraphQLObjectType({
  name: "CharacteristicType",
  fields: () => ({
    code: { type: GraphQLString },
    name: { type: GraphQLString },
    domainCode: { type: GraphQLString },
    unitOfMeasurement: { type: GraphQLString },
    rules: {
      type: new GraphQLNonNull(RulesType),
      resolve(parent, args) {
        let rulesChar = rules.get(parent.code)
        return rulesChar || rules.get("Default")
      }
    }
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
    },

    rules: {
      type: RulesType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return rules.get(args.id)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})
