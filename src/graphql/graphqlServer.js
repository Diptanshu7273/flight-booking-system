import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema.js";

const router = express.Router();

router.use(
  "/",
  graphqlHTTP({
    schema,
    graphiql: true, // enable GraphiQL UI
  })
);

export default router;
