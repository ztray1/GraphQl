import jwt from "jsonwebtoken";

const getUserId=(request,requireAuth=true)=>{
    const header=request.request?request.request.headers.authorization : request.connection.context.Authorization;

    if(header){
        const token=header.replace("Bearer ","");
        const decoded=jwt.verify(token,"thisissecret");
        return decoded.userId;
    }
    if(requireAuth){
        throw new Error("Authorization required");
    }
    return null;
}

export {getUserId as default}