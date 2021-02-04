const getUserFirstName=()=>{
    const fullname="Tuo Zhang";
    return fullname.split(" ")[0];
}

const isValidPassword=(password)=>{
    return password.length>=8&&password.toLowerCase().includes("password");
}

export {getUserFirstName,isValidPassword};