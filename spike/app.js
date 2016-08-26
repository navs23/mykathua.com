import {Drone} from './drone.js'

var drone1 = new Drone("A123","Flyer");
var drone2 = new Drone("B456","Twirl");

drone1.id ="C123";

drone1.fly();
drone2.fly();

Drone.getCompany();
console.log("Drone:%s %s",drone1['id'],drone1['name']);
console.log("Drone:%s %s %s",drone2.id,drone2.name,Drone.maxHeight);