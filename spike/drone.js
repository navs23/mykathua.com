
"use strict";
  class Drone{
    
    constructor (id,name){
        
        this._id =id;
        this.name=name;
        
    }
    
     fly(){
        
        console.log("%s is flying...",this.name);
        
    }
    
    
    static getCompany(){
        
        console.log ('%s',Drone.maxHeight);
        
    }
    print(){
        
        
        
    }
    
    get id(){
        
        return this._id;
    }
    set id(value){
        this._id = value;
        
    }
static maxHeight (){ return 200};    
};




