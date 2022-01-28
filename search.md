---
layout: custom
title: 結果
welcome_title: 検索
HTMLhead: <link rel='stylesheet' type='text/css' media='screen' href='/css/search.css'>
---
<div id="result">
</div>
<script>(async()=>{
  let res={}
  window.location.search.substr(1).split("&").forEach(x=>{
    const a=x.split("=")
    res[a[0]]=decodeURIComponent(a[1]).replace("+"," ")
  })
  const result = document.querySelector("#result")
  let posts = await (await fetch("/api/posts.json")).json()
  posts=posts.filter(x=>( (x.id.match(res.q)) ||
    (x.title.match(res.q)) ||
    (x.categories.find(x=>x.match(res.q)))
  ))
  posts.forEach(x=>{
    const link = document.createElement("a")
    link.href=x.url
    link.innerText=x.title
    result.append(link)
  })
})()</script>