//スマホの振り分け
var ua = navigator.userAgent;
if(ua.indexOf('iPhone') > 0){
ua = 'iphone';
}else if(ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
ua = 'sp';
}else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
ua = 'tab';
}else{
ua = 'other';
}
//イベントの振り分け
var EVENT = {};
if(ua!='other'){//スマホだったら
  EVENT.TOUCH_START = 'touchstart';
  EVENT.TOUCH_MOVE = 'touchmove';
  EVENT.TOUCH_END = 'touchend';
} else {
  EVENT.TOUCH_START = 'mousedown';
  EVENT.TOUCH_MOVE = 'mousemove';
  EVENT.TOUCH_END = 'mouseup';
}

var startX=0;
var startY=0;
var mousedown=false;
var defSize = 10;

window.addEventListener('load', function() {

var canvas = document.getElementById('canvas');
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

//背景色
var ctx = canvas.getContext('2d');
ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

//canvasの位置座標を取得
var clientRect = canvas.getBoundingClientRect();
var canvas_x = clientRect.left;
var canvas_y = clientRect.top;


var img_datas_cnt = 0;
var img_datas_arr = new Array();

//ウィンドウリサイズ時
window.addEventListener('resize', function (event) {

	//canvasの位置座標を取得(描いたものを伸縮させないため、キャンバスの大きさを変える)
	clientRect = canvas.getBoundingClientRect();
	canvas_x = clientRect.left;
	canvas_y = clientRect.top;
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;

  	//一度消して、保存していた配列データを全て描く(ウィンドウを大きくした場合に戻す)
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	for( var i=0; i<img_datas_arr.length; i++ ) ctx.putImageData(img_datas_arr[i],0,0);

});


// マウスダウンイベントを設定
window.addEventListener( EVENT.TOUCH_START, function(e) {
	//スマホだったら
	if(ua!='other')e = e.touches[0];
	startX=e.pageX-canvas_x;
	startY=e.pageY-canvas_y;
	mousedown=true;

} ) ;
//マウスアップイベントを設定
window.addEventListener(EVENT.TOUCH_END,function(e){
	mousedown=false;
	// 配列に保存しておく
		img_datas_arr[img_datas_cnt] = ctx.getImageData(0,0,canvas.width,canvas.height);
		img_datas_cnt++;

} );
// マウスムーブイベントを設定
window.addEventListener(EVENT.TOUCH_MOVE,function(e){
	//スマホだったら
	if(ua!='other')e = e.touches[0];
	if(mousedown)draw(e.pageX-canvas_x,e.pageY-canvas_y);
} );

// キャンバスに描く
function draw(x,y){
	var target= document.getElementById('canvas');
    var context=target.getContext('2d');
	context.beginPath();
	context.moveTo(startX,startY);
	context.lineTo(x,y);
	context.lineCap = "round";
	context.lineWidth = defSize;
	context.closePath();
	context.stroke();
	startX=x;
	startY=y;
}

//消すボタン
document.getElementById('delbt').addEventListener( EVENT.TOUCH_START, function(e) {
	//要素のイベントをリセットしておく
	e.preventDefault();
	Fnk_DelBt();
	return false;
});
//キャンバスを消す
function Fnk_DelBt(){
	ctx.fillStyle = "#fff";
	//ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	//配列を空にする
	img_datas_arr = new Array();
	img_datas_cnt = 0;
}

// 保存ボタン
document.getElementById('savebt').addEventListener( EVENT.TOUCH_START, function(e) {
	// 要素のイベントをリセットしておく
	e.preventDefault();
	Fnk_SaveBt();
	return false;
});

// canvas上のイメージを保存
function Fnk_SaveBt(){
    // base64エンコード
    var base64 = canvas.toDataURL('image/jpeg');
    var blob = Base64toBlob(base64);

	// blobデータをa要素を使ってダウンロード
    saveBlob(blob, 'a.jpg');

}

// Base64データをBlobデータに変換
function Base64toBlob(base64){
    // カンマで分割し、base64データの文字列をデコード
    var tmp = base64.split(',');
    var data = atob(tmp[1]);
    // tmp[0]の文字列(data:image/png;base64)からコンテンツタイプ(image/png)部分を取得
	var mime = tmp[0].split(':')[1].split(';')[0];
    //  1文字ごとにUTF-16コードを表す 0から65535 の整数を取得
	var buf = new Uint8Array(data.length);
	for (var i = 0; i < data.length; i++) buf[i] = data.charCodeAt(i);
    // blobデータを作成
	var blob = new Blob([buf], { type: mime });
    return blob;
}

// 画像のダウンロード
function saveBlob(blob, fileName){
    var url = (window.URL || window.webkitURL);
    // ダウンロード用のURL作成
    var dataUrl = url.createObjectURL(blob);
    // イベント作成
    var event = document.createEvent("MouseEvents");
    event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    // a要素を作成
    var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    a.href = dataUrl;
    a.download = fileName;
    a.dispatchEvent(event);
}

});