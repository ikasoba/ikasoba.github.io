
let state

function genLine(){
  const me = document.currentScript
  const main=document.querySelector("#main")
  let span
  for (let i=0;i<30;i++){
    span=document.createElement("div")
    span.classList.add("line")
    span.id="line_"+(30-i);
    me.parentNode.insertBefore(span,me.nextSibling)
  }
}

window.addEventListener("load",(event)=>{
  
  const text=document.querySelector("#con")
  state={
    selectEnd:text.selectionEnd,
    selectStart:text.selectionStart,
    line:1
  }
  text.addEventListener('keydown',
  event => {
    // ime対策
    if (event.isComposing || event.keyCode === 229)return;
    const textY=+text.style.top.substr(0,text.style.top.length-2) || text.offsetTop
    const textX=+text.style.left.substr(0,text.style.left.length-2) || text.offsetLeft

    function onLineMove(dir=1){
      if ((dir<0) && (state.line<=1))return
      if ((dir>0) && (state.line>=30))return
      const lines=document.querySelectorAll(".line")
      text.style.top=`${textY+16*dir}px`
      lines[state.line-1].classList.remove("invisible")
      lines[state.line-1].innerText=text.value
      state.line+=1*dir
      text.value=lines[state.line-1].innerText
      lines[state.line-1].classList.add("invisible")
      event.preventDefault();
    }

    console.log(event.key,state.line)
    if (event.key==="ArrowDown"){
      onLineMove(1)
    }else if (event.key==="ArrowUp"){
      onLineMove(-1)
    }
  });
  setInterval(()=>{
    const text=document.querySelector("#con")
    const cur=document.querySelector("#cursor")
    const buf=document.querySelector("#txt")
    const direction="selection"+ (text.selectionDirection === "forward" ? "End" : "Start")
    buf.innerText=text.value.substr(text[direction],1)
    const oneW=buf.offsetWidth
    buf.textContent=text.value.substr(0,text[direction])
    cur.style.top=`${text.offsetTop}px`
    cur.style.left=`${text.offsetLeft+buf.offsetWidth}px`
    cur.style.width=`${oneW || 8}px`
  },16)
})

genLine()