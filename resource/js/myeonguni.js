// 페이지가 로드되었을 경우 실행
$(function() {

	// 터치 지원 여부
	var touchAble = isTouchAble();

	// Canvas 객체를 추출
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');

	// Canvas에 필요한 변수를 선언
	var width = 3;			//라인 굵기
	var color = '#000000';	//색상
	var isDown = false;
	var newPoint, oldPoint;
	var cursorXY;

	// 디바이스에 따른 이벤트를 선택합니다.
	var START_EV = (touchAble) ? 'touchstart' : 'mousedown';
	var MOVE_EV = (touchAble) ? 'touchmove' : 'mousemove';
	var END_EV = (touchAble) ? 'touchend' : 'mouseup';
	var BSTART_EV = (touchAble) ? 'touchcancel' : 'mouseover';
	var color = $("div input:eq(0)").css("background-color");

	// 모바일에서 터치에 따른 웹 스크롤 불가능하게 하기
	$("body").bind('touchmove', function(e) {
		e.preventDefault()
	});

	// 그림판 크기를 셋팅합니다(페이지 로드 시 1회)
	window.addEventListener('resize', reloadPage, false);
	resizeCanvas();

	// 그림 도구 설정
	$("#pencil").click(function(event) {
		color = "#000000";
	});
	$("#eraser").click(function(event) {
		color = "#ffffff";
	});
	$("#size").click(function(event) {
		var size = prompt("그림도구 사이즈를 입력해주세요(1~10)", "3");
		width = size;
	});
	$("#refresh").click(function(event) {
		//context.clearRect(0,0, $("#canvas").width(), $("#canvas").height() );
		ws.send("refresh, ");
	});
	$(".color").click(function(event) {
		color = $(this).css("background-color");
	});
	$("#download").click(function() {
		downloadCanvas(this, 'canvas', 'myeonguni.png');
	});

	// 웹 소켓 연결 자원 52.78.71.181 aws ec2 linux nodeS
	url = "ws://52.78.71.181:9000";
	ws = new WebSocket(url);

	// 웹 소켓 연결
	ws.onopen = function() {
	}

	// 웹 소켓으로부터 받은 메시지
	ws.onmessage = function(e) {
		var temp = e.data;
		var temp2;
		temp2 = temp.split(',');
		// 드래그 일 경우
		if (temp2[0] == "move")
		{
			context.lineWidth = temp2[1];
			context.strokeStyle = temp2[2];
			context.beginPath();
			context.moveTo(temp2[3], temp2[4]);
			context.lineTo(temp2[5], temp2[6]);
			context.stroke();
		}
		// 초기화(refresh) 일 경우
		else if (temp2[0] == "refresh")
		{
			context.clearRect(0, 0, $("#canvas").width(), $("#canvas")
					.height());
		}
		else { }
	}

	// 웹 소켓 연결종료
	ws.onclose = function(e) {
	}

	// 이벤트 객체를 연결합니다.
	canvas.addEventListener(START_EV, function(event) {
		isDown = true;
		oldPoint = new Point(event, this);
	});
	canvas.addEventListener(END_EV, function(event) {
		isDown = false;
	});
	canvas.addEventListener(BSTART_EV, function(event) {
		isDown = false;
	});
	canvas.addEventListener(MOVE_EV, function(event) {
		cursorXY = "position:absolute; display:block; top:"
				+ (event.pageY - 50) + "px; left:" + event.pageX + "px;";
		$('.cursor').attr('style', cursorXY);

		context.strokeStyle = color;
		context.lineWidth = width;
		if (isDown) {
			newPoint = new Point(event, this);
			ws.send("move," + context.lineWidth + "," + context.strokeStyle
					+ "," + oldPoint.x + "," + oldPoint.y + ","
					+ newPoint.x + "," + newPoint.y);
			oldPoint = newPoint;
		}
	});
});

// Point 생성자 함수를 생성
function Point(event, target) {
	this.x = event.pageX - $(target).position().left;
	this.y = event.pageY - $(target).position().top;
}

// 그림판 크기를 브라우저 창 사이즈로 지정
function reloadPage() {
	location.href = "http://myeonguni.com";
}

// 그림판 크기를 브라우저 창 사이즈로 지정
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight - 5;
}

// 작업 이미지 로컬 다운로드(.PNG)
function downloadCanvas(link, canvasId, filename) {
	link.href = document.getElementById(canvasId).toDataURL();
	link.download = filename;
}

// 접속 디바이스를 확인(데스크탑:마우스, 모바일:터치)
function isTouchAble() {
	if (navigator.userAgent.indexOf('Mobile') != -1) {
		return true;
	} else {
		return false;
	}
}

// 접속 브라우저를 확인(html5 지원하지 않을 경우 경고문을 출력하기 위하여)
function isBrowserCheck() {
	var agt = navigator.userAgent.toLowerCase();
	if (agt.indexOf("chrome") != -1)
		return 'Chrome';
	if (agt.indexOf("opera") != -1)
		return 'Opera';
	if (agt.indexOf("staroffice") != -1)
		return 'Star Office';
	if (agt.indexOf("webtv") != -1)
		return 'WebTV';
	if (agt.indexOf("beonex") != -1)
		return 'Beonex';
	if (agt.indexOf("chimera") != -1)
		return 'Chimera';
	if (agt.indexOf("netpositive") != -1)
		return 'NetPositive';
	if (agt.indexOf("phoenix") != -1)
		return 'Phoenix';
	if (agt.indexOf("firefox") != -1)
		return 'Firefox';
	if (agt.indexOf("safari") != -1)
		return 'Safari';
	if (agt.indexOf("skipstone") != -1)
		return 'SkipStone';
	if (agt.indexOf("netscape") != -1)
		return 'Netscape';
	if (agt.indexOf("mozilla/5.0") != -1)
		return 'Mozilla';
	if (agt.indexOf("msie") != -1) { // 익스플로러 일 경우
		var rv = -1;
		if (navigator.appName == 'Microsoft Internet Explorer') {
			var ua = navigator.userAgent;
			var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null)
				rv = parseFloat(RegExp.$1);
		}
		return 'Internet Explorer ' + rv;
	}
}