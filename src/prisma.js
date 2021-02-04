import {Prisma} from "prisma-binding";
import {fragmentReplacements} from "./resolvers/index.js";

const prisma = new Prisma({
    typeDefs:"src/generated/prisma.graphql",
    endpoint:process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET,
    fragmentReplacements
})

export {prisma as default}

/*prisma.query.users(null,"{ id name posts{id title}}").then((data)=>{
    console.log(JSON.stringify(data,undefined,4));
})

prisma.query.comments(null,"{id text author{id name}}").then((data)=>{
    console.log(JSON.stringify(data,undefined,2));
})*/
/*prisma.query.posts(null,"{id title body}").then((data)=>{
    console.log(JSON.stringify(data,undefined,2));
})
/*prisma.mutation.createPost({
    data:{
        title:"Graphql 101",
        body:"You can find the new course here",
        published:false,
        author:{
            connect:{
                id:"ckjzwxxst00jd08106nxz6dta"
            }
        }
    }
},"{id title body published}").then((data)=>{
    console.log(data);
    return prisma.query.users(null,"{id name posts{id title}}")
}).then((data)=>{
    console.log(JSON.stringify(data,undefined,2));
})
*/

/*prisma.mutation.updatePost({
    data:{
        body:"Graphql 102",
        published:true
    },
    where:{
        id:"ckk02mz5300u10810rqbugrnt"
    }
},"{id title body,published}").then((data)=>{
    console.log(data);
    return prisma.query.posts(null,"{id title body published}")
}).then((data)=>{
    console.log(data);
})*/

/*const createPostforUser=async(authorId,data)=>{
    const userExist=await prisma.exists.User({id:authorId});
    if(!userExist){
        throw new Error("User not found");
    }
    const post=await prisma.mutation.createPost({
        data:{
            ...data,
            author:{
                connect:{
                    id:authorId
                }
            }
        }
    },"{author {id name email posts{id title published}}}")
    return post.author;
}

/*createPostforUser("ckjzuov1000bk0810qh60q5fp",{
    title:"Great books to understand",
    body:"good books",
    published:true
}).then((user)=>{
    console.log(user);
}).catch((error)=>{
    console.log(error.message);
})
*/
/*const updatePostforUser=async(postId,data)=>{
    const postExist=await prisma.exists.Post({id:postId});
    if(!postExist){
        throw new Error("Post not found");
    }
    const post=await prisma.mutation.updatePost({
        data,
        where:{
            id:postId
        }
    },"{author{id name email posts{id title published}}}");
    return post.author;
}

/*updatePostforUser("ckk1blael01x20810k325m5ai",{
    title:"Great books for you II"
}).then((user)=>{
    console.log(user);
}).catch((error)=>{
    console.log(error.message);
})
*/