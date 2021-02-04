import "cross-fetch/polyfill";
import prisma from "../src/prisma.js";
import seedDatabase,{userOne} from "./utils/seedDatabase.js";
import getClient from "./utils/getClient.js";
import {createUser,getUser,login,getProfile,signup} from "./utils/operations.js";
import ApolloBoost,{gql} from "apollo-boost";

const client= getClient();
beforeEach(seedDatabase);

test("should create a new user",async()=>{
    const variables={
        data:{
            name:"Emily",
            email:"Emily1@gmail.com",
            password:"red123456789"
        }
    }
    const response=await client.mutate({
        mutation:createUser,
        variables
    });
    const exists=await prisma.exists.User({id:response.data.createUser.user.id});
    expect(exists).toBe(true);
})

test("should expose public author profiles",async()=>{
    const response=await client.query({
        query:getUser
    });
    expect(response.data.users[0].email).toBe(null);
    expect(response.data.users[0].name).toBe("Emily");
    expect(response.data.users.length).toBe(2);
})


test("should not login with bad credentials",async()=>{
    const variables={
        data:{
            email:"Emily1@gmail.com",
            password:"red123456789"
        }
    }
    await expect(
        client.mutate({
            mutation:login,
            variables
        })
    ).rejects.toThrow();

})

test("You cannot signup with short password",async()=>{
    const variables={
        data:{
            name:"allen",
            password:"123",
            email:"allen@12.com"
        }
    }
    await expect(
        client.mutate({
            mutation:signup,
            variables
        })
    ).rejects.toThrow();
})

test('should fetch user profile',async ()=>{
    const client=getClient(userOne.jwt);
    const {data}=await client.query({query:getProfile});
    expect(data.me.id).toBe(userOne.user.id);
    expect(data.me.name).toBe(userOne.user.name);
    expect(data.me.email).toBe(userOne.user.email);

})