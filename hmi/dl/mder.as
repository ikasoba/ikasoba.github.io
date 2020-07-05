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