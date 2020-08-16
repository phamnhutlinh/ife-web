function RSA_padding_add_PKCS1_OAEP(digestLen, key_len, label, message){
	
	// Check for message length
	var mLen = message.length;
	if (mLen > (key_len - (2*digestLen) - 2)){
		alert ('The message to be encrypted is too long');
		return;
	}
	
	// Generate the '0' pad octet
	var padString = [];
	var padStringLength = key_len - mLen - (2*digestLen) - 2;
	for (var i = 0; i < padStringLength; i ++){
		padString[i] = 0x00;
	}
	
	// generate label hash
	var lHash;

	if ( label == null || label.length==0 )
		lHash = DEFAULT_LABEL_HASH.slice(); 
	else
		lHash = encodeSHA1(label);

//document.write ('<br>lHash = '+ hexEncodeB(lHash));

	// Create the data block
	var dataBlock = [];
		
	dataBlock = dataBlock.concat (lHash, padString, 0x01, message);
	
//document.write ('<br>datablock = ' + hexEncodeB(dataBlock));
	
	// Generate the seed
	var seed;
	
	//if ( TestMode )
		//seed = [0x44, 0x55 ,0x66 ,0x77 ,0x88 ,0x99 ,0xAA ,0xBB ,0xCC ,0xDD ,0xEE ,0xFF ,0x00 ,0x11 ,0x22 ,0x33 ,0x44 ,0x55 ,0x66 ,0x77];
	//else
	    seed = Rndbytes(digestLen);
	//document.write ('<br>seed= ' + hexEncodeB(seed));
	
	// Generate the dbMask
//document.write ('<br>digestLen = '+ digestLen);
//document.write ('<br>key_len = '+ key_len);
	var dbMask = PKCS1_MGF1 (digestLen, key_len - digestLen - 1, seed);
//document.write ('<br>dbMask= ' + hexEncodeB(dbMask));
//document.write ('<br>SHA-1(dbMask)= ' + hexEncodeB(encodeSHA1(dbMask)));
	
		
	// Masked the datablock
	var maskedDb = simpleXOR (dataBlock, dbMask);
//document.write ('<br>maskedDb= ' + hexEncodeB(maskedDb));
	
	// Generate the seedMask
	var seedMask = PKCS1_MGF1 (digestLen, digestLen, maskedDb);
//document.write ('<br>seedMask= ' + hexEncodeB(seedMask));
	
	// Masked the seed
	var maskedSeed = simpleXOR (seed, seedMask);
//document.write ('<br>maskedSeed= ' + hexEncodeB(maskedSeed));
	
	//Final result
	var encodedMessage = [0x00].concat (maskedSeed, maskedDb);
	
	return encodedMessage;
}

function simpleXOR (first, second){
	var result = [];
	
	for (var i = 0; i < first.length; i ++)
		result[i] = first[i] ^ second[i];
	
	return result;
}

function PKCS1_MGF1(digestLen, maskLen, seed)	{
	
	var cnt = [];		// In 8 bit format.	
	var mgfResult = [];
	var temp = [];
	var mgfIndex = 0;
	
	for (var i = 0; mgfIndex < maskLen; i++){
		cnt[0] = ((i >> 24) & 255);
		cnt[1] = ((i >> 16) & 255);
		cnt[2] = ((i >> 8)) & 255;
		cnt[3] = (i & 255);
		
		var message = seed.concat(cnt);
		temp = encodeSHA1 (message);
		
		for (var j = 0; j < temp.length && mgfIndex < maskLen; j ++, mgfIndex ++){
			mgfResult [mgfIndex] = temp[j];
		}
	}
	
	return mgfResult;	
	
}

function encodeSHA1 (dataByte){
	var SHA1_BLOCKSIZE = 64;
	var dataByteLen = dataByte.length;
	var dataByteIndex = dataByteLen;
	
	// Pad the dataByte
	var zeroPadLength = (64 - ((dataByteLen + 1 + 8) % 64)) % 64;
	dataByte[dataByteIndex] = 0x80;
	dataByteIndex ++;
	for (var i = 0; i < zeroPadLength; i ++, dataByteIndex ++){
		dataByte[dataByteIndex] = 0x00;
	}
	
	// Convert the dataByte length from bytes to bits, and then add the 8-bytes representation of dataByte Length
	dataByteLen = dataByteLen * 8;
	for (var i = 7; i >= 0; i --){
		dataByte[dataByteIndex+i] = (dataByteLen%256) & 0xFF;
		dataByteLen = dataByteLen / 256;
	}
		
	// Initialize variables
	var h0 = 0x67452301;
	var h1 = 0xEFCDAB89;
	var h2 = 0x98BADCFE;
	var h3 = 0x10325476;
	var h4 = 0xC3D2E1F0;
	
	var A,B,C,D,E, temp;
	
	var maxSHA1Chunk = dataByte.length / SHA1_BLOCKSIZE;
	
	for (var sha1ChunkIndex = 0; sha1ChunkIndex < maxSHA1Chunk; sha1ChunkIndex ++){
		var W = [];
		
		for (var WIndex = 0, convertIndex = (sha1ChunkIndex * SHA1_BLOCKSIZE); WIndex < SHA1_BLOCKSIZE / 4; WIndex ++){
			W[WIndex] = bytestowords (dataByte.slice(convertIndex, convertIndex + 4));
			convertIndex = convertIndex + 4;
		}
		
		for (var i = 16; i <= 79; i ++){
			W[i] = rotateLeft(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
		}
		
		//Initialize hash value for this chunk:
		A = h0
	    B = h1
	    C = h2
	    D = h3
	    E = h4
		
		for (var i = 0; i <= 19; i ++){
			temp = safe_add(safe_add(rotateLeft(A,5), ((B&C) | (~B&D))),safe_add(safe_add(E,W[i]),0x5A827999)) & 0x0FFFFFFFF;
			E = D;
			D = C;
			C = rotateLeft(B,30);
			B = A;
			A = temp;
		}

		for(var i=20; i<=39; i++ ) {
			temp = safe_add(safe_add(rotateLeft(A,5),(B ^ C ^ D)),safe_add(safe_add(E,W[i]), 0x6ED9EBA1)) & 0x0FFFFFFFF;
			E = D;
			D = C;
			C = rotateLeft(B,30);
			B = A;
			A = temp;
		}

		for(var i=40; i<=59; i++ ) {
			temp = safe_add(safe_add(rotateLeft(A,5),((B&C) | (B&D) | (C&D))),safe_add(safe_add(E,W[i]),0x8F1BBCDC)) & 0x0FFFFFFFF;
			E = D;
			D = C;
			C = rotateLeft(B,30);
			B = A;
			A = temp;
		}

		for(var i=60; i<=79; i++ ) {
			temp = safe_add(safe_add(rotateLeft(A,5), (B ^ C ^ D)), safe_add(safe_add(E, W[i]), 0xCA62C1D6)) & 0x0FFFFFFFF;
			E = D;
			D = C;
			C = rotateLeft(B,30);
			B = A;
			A = temp;
		}
		
		h0 = safe_add(h0, A) & 0x0FFFFFFFF;
		h1 = safe_add(h1, B) & 0x0FFFFFFFF;
		h2 = safe_add(h2, C) & 0x0FFFFFFFF;
		h3 = safe_add(h3, D) & 0x0FFFFFFFF;
		h4 = safe_add(h4, E) & 0x0FFFFFFFF;
	}
	
	var sha1Result = [];
	var hashResult = wordstobytes (h0);
	sha1Result = hashResult.concat(wordstobytes (h1), wordstobytes (h2), wordstobytes (h3), wordstobytes (h4));
	
	return sha1Result;
}
function wordstobytes(val) {
	var out=[];
	var index = 0;

	for(var i=3; i>=0; i--, index++ ) {
		out[index] = (val>>>(i*8))&0xFF;
	}
	return out;
}

function rotateLeft(X,n) {
	var rotated = ( X<<n ) | (X>>>(32-n));
	return rotated;
}

function bytestowords( byteArray ){
	var out = [];
	
	// input array must be multiple of 4 bytes long
	if (byteArray.length % 4)
		return;

	for ( var i=0 ; i < byteArray.length/4; i ++){
		var wrd = 0;
		
		// insert 4 bytes into word
		for(var j=0; j < 4; j++ ){
			wrd = wrd << 8 | byteArray[i*4 + j];
		}
	out[i] = wrd;
	}
	return out;
}

function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

function Rndbytes(randomLength){
	var a = [];
	for (i=0; i<randomLength; i++)
		a[i]=(Math.floor(256*Math.random()));
	return a;
}