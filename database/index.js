(function(db){
const mongoose = require('mongoose');
const connstr = "mongodb+srv://kthdb:Kathua01@cluster0-wyz7p.mongodb.net/mykathua?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
//const connstr = process.env.CONNSTR_MONGODB;
// save
db.get=function(Model,filter){

   return new Promise(function(resolve,reject){
    //let connection = mongoose.connection; 

    mongoose.connect(connstr, {useNewUrlParser: true,useUnifiedTopology: true });

    Model.find(filter||{},(err,data)=>{
        mongoose.connection.close();
        if (err) return reject(err);
        return resolve(data)
        //console.log(JSON.stringify(data));
       

    });

   });
       
    }

db.save=function(model,data){

    return new Promise(function(resolve,reject){
 
    mongoose.connect(connstr, {useNewUrlParser: true,useUnifiedTopology: true});

   // let Model = connection.model(collection,schema);
  //  let data = new Model(document);
    model.create(data,(err)=>{
    mongoose.connection.close();
    if (err) return console.log(err);
   
    if (err) return reject(err);
    return resolve(data);
    // if connection.

    });
         
        });
            
}
// save many
db.saveMany=function(Model,data){

    return new Promise(function(resolve,reject){
    //let connection = mongoose.connection; 

    mongoose.connect(connstr, {useNewUrlParser: true,useUnifiedTopology: true});

    Model.insertMany(data,(err)=>{
    mongoose.connection.close();
    if (err) return console.log(err);
    //console.log('saved');

    if (err) return reject(err);
    return resolve('saved');
    // if connection.

    });
         
        });
            
         }
db.deleteAndSave=function(Model,data){

    return new Promise(function(resolve,reject){
   
    mongoose.connect(connstr, {useNewUrlParser: true,useUnifiedTopology: true});
    //
    Model.deleteMany({},(err,res)=>console.log(err));
    // insert
    Model.insertMany(data,(err)=>{
    mongoose.connection.close();
    if (err) return console.log(err);
  
    if (err) return reject(err);
    return resolve('saved');
    // if connection.

    });

    });

}
db.delete=function(Model,filter){

    return new Promise(function(resolve,reject){
   
    mongoose.connect(connstr, {useNewUrlParser: true,useUnifiedTopology: true});
    //
   // Model.delete({});
    // insert
    Model.deleteMany(filter,(err)=>{
    mongoose.connection.close();
    if (err) return console.log(err);
    //console.log('saved');

    if (err) return reject(err);
    return resolve('deleted');
    // if connection.

    });

    });

}
}(module.exports))

    
