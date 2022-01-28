localforage.config({
  driver: localforage.INDEXEDDB,
  name: 'bbs'
});

function e(name){
  return document.createElement(name)
}

const bbs = {
  async put(){
    if (!await localforage.getItem("threads")){
      await localforage.setItem("threads",[
        {
          id:0,
          thread:"てすと",
          res:[
            {
              name:`いかそば@管理者 - 2021/11/12 00:00:00`,
              content:"見てる人いるかな...？。実はこれね、掲示板じゃないんだ"
            }
          ]
        }
      ])
    }
    const threads=await localforage.getItem("threads");
    const field=document.querySelector(".content");
    while( field.firstChild ){
      field.removeChild( field.firstChild );
    }
    threads.forEach(x=>{
      const title=document.createElement("h1")
      title.innerText=x.thread
      const res=[]
      x.res.forEach(y=>{
        const div=document.createElement("div")
        div.classList.add("bbs_res")
        div.append(y.name,document.createElement("br"),y.content)
        res.push(div)
      })
      const formDiv=document.createElement("div")
      const form={
        name:document.createElement("input"),
        content:document.createElement("textarea"),
        button:document.createElement("button")
      }
      form.name.type="text"
      form.button.addEventListener("click",async()=>{
        if (form.name.value==="")form.name.value="名無し太郎";
        if (form.content.value==="")return;
        await this.send(x.id,`${form.name.value} - ${new Date().toLocaleString()}`,form.content.value)
        this.put()
      });
      form.button.innerText="送信"
      formDiv.append("名前:",form.name,e`br`,"内容:",form.content,e`br`,form.button)
      res.push(formDiv)
      field.append(title,...res,e`hr`)
    })
    const formDiv=document.createElement("div")
    const form={
      title:document.createElement("input"),
      name:document.createElement("input"),
      content:document.createElement("textarea"),
      button:document.createElement("button")
    }
    form.title.type="text"
    form.name.type="text"
    form.button.addEventListener("click",async()=>{
      if (form.name.value==="")form.name.value="名無し太郎";
      if (form.content.value==="")return;
      if (form.title.value==="")return;
      await this.thread(form.title.value,`${form.name.value} - ${new Date().toLocaleString()}`,form.content.value)
      this.put()
    });
    form.button.innerText="送信"
    formDiv.append("タイトル:",form.title,e`br`,"名前:",form.name,e`br`,"内容:",form.content,e`br`,form.button)
    field.append(formDiv)
  },
  async send(threadId,name,content){
    const threads=await localforage.getItem("threads");
    threads.find(x=>x.id===threadId).res.push({
      name,
      content
    });
    localforage.setItem("threads",threads);
  },
  async thread(threadName,name,content){
    const threads=await localforage.getItem("threads");
    threads.push({
      id:new Date().getTime(),
      thread:threadName,
      res:[
        {
          name,
          content
        }
      ]
    });
    localforage.setItem("threads",threads);
  }
}