import getUserId from "../utils/getUserId.js";

const User={
   email:{
       fragment:`fragment userId on User { id }`,
       resolve(parent,args,{request},info){
            const userId=getUserId(request,false);
            if(userId && userId===parent.id){
                return parent.email
            }else{
                return null;
            }
        }
    },
    posts:{
        fragment:`fragment userId on User { id }`,
        resolve(parent,args,{prisma,request},info){
            const posts=prisma.query.posts({
                where:{
                    published:true,
                    author:{
                        id:parent.id
                    }
                }
            });
            return posts;
        }
    }
};

export {User as default};