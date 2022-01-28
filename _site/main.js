function time(){
  const element = document.getElementById("time");
  element.innerText=new Date().toLocaleString();
}

/*
  いえ～い
  みてる～？
*/

/*メニュー*/

async function MenuPutter(){
  const res = await fetch("./menu.html");
  const dom = new DOMParser().parseFromString(await res.text(),"text/html");
  document.querySelector("#side_menu").append(...dom.body.children);
}

/*ここからマウス*/

const stars=[]
let cnt=0

function mkStar(ele){
  return {
    firstY:Number(ele.style.top.substr(0,ele.style.top.length-2)),
    element:ele,
    loop(){
      let y=Number(this.element.style.top.substr(0,this.element.style.top.length-2))
      this.element.style.top=""+(y+2)+"px"
      if ((y-this.firstY)>=100){
        setTimeout(()=>{
          this.element.remove();
          stars.some((v,i)=>{
            if (v.element===this.element)stars.splice(i,1)
          });
        },1000*0.2);
        this.element.style.animation="0.2s alternate-reverse 0s infinite running fadein"
        
      }
    }
  }
}

function kirakira(event){
  cnt++
  if (cnt%16!==0)return
  const element=document.createElement("span");
  element.classList.add("mouse_star");
  element.innerText="★"
  element.style.top=`${event.clientY}px`
  element.style.left=`${event.clientX}px`
  element.style.zIndex="90000"
  document.body.append(element)
  stars.push(mkStar(element))
}

setInterval(()=>{
  stars.forEach(async(x)=>{
    x.loop()
  });
},10)

window.addEventListener("mousemove",kirakira)
window.addEventListener("load",()=>{
  document.querySelector(".content > h1").addEventListener("click",(event)=>{
    const content=document.querySelector(".content")
    const fnc=Array(...content.classList).find(x=>x==="fullscr") ? "remove" : "add"
    content.classList[fnc]("fullscr")
  });
})