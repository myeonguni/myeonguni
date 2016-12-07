// 접속 클라이언트 관리 배열
var clients = [];

// DataBase를 대체하여 사용할 배열 선언
var array =[]; 

// HTTP 서버 생성
var http = require('http');
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

// HTTP 서버 실행
server.listen(port, function() {
    console.log((new Date()) + ' Server is listening on port '+ port);
});

// HTTP 서버를 웹소켓 서버로 업그레이드
var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});
 

function originIsAllowed(origin) {
  return true;
}

// 클라이언트로부터 요청이 오면
wsServer.on('request', function(request) {
	// 
    if (!originIsAllowed(request.origin)) {
      request.reject();
      return;
    }
	
	// 클라이언트로부터 웹소켓 초기 연결 요청이 왔을 경우
    var connection = request.accept(null, request.origin);
 
	// 접속한 클라이언트를 관리 배열에 추가
    clients.push(connection);
 
	// 그림판에 이벤트가 발생했다는 메시지일 경우
    connection.on('message', function(message) {
		// 드래그일 경우
		if(msg.indexOf("move") != -1)
		{
			// 누적 그리기 횟수가 6만건 이상일 경우 초기화 
			if(array.length < 60000)
			{
				array.push(msg);
			}
			else
			{
				array.shift();
				array.push(msg);
			}
		}
		// 초기화일 경우
		else if(msg.indexOf("refresh") != -1){
			array = [];
		}
		// 그 외
		else
		{
		}
		
		// 접속되어있는 모든 클라이언트에게 변경된 그림판 드로우 현황 전송
		clients.forEach(function(cli)
		{
			cli.sendUTF(msg);
        });
    });

	// 클라이언트 접속이 해제되었을 경우
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

