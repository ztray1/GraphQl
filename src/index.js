import "@babel/polyfill/noConflict.js";
import {GraphQLServer,PubSub} from "graphql-yoga";
import db from "./db.js";
import prisma from "./prsima.js";
import {resolvers,fragmentReplacements} from "./resolvers/index.js";

const pubsub=new PubSub();

const server=new GraphQLServer({
    typeDefs:"./src/schema.graphql",
    resolvers,
    context(request){
        return {
            db,
            pubsub,
            prisma,
            request
        }
    },
    fragmentReplacements
})

server.start({port:process.env.PORT||4000},()=>{
    console.log("the server is up!");
})