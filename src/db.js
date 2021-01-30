const users=[{
    id:"1",
    name:"allen",
    email:"hello@343.com",
    age:28
},{
    id:"2",
    name:"Sam",
    email:"Sam@343.com",
    age:28
},{
    id:"3",
    name:"Max",
    email:"Max@343.com",
    age:28
}]

const posts=[{
    id:"10",
    title:"hello world",
    body:"hello",
    published:false,
    author:"1",
},{
    id:"11",
    title:"hi",
    body:"hello",
    published:true,
    author:"1",
},{
    id:"12",
    title:"mercy",
    body:"hello",
    published:false,
    author:"2",
}];

const comments=[{
    id:"102",
    text:"comment1",
    author:"3",
    post:"10"
},{
    id:"103",
    text:"comment2",
    author:"1",
    post:"10"
},{
    id:"104",
    text:"comment3",
    author:"2",
    post:"11"
},{
    id:"105",
    text:"comment4",
    author:"1",
    post:"12"
}]

const db={
    users,
    posts,
    comments
}

export {db as default};
