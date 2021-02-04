import bcrypt from "bcryptjs";
import prisma from "../../src/prisma.js";
import jwt from "jsonwebtoken";

jest.setTimeout(50000);
const userOne={
    input:{
        name:"Emily",
        email:"emilyzhao1@gmail.com",
        password:bcrypt.hashSync("red12345678")
    },
    user:undefined,
    jwt:undefined
}

const userTwo={
    input:{
        name:"Emily1",
        email:"emilyzhao2@gmail.com",
        password:bcrypt.hashSync("red12345678")
    },
    user:undefined,
    jwt:undefined
}

const postOne={
    input:{
        title:"my published post",
        body:"new post body 1",
        published:true,
    },
    post:undefined
}

const postTwo={
    input:{
        title:"my draft post",
        body:"new post body 2",
        published:false,
    },
    post:undefined
}

const commentOne={
    input:{
        text:"my test text 1"
    },
    comment:undefined
}

const commentTwo={
    input:{
        text:"my test text 2"
    },
    comment:undefined
}

const seedDatabase=async()=>{
    await prisma.mutation.deleteManyComments();
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyUsers();
    userOne.user=await prisma.mutation.createUser({
        data:userOne.input
    });
    userTwo.user=await prisma.mutation.createUser({
        data:userTwo.input
    });
    userOne.jwt=jwt.sign({userId:userOne.user.id},process.env.JWT_SECRET);
    userTwo.jwt=jwt.sign({userId:userTwo.user.id},process.env.JWT_SECRET);
    postOne.post=await prisma.mutation.createPost({
        data:{
            ...postOne.input,
            author:{
                connect:{
                    id:userOne.user.id
                }
            }
        }
    });
    postTwo.post=await prisma.mutation.createPost({
        data:{
            ...postTwo.input,
            author:{
                connect:{
                    id:userOne.user.id
                }
            }
        }
    })
   commentOne.comment=await prisma.mutation.createComment({
        data:{
            ...commentOne.input,
            author:{
                connect:{
                    id:userTwo.user.id
                }
            },
            post:{
                connect:{
                    id:postOne.post.id
                }
            }
        }
    });
    commentTwo.comment=await prisma.mutation.createComment({
        data:{
            ...commentTwo.input,
            author:{
                connect:{
                    id:userOne.user.id
                }
            },
            post:{
                connect:{
                    id:postOne.post.id
                }
            }
        }
    });
    
}

export {seedDatabase as default,userOne,userTwo,postOne,postTwo,commentOne,commentTwo}