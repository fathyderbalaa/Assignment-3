import {createReadStream,createWriteStream} from "fs";
import { createGzip } from "zlib";
import http from "http";
import { users } from './users.js';

// 1

//const readStreeam = createReadStream("./source.txt",'utf-8')
//readStreeam.on("data",(chunk)=>{
    //console.log(chunk);
   // })

// 2
//const writeStream=createWriteStream("./dest.txt",'utf-8')
//const readStream = createReadStream("./source.txt",'utf-8')
//let data = ""
//readStream.on("data",(chunk)=>{
  //  data+=chunk
    //writeStream.write(data)
//})
 
//3
//const readStreaam = createReadStream("./data.txt",'utf-8')
//const gzip = createGzip();
//const writeStreaam=createWriteStream("./data.txt.gz",'utf-8')
//readStreaam.pipe(gzip).pipe(writeStreaam)
 
// P2

const server = http.createServer((req, res) => { 
  const url = req.url;
  const method = req.method;
  const splitedUrl = url.split("/");
  const id = splitedUrl[2];

console.log({ url, method });
if (splitedUrl[1] == "user") {
  

  if ( method == "GET" && id ) {
   const user = users.find((ele)=>(ele.id == id))
    if(!user){
      res.write("user not found")
     return res.end()
    }
    const us = JSON.stringify(user)
    res.write(us)
      res.end()

  }else if(method == "GET" ){
const us = JSON.stringify(users)
    res.write(us);

  res.end();
  }else if( method == "DELETE"){
   deleteUser(req,res,id)


}else if( method == "POST"){
  
  newUser(req,res)

}else if( method == "PATCH"){

  updateUser(req,res,id)
} else {
    res.write("invalid url");

  }

}})


const newUser=(req,res)=>{
  let data = ''  
  req.on('data',(chunk)=>{
    data += chunk
  })
  req.on('end',()=>{
    data= JSON.parse(data)
    const {email,name}= data
   const index = users.findIndex((ele)=>{
      return  ele.email == email
    })
    if(index != -1){
      res.write("email already exist");
      return res.end()
    }
   const lastId = users[users.length-1].id
   const newUser = {
    name,
    email,
    id:lastId +1 
   }

users.push(newUser)
const nUs =JSON.stringify(users)
console.log(users);

res.write(nUs)
res.end()
  })
}
const deleteUser=(req,res,id)=>{

  
  
    const index =users.findIndex((ele)=>(ele.id==id))
    if(index == -1){
      res.write("user not found")
      return res.end()
    }
  users.splice(index,1)
          res.write("deleted successfully")
        res.end()
}
const updateUser=(req,res,id)=>{
   let data = ''  
  req.on('data',(chunk)=>{
    data += chunk
  }) 
  req.on('end',()=>{
    data=JSON.parse(data)
    const {name,email} = data
    const index =users.findIndex((ele)=>(ele.id==id))
    if(index == -1){
      res.write("user not found")
      return res.end()
    }
    if(email){
const emailIsExsit= users.findIndex((ele)=>(ele.email==email && ele.id !=id))
      if(emailIsExsit != -1 ){
        res.write("email already exist")
        res.end
      }
users[index].email=email

    }
   
      users[index].name=name || users[index].name
   
    res.write("update succssefuly")
    res.end()
  })
}

server.listen(3000, () => {
  console.log("server running");
});





