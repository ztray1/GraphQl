import "cross-fetch/polyfill";
import seedDatabase,{userOne,postOne,postTwo,commentOne,commentTwo} from "./utils/seedDatabase.js";
import getClient from "./utils/getClient.js";
import prisma from "../src/prisma.js";
import {deleteComment,subscribeToComments} from "./utils/operations.js";
import ApolloBoost,{gql} from "apollo-boost";
import { extractFragmentReplacements } from "prisma-binding";

const client= getClient();

beforeEach(seedDatabase);

test("should delete own comments",async ()=>{
    const client=await getClient(userOne.jwt);
    const variables={
        id:commentTwo.comment.id
    }
    await client.mutate({
        mutation:deleteComment,
        variables
    });
    const exists=await prisma.exists.Comment({
        id:commentTwo.comment.id
    });
    expect(exists).toBe(false);
});

test("should not delete other users comment",async()=>{
    const client=await getClient(userOne.jwt);
    const variables={
        id:commentOne.comment.id
    };
    await expect(client.mutate({
        mutation:deleteComment,
        variables
    })).rejects.toThrow();
});

test("should subscribe comments to a post",async(done)=>{
    const variables={
        postId:postOne.post.id
    };
    client.subscribe({
        query:subscribeToComments,
        variables 
    }).subscribe({
        next(response){
            expect(response.data.comment.mutation).toBe("DELETED");
            done();
        }
    });
    await prisma.mutation.deleteComment({
        where:{
            id:commentOne.comment.id
        }
    })
})