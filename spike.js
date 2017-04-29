var underscore = _= require('underscore/underscore.js');
var arr = [1,2,3,4,5];
_.each(arr,function(i,e){
    console.log(i);
    
});


var person ={
    
    name:'naveen',
    url:'http://www.mykathua.com'
    
};


var getPersonProps= function(){
    
    return this.url;
}

person.getPersonProps=_.bind(getPersonProps,person);

var url = person.getPersonProps();
console.log(url);




var getFibonacciValue=function(n){
    
    
    return n<2?n:getFibonacciValue(n-1) + getFibonacciValue(n-2)
    
}

var shout =(param)=>console.log('hi %s',param);
console.log('shouting with delay');
_.delay(shout,1000,'naveen')

var val = getFibonacciValue(4);
console.log(val);
var log=(msg)=>console.log(msg);
var throttleLog = _.throttle(log,100);

//log(new Date().toDateString());

var testlog= function(){
    var i =1000;
while(i--){
    
    throttleLog(new Date().toDateString());
    
};
};

testlog();



var products =[
    
    {id:100,active:false,price:300}
    ,    {id:101,active:false,price:300}
    ,    {id:104,active:false,price:500}
    ,    {id:103,active:false,price:1500}
    ,    {id:105,active:false,price:300}  , 
    {id:108,active:false,price:600}
    ];
    
    
var mostExpensive = _.chain(products)
                    .sortBy('price')
                    .last()
                    .value();
                    
log(mostExpensive);                    