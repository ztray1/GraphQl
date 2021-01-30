import getUserId from "../utils/getUserId.js";

const Subscription={
    comment:{
        subscribe(parent,{postId},{prisma},info){
            /*const post=db.posts.find((post)=>post.id===postId&&post.published)
            if(!post){
                throw new Error("post not found");
            }
            return pubsub.asyncIterator(`comment ${postId}`);*/
            return prisma.subscription.comment({
                where:{
                    node:{
                        post:{
                            id:postId
                        }
                    }
                }
            },info);
        }
    },
    post:{
        subscribe(parent,args,{prisma},info){
            return prisma.subscription.post({
                where:{
                    node:{
                       published:true 
                    }
                }
            },info) 
        }
    },
    myPost:{
        subscribe(parent,args,{prisma,request},info){
            const userId=getUserId(request);
            return prisma.subscription.post({
                where:{
                    node:{
                        author:{
                            id:userId
                        }
                    }
                }
            },info)
        }
    }
}

export {Subscription as default};