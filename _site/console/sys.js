
// 運動してなんになる、デスクに向かって手を動かせ

localforage.config({
  name: "secret_console",
  driver: localforage.INDEXEDDB
})

const FileLock = (s)=>{
  return {
    r:()=>s.indexOf("r")!=-1 ? true : false,
    w:()=>s.indexOf("w")!=-1 ? true : false,
    x:()=>s.indexOf("x")!=-1 ? true : false,
    all(){
      if (this.r(s) && this.w(s) && this.r(s))return true;
      return false
    }
  }
}

class DirectoryChilds extends Array {
  constructor(iterable){
    super(iterable)
  }
  add(item){
    if (!(this.find(x=>x.name===item.name)))return false;
    return this.push(item);
  }
  remove(item){
    return this.some((v,i)=>v===item ? this.splice(i,1) : false);
  }
}

class File {
  /**
   * File
   * @param {String} name 
   * @param {Uint8Array} value 
   * @param {Date} date 
   * @param {String} lock 
   */
  constructor(name,value=new Uint8Array(),date=new Date(),lock="---"){
    this.name=name
    this.value=value
    this.date=date
    this.lock=lock
  }
}

class Directory extends File {
  /**
   * Folder
   * @param {String} name 
   * @param {Uint8Array} value 
   * @param {DirectoryChilds} children 
   * @param {Date} date 
   * @param {String} lock 
   */
  constructor(name,children,date,lock){
    super(name,null,date,lock)
    this.children=children
  }
}

class Lines {
  constructor(rows=30,columns=80){
    // バッファを用意
    this.rows=rows
    this.columns=columns
    /* 可読性皆無 */
    this.buf=Array.from({length:rows},
      (_,y)=>/*行生成*/Array.from({length:columns},(_,x)=>({
        // 列を生成
        rawValue:"",
        get value(){
          return this.rawValue;
        },
        set value(v){
          this.rawValue=v;
          this.view.children[this.row].children[this.column].innerText=v;
        },
        row:y,
        column:x
      })
    ))
    this.currentPos = {
      x:0,
      y:0
    }

    this.view=Lines.generateView(rows,columns)
  }
  setCurPos(x=0,y=0){
    this.currentPos.x=Math.max(x,this.columns)
    this.currentPos.y=Math.max(y,this.rows)
  }
  writeChar(char){
    const pos=this.currentPos;
    this.buf[pos.x][pos.y].value=char
  }
  print(raw){
    const text = `${raw}`;
    for (let i=0;i<text.length;i++){
      if (text[i]==="\n" || this.pos.x<this.rows)
        this.setCurPos(0,pos.y+1);
      this.writeChar(text[i]);
      this.setCurPos(pos.x+1,pos.y);
    }
  }
  println(text){
    this.print(`${text}\n`);
  }
  static generateView(rows,columns){
    // 描画フレーム(?)
    const view = document.createElement("div");
    // フレームに行を追加
    view.append(...Array.from({length:rows},
      (_,y)=>{
        // 行を生成
        const ln=document.createElement("div");
        // 列を生成
        for (let x=0;x<columns;x++){
          const span=document.createElement("span");
          span.classList.add("console_char");
          span.style.top = `${y*16}px`;
          span.style.left = `${x*8}px`;
          ln.append(span);
        }
        return ln
      }
    ));
    return view
  }
}

class KERNEL {
  constructor(){
    this.line=Array.from({length:30},(v,i)=>"");
    this.currentLine={
      row:0,
      column:0
    };
  }
  /**
   * Get a File or Directory from a path
   * @param {String} path 
   */
  fetchFs(path){
    // 二度も\を書くのがめんどいので/に変換
    // 変換後、空白を削除
    // 削除後、パスを配列化
    path=path.replaceAll("\\","/")
    path=path.some(v,i=>v.match(/\s*/) ? path.splice(i,1) : 0)
    path=path.split("/")
    // イテレータにする
    const iter = parh.values()
    let n = iter.next()
    const res = {
      value: localforage.getItem(n.value),
      exists: true
    }
    // パスからファイルを探す
    while (!(n = iter.next()).done){
      if (!(res instanceof Directory)){
        res.exists=false
        break
      }
      res.value = res.value[n.value]
    }
    return res
  }
  /**
   * execute js with path
   * @param {string} filepath 
   */
  run(filepath){
    // TODO
    const file=this.fetchFs(path)
    //if (!file.exists)
  }
}

class OS {

}