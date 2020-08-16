var sessionId = null;
var publicKey = null;
var randomNum = null;
var rsa_mod = null;
var rsa_exp = null;

window.onload = function() {
	generatePublicKey();
};

function generatePublicKey() {
	var url = 'retrievePublicKey';
//	var url = 'view/mock_publickey.json';
	$.get(url, function(sessionDetails) {
		parseSessionDetail(JSON.parse(sessionDetails));
	})
};

function getRPIN(pin, rsa_exp, rsa_mod, randomNumber, sessionId) {
	var loginPIN = encryptLoginPin(pin, rsa_exp, rsa_mod, randomNumber.slice());
	return formatEncryptionResult(sessionId, loginPIN, '');
};

function parseSessionDetail(sessionDetails) {
	sessionId = sessionDetails.e2EESessionId;
	publicKey = sessionDetails.e2EEPublicKey;
	randomNum = sessionDetails.e2EERandomNum;
	rsa_mod = publicKey.substring(0, publicKey.indexOf(','));
	rsa_exp = publicKey.substring(rsa_mod.length + 1, publicKey.indexOf(',', rsa_mod.length + 1));
	rsa_exp = rsa_exp.substring(rsa_exp.length - 4);
	
	document.getElementById("sessionId").value = sessionId;
};

function login() {
	document.getElementById("j_username").value = document.getElementById("username").value;
	document.getElementById("j_password").value = getRPIN(document.getElementById("password").value, rsa_exp, rsa_mod, randomNum, sessionId);
	document.getElementById("loginForm").submit();
};