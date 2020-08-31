function clock() { 
var date = new Date();
var h = date.getHours();
var m  = date.getMinutes();
var aaa = "" + h + ":" + m + "";
document.getElementById("clock").innerHTML = aaa;
}
setInterval('clock()',1000);