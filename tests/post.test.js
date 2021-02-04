import "cross-fetch/polyfill";
import seedDatabase,{userOne,postOne,postTwo} from "./utils/seedDatabase.js";
import getClient from "./utils/getClient.js";
import prisma from "../src/prisma.js";
import {getPosts,getmyPosts,updatePost,createPost,deletePost,subscribeToPosts} from "./utils/operations.js";
import ApolloBoost,{gql} from "apollo-boost";

const client= getClient();

beforeEach(seedDatabase);

test("should expose published posts",async ()=>{
    const response=await client.query({
        query:getPosts
    });
    expect(response.data.posts.length).toBe(1);
    expect(response.data.posts[0].published).toBe(true);
});

test("should fetch myPosts",async()=>{
    const client=getClient(userOne.jwt);
    const {data}=await client.query({query:getmyPosts});
    expect(data.myPosts.length).toBe(2);
});

test("should be able to update own post",async ()=>{
    const variables={
        id:postOne.post.id,
        data:{
            published:false
        }
    }
    const client=getClient(userOne.jwt);
    const {data}=await client.mutate({mutation:updatePost,variables});
    const exists=await prisma.exists.Post({id:data.updatePost.id,published:false})
    expect(exists).toBe(true);
    expect(data.updatePost.published).toBe(false)
});

test("should able to createPost",async()=>{
    const variables={
        data:{
            title:"create a new post",
            body:"body of the new post",
            published:true
        }
    }
    const client=getClient(userOne.jwt);
    const {data}=await client.mutate({mutation:createPost,variables});
    const exists=await prisma.exists.Post({id:data.createPost.id,published:true});
    expect(exists).toBe(true);
    expect(data.createPost.published).toBe(true);
})

test("should be able to delete post",async()=>{
    const variables={
        id:postTwo.post.id
    }
    const client=getClient(userOne.jwt);
    const {data}=await client.mutate({mutation:deletePost,variables});
    const exists=await prisma.exists.Post({id:data.deletePost.id});
    expect(exists).toBe(false);
})

test("should subscribe to posts",async(done)=>{
    client.subscribe({
        query:subscribeToPosts
    }).subscribe({
        next(response){
            expect(response.data.post.mutation).toBe("DELETED");
            done();
        }
    });
    await prisma.mutation.deletePost({
        where:{
            id:postOne.post.id
        }
    })
    
})