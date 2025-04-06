import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList } from "graphql";
import Flight from "../models/Flight.js";

const FlightType = new GraphQLObjectType({
  name: "Flight",
  fields: () => ({
    id: { type: GraphQLInt },
    source: { type: GraphQLString },
    destination: { type: GraphQLString },
    date: { type: GraphQLString },
    departure_time: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    flights: {
      type: new GraphQLList(FlightType),
      resolve: async () => await Flight.findAll(),
    },
    flight: {
      type: FlightType,
      args: { id: { type: GraphQLInt } },
      resolve: async (parent, args) => await Flight.findByPk(args.id),
    },
  },
});

export default new GraphQLSchema({ query: RootQuery });
