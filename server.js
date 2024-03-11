const jsonServer=require('json-server');
const server=jsonServer.create();
const router=jsonServer.router('data.json');
const middleware=jsonServer.defaults();
server.use(jsonServer.bodyParser);
server.use((req,res,next)=>{
    if(req.method=="PATCH" || req.method=='POST'|| req.method=='PUT'||req.method=='DELETE'){
        req.method='GET'
    }
    next()
})
server.use(middleware);
server.use(router);
server.listen(3000,()=>console.log("Listening on 3000"));