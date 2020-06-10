/*
__________________________________________________________
/  /  /  /  /  ここは絶対に消さないでね  /  /  /  /  /   /
￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
(C)いかそば
二次配布はご自由に(作者名を表記しないとだめ 例 (c)いかそば - MODERROR module )
自分が作ったモジュールだと偽って二次配布するのはやめて
ソースコードは絶対includeする形で使ってください(このコードを自分のソフトのコードにコピペしないでね)
__________________________________________________________
/  /  /  /  /  　　　　　　　　　　　　  /  /  /  /  /   /
￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
*/
#module _MODERROR_
#deffunc _ed int enu,str eme,str mdn,str mov,str aut,str ur
dialog "ERROR "+enu+"\n"+eme+"\nモジュールの名前:"+mdn+"\nモジュールのバージョン:"+mov+"\n(C)"+aut+"\n"+ur,1,""+mdn+""
return
#deffunc _error int enum //p1エラー番号
//モジュールの初期設定
author="いかそば" //作者名
url="ikasoba.github.io" //HPのURL
modname="MODERROR" //モジュールの名前
modver="1.0" //モジュールのバージョン
if (enum=1){
emes="テンプレートメッセージ" //エラーメッセージ
_ed enum,emes,modname,modver,author,url
}
if (enum=2){
emes="if文を追加することで他のエラー番号を設定できます" //エラーメッセージ
_ed enum,emes,modname,modver,author,url
}
end
return
#global
