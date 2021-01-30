import uuidv4 from "uuid/v4.js";
import bcrypt from "bcryptjs";
import getUserId from "../utils/getUserId.js";
import generateToken from "../utils/generateToken.js";
import hashpassword from "../utils/hashPassword.js";

const Mutation={
    async createUser(parent,args,{prisma},info){
        //console.log(args.data);
        /*const emailTaken=await prisma.exists.User({email:args.data.email});
        if(emailTaken){
            throw new Error("Email taken");
        }*/
        const password=await hashpassword(args.data.password);
        const user = prisma.mutation.createUser({
            data:{
                ...args.data,
                password
            }
        });
        return {
            user,
            token:generateToken(user.id)
        }
    },
    async login(parent,args,{prisma},info){
        const user=await prisma.query.user({
            where:{
                email:args.data.email
            }
        })
        if(!user){
            throw new Error("user not found");
        }

        const isMatch=await bcrypt.compare(args.data.password,user.password);
        if(!isMatch){
            throw new Error("unable to login");
        }
        return {
            user,
            token:generateToken(user.id)
        }

    },
    async deleteUser(parent,args,{prisma,request},info){
        const userId=getUserId(request);
        return prisma.mutation.deleteUser({where:{id:userId}},info);
    },
    async updateUser(parent,args,{prisma,request},info){
        const userId=getUserId(request);
        if(typeof args.data.password==="string"){
            args.data.password=await hashpassword(args.data.password);
        }
        return prisma.mutation.updateUser({
            where:{
                id:userId
            },
            data:args.data
        },info);
        /*const {id,data}=args;
        const user=db.users.find((user)=>user.id===id);
        if(!user){
            throw new Error("user not found");
        }
        if(typeof data.email==="string"){
            const emailTaken=db.users.some((user)=>user.email===data.email)
            if(emailTaken){
                throw new Error("Email taken");
            }
            user.email=data.email;
        }
        if(typeof data.name==="string"){
            user.name=data.name;
        }

        if(typeof data.age!=="undefined"){
            user.age=data.age;
        }
        return user;*/
    },
    async createPost(parent,args,{prisma,request},info){
        const userId=getUserId(request);
        console.log(info);
        /*const post={
            id:uuidv4(),
            ...args.data
        }
        db.posts.push(post);
        if(args.data.published)
        {
            pubsub.publish(`post`,{
                post:{
                    mutation:"CREATED",
                    data:post
                }
            });
        }
        return post;*/
        return prisma.mutation.createPost({
            data:{
                title:args.data.title,
                body:args.data.body,
                published:args.data.published,
                author:{
                    connect:{
                        id:userId
                    }
                }
            }

        },info);
    },
    async updatePost(parent,args,{prisma,request},info){
        /*const {id,data}=args;
        const post=db.posts.find((post)=>post.id===id);
        const originalPost={...post};
        if(!post){
            throw new Error("post not found");
        }
        if(typeof data.title==="string"){
            post.title=data.title;
        }
        if(typeof data.body==="string"){
            post.body=data.body;
        }

        if(typeof data.published==="boolean"){
            post.published=data.published;
            if(originalPost.published&&!post.published)
            {
                pubsub.publish("post",{
                    post:{
                        mutation:"DELETED",
                        data:originalPost
                    }
                })
            }else if(!originalPost.published&&post.published)
            {
                pubsub.publish("post",{
                    post:{
                        mutation:"CREATED",
                        data:post
                    }
                })
            }
        }else if(post.published){
            pubsub.publish("post",{
                post:{
                    mutation:"UPDATED",
                    data:post
                }
            })
        }
        return post;*/
        const userId=getUserId(request);
        const postExists=await prisma.exists.Post({
            id:args.id,
            author:{
                id:userId
            }
        });
        const isPublished=await prisma.exists.Post({
            id:args.id,
            published:true
        })
        if(!postExists){
            throw new Error("posts not exists");
        };
        if(isPublished&&args.data.published===false){
            await prisma.mutation.deleteManyComments({
                where:{
                    post:{
                        id:args.id
                    }
                }
            })
        }
        return prisma.mutation.updatePost({
            data:args.data,
            where:{
                id:args.id
            }
        },info)
    },
    async deletePost(parent,args,{prisma,request},info){
        /*const postIndex=db.posts.findIndex((post)=>post.id===args.id)
        if(postIndex===-1){
            throw new Error("post is not found");
        };
        const [post]=db.posts.splice(postIndex,1);
        db.comments=db.comments.filter((comment)=>comment.post!==args.id);
        if(post.published){
            pubsub.publish("post",{
                post:{
                    mutation:"DELETED",
                    data:post
                }
            })
        }
        
        return post;*/
        const userId=getUserId(request);
        const postExists=await prisma.exists.Post({
            id:args.id,
            author:{
                id:userId
            }
        })
        if(!postExists){
            throw new Error("unable to delete post");
        }
        return prisma.mutation.deletePost({
            where:{
                id:args.id
            }
        },info);
    },
    async createComment(parent,args,{prisma,request},info){
        /*const userExist=db.users.some((user)=>user.id===args.data.author);
        const postExist=db.posts.some((post)=>post.id===args.data.post&&post.published);
        if(!(userExist&&postExist)){
            throw new Error("posts or user not exist");
        }
        const comment={
            id:uuidv4(),
            ...args.data
        }
        db.comments.push(comment);
        pubsub.publish(`comment ${args.data.post}`,{
            comment:{
                mutation:"CREATED",
                data:comment
            }
        });
        return comment;*/
        const userId=getUserId(request);
        const postExists=await prisma.exists.Post({
            id:args.data.post,
            published:true
        });
        if(!postExists){
            throw new Error("post is not published");
        }
        return prisma.mutation.createComment({
            data:{
                text:args.data.text,
                author:{
                    connect:{
                        id:userId
                    }
                },
                post:{
                    connect:{
                        id:args.data.post
                    }
                }
            }
        },info);
    },
    async deleteComment(parent,args,{prisma,request},info){
        /*const commentIndex=db.comments.findIndex((comment)=>comment.id===args.id)
        if(commentIndex===-1){
            throw new Error("comment is not found");
        };
        const [deletedComments]=db.comments.splice(commentIndex,1);
        pubsub.publish(`comment ${deletedComments.post}`,{
            comment:{
                mutation:"DELETED",
                data:deletedComments
            }
        });
        return deletedComments;*/
        const userId=getUserId(request);
        const commentExist=await prisma.exists.Comment({
            id:args.id,
            author:{
                id:userId
            }
        })
        if(!commentExist){
            throw new Error("Comment not exists");
        }
        return prisma.mutation.deleteComment({
            where:{
                id:args.id
            }
        },info);
    },
    async updateComment(parent,args,{prisma,request},info){
        /*const {id,data}=args;
        const comment=db.comments.find((comment)=>comment.id===id);
        if(!comment){
            throw new Error("Comment not found");
        }
        if(typeof data.text==="string")
        {
            comment.text=data.text;
        }
        pubsub.publish(`comment ${comment.post}`,{
            comment:{
                mutation:"UPDATED",
                data:comment
            }
        });
        return comment;*/
        const userId=getUserId(request);
        const commentExist=await prisma.exists.Comment({
            id:args.id,
            author:{
                id:userId
            }
        })
        if(!commentExist){
            throw new Error("comment not exists");
        }
        return prisma.mutation.updateComment({
            data:args.data,
            where:{
                id:args.id
            }
        },info);
    }
};

export {Mutation as default};