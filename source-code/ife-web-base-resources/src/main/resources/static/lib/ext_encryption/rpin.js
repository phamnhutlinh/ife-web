
//Modified date: 20100407
var SHA_DIGEST_LENGTH = 20;
var ENCODING_PARAMETER_SIZE_IN_BYTES = 16;

function encryptLoginPin(pin, key_exp_str, key_mod_str, randomNumber){
	var rsaPubKey = new RSAKey();
	rsaPubKey.setPublic (key_mod_str, key_exp_str);

	var label = new Array(ENCODING_PARAMETER_SIZE_IN_BYTES);
	var rnd = new SecureRandom();
	rnd.nextBytes (label);

	var baLabel = new BigInteger (label);

	var sLabel = baLabel.toString(16).toUpperCase();

	var pinMessage = formatPINMessage (pin, randomNumber);

	var oaepEncMessage = RSA_padding_add_PKCS1_OAEP(SHA_DIGEST_LENGTH, key_mod_str.length / 2, label, pinMessage);

	var encryptedMessage = rsaPubKey.encrypt (new BigInteger (oaepEncMessage));

	sLabel = padOutput (sLabel, 32);
	encryptedMessage = padOutput(encryptedMessage, 256);

	return sLabel + ':' + encryptedMessage.toUpperCase();
}

function encryptResetPin(oldPin, newPin, key_exp_str, key_mod_str, randomNumber){

	var rsaPubKey = new RSAKey();
	rsaPubKey.setPublic (key_mod_str, key_exp_str);

	var label = new Array(ENCODING_PARAMETER_SIZE_IN_BYTES);
	var rnd = new SecureRandom();
	rnd.nextBytes (label);
	var baLabel = new BigInteger (label);

	var resetPinMessage = formatResetPINMessage (oldPin, newPin, randomNumber);

	var oaepEncMessage = RSA_padding_add_PKCS1_OAEP(SHA_DIGEST_LENGTH, key_mod_str.length / 2, label, resetPinMessage);

	var encryptedMessage = rsaPubKey.encrypt (new BigInteger (oaepEncMessage));

	var sLabel = baLabel.toString(16).toUpperCase();
	sLabel = padOutput (sLabel, 32);
	encryptedMessage = padOutput(encryptedMessage, 256);
	return sLabel + ':' + encryptedMessage.toUpperCase();

}

function formatPINMessage (pin, randomNumber){
	//Format the PIN
	var tPin = [];
	var tPinIndex = 0;

	//First byte 1
	tPin [0] = 1 & 0xFF;
	tPinIndex ++;

	//Convert String PIN to Binary Array PIN
	var pinArr = str2bin (pin);
	//Pin Block
	var pinBlock = createPINBlock(pinArr);

	//Random Number
	var rndNumber = hexDecode (randomNumber);

	//return tPin.concat (pinBlock, rndNumber, RBBlock);
	return tPin.concat (pinBlock, rndNumber);
}

function formatResetPINMessage (oldPin, newPin, randomNumber){
	//Format the PIN
	var tPin = [];
	var tPinIndex = 0;

	//First byte 1
	tPin [0] = 2 & 0xFF;
	tPinIndex ++;

	//Convert String PIN to Binary Array PIN
	var oldPinArr = str2bin (oldPin);
	var newPinArr = str2bin (newPin);

	//Pin Block
	var oldPinBlock = createPINBlock(oldPinArr);
	var newPinBlock = createPINBlock(newPinArr);

	//Random Number
	var rndNumber = hexDecode (randomNumber);

	return tPin.concat (oldPinBlock, newPinBlock, rndNumber);
}

function createPINBlock(pin){
	var pinBlock = [];
	var pinBlockIndex = 0;

	//First byte C1
	pinBlock [0] = 193 & 0xFF;
	pinBlockIndex ++;

	//Pin length
	pinBlock[1] = pin.length & 0xFF;
	pinBlockIndex ++;

	//The PIN
	for (var i = 0; i < pin.length; i ++, pinBlockIndex ++){
		pinBlock[pinBlockIndex] = pin [i];
	}

	// Pin filler
	while (pinBlockIndex % 8){
		pinBlock[pinBlockIndex] = 0xFF;
		pinBlockIndex ++;
	}

	return pinBlock;
}

function formatEncryptionResult(e2eeSID, rpin1, rpin2){
	var result = e2eeSID + ',' + rpin1;

	if (rpin2.length > 0)
		result = result + ',' + rpin2;

	// result = result + ',{';
	// result = result + '"sid":"' + e2eeSID + '",';
	// result = result + '"invalidPin1":false,';
	// result = result + '"retCode2":0,';
	// result = result + '"invalidPin2":false,';
	// result = result + '"rpin1":"' + rpin1 + '",';
	// result = result + '"retCode1":0,';
	// result = result + '"rpin2":"' + rpin2 + '"}';
	return result;
}

function hexDecode(inArr){
  var wrt = 0;
  var rd = 0;
//  var tmp = new Array(inArr.length/2);
  var tmp = new Array(1);
  var space = " ";
  var ch = 0;
  while (rd<inArr.length){
	// skip over spaces
	if ( inArr.charCodeAt(rd) == space.charCodeAt(0) )
	{
		++rd;
		continue;
	}
	// assume no space between pairs
	ch = (HexToNib(inArr.charCodeAt(rd)) << 4) +
			   HexToNib(inArr.charCodeAt(rd+1));
	if ( wrt >= tmp.length )
		tmp.push(ch);
	else
		tmp[wrt] = ch;
	++wrt;
	rd += 2;
  }
  return tmp;
}

// return the integer value of the hex character 'h'
function HexToNib(h)
{
	if ( h >= 65 && h <= 70 )
		return h-55;
	if ( h >= 97 && h <= 102 )
		return h-87;
	else
		return h-48;
}

function str2bin(stringValue){
	var binValue = [];

	for (var i = 0; i < stringValue.length; i ++){
		binValue[i] = stringValue.charCodeAt(i) & 0xFF;
	}
	return binValue;
}

function padOutput(strInput, outputLength){
	var output = strInput;

	for ( ; output.length < outputLength; ){
		output = '0' + output;
	}

	return output;
}
