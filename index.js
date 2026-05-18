import {createReadStream,createWriteStream} from "fs";
import { createGzip } from "zlib";
import http from "http";
import fs from 'fs/promises'
 
const readData=async()=>{
    const data = await fs.readFile("./users.json",'utf-8')
return JSON.parse(data)
}

const writeData=async(data)=>{
    await fs.writeFile("./users.json",JSON.stringify(data))
}
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

const server = http.createServer(async(req, res) => { 
  const url = req.url;
  const method = req.method;
  const splitedUrl = url.split("/");
  const id = splitedUrl[2];

console.log({ url, method });
if (splitedUrl[1] == "user") {
  

  if ( method == "GET" && id ) {
        const users = await readData()
   const user = users.find((ele)=>(ele.id == id))
    if(!user){
      res.write("user not found")
     return res.end()
    }
    const us = JSON.stringify(user)
    res.write(us)
      res.end()

  }else if(method == "GET" ){
    const users = await readData()

    res.write(JSON.stringify(users));
    res.end();
  }else if( method == "DELETE"){
   deleteUser(req,res,id)


}else if( method == "POST"){
  
  newUser(req,res)

}else if( method == "PATCH"){

  updateUser(req,res,id)
} else {
    res.write("invalid url");
    res.end();

  }

}})


const newUser=(req,res)=>{
  let data = ''  
  req.on('data',(chunk)=>{
    data += chunk
  })
  req.on('end',async()=>{
    data= JSON.parse(data)
    const {email,name}= data
    const users = await readData()
   const index = users.findIndex((ele)=>{
      return  ele.email == email
    })
    if(index != -1){
      res.write("email already exist");
      return res.end()
    }
   const lastId = users.length ? users[users.length - 1].id : 0;
   const newUser = {
    name,
    email,
    id:lastId +1 
   }

users.push(newUser)
await writeData(users)

res.write("user inserted")
res.end()
  })
}
const deleteUser=async(req,res,id)=>{
      const users = await readData()
    const index =users.findIndex((ele)=>(ele.id==id))
    if(index == -1){
      res.write("user not found")
      return res.end()
    }
  users.splice(index,1)
  await writeData(users)

          res.write("deleted successfully")
        res.end()
}
const updateUser=(req,res,id)=>{
   let data = ''  
  req.on('data',(chunk)=>{
    data += chunk
  }) 
  req.on('end',async()=>{
    data=JSON.parse(data)
    const {name,email} = data
       const users = await readData()
    const index =users.findIndex((ele)=>(ele.id==id))
    if(index == -1){
      res.write("user not found")
      return res.end()
    }
    if(email){
const emailIsExsit= users.findIndex((ele)=>(ele.email==email && ele.id !=id))
      if(emailIsExsit != -1 ){
        res.write("email already exist")
        return res.end()
      }
users[index].email=email

    }
   
      users[index].name=name || users[index].name
   await writeData(users)

    res.write("update succssefuly")
    res.end()
  })
}

server.listen(3000, () => {
  console.log("server running");
});

//p3

//1  
//The Event Loop is a mechanism in Node.js that handles asynchronous operations 
//by moving completed callbacks to the Call Stack when it becomes empty.

//2
//Libuv is a library that powers Node.js asynchronous features.
//It manages the Event Loop, Thread Pool, and async I/O operations.

//3
//Node.js sends async tasks to Libuv or the OS, continues running other code, then executes the callback when the task finishes.

//4
//Call Stack: Executes functions /Event Queue: Stores completed async callbacks/Event Loop: Moves callbacks to the Call Stack

//5
//The Thread Pool handles heavy async tasks like file system and crypto operations. Default size is 4 threads (UV_THREADPOOL_SIZE=8)

//6
//Blocking: Stops execution until task finishes (readFileSync)
// Non-Blocking: Runs task in background and continues execution (readFile)

