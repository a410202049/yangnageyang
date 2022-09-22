function base64_encode(t) {
	for (var e, o, n, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", a = 0, r = t.length, c = ""; a < r; ) {
		if (e = 255 & t.charCodeAt(a++), a == r) {
			c += i.charAt(e >> 2), c += i.charAt((3 & e) << 4), c += "==";
			break;
		}
		if (o = t.charCodeAt(a++), a == r) {
			c += i.charAt(e >> 2), c += i.charAt((3 & e) << 4 | (240 & o) >> 4), c += i.charAt((15 & o) << 2), 
			c += "=";
			break;
		}
		n = t.charCodeAt(a++), c += i.charAt(e >> 2), c += i.charAt((3 & e) << 4 | (240 & o) >> 4), 
		c += i.charAt((15 & o) << 2 | (192 & n) >> 6), c += i.charAt(63 & n);
	}
	return c;
}

function base64_decode(data) {
	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
			ac = 0,
			dec = "",
			tmp_arr = [];

	if (!data) {
			return data;
	}

	data += '';

	do { // unpack four hexets into three octets using index points in b64
			h1 = b64.indexOf(data.charAt(i++));
			h2 = b64.indexOf(data.charAt(i++));
			h3 = b64.indexOf(data.charAt(i++));
			h4 = b64.indexOf(data.charAt(i++));

			bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

			o1 = bits >> 16 & 0xff;
			o2 = bits >> 8 & 0xff;
			o3 = bits & 0xff;

			if (h3 == 64) {
					tmp_arr[ac++] = String.fromCharCode(o1);
			} else if (h4 == 64) {
					tmp_arr[ac++] = String.fromCharCode(o1, o2);
			} else {
					tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
			}
	} while (i < data.length);

	dec = tmp_arr.join('');
	return dec;
}

function decode_yang_data(data, buf_obj) {
    // 羊 数据解码
    var decode_str = base64_decode(data);
    uint16_array = new Uint16Array(decode_str.length);
    for (var i=0;i<decode_str.length;i++)
    { 
        code = decode_str.charCodeAt(i);
        uint16_array[i] = code
    }
    var buffer = Buffer.from(uint16_array);
    var message = buf_obj.decode(buffer);
    var object = buf_obj.toObject(message);
    return object
}

function encode_yang_data(data, buf_obj){
    var message = buf_obj.create(data); 
    // 将 message 转换为 Uint8Array (浏览器) 或 Buffer (node)
    var buffer = buf_obj.encode(message).finish();
    var str = "";
    for (i = 0; i < buffer.length; i++) { 
        str += String.fromCharCode(buffer[i]);
    }
    base64_str = base64_encode(str);
    return base64_str
}

var protobuf = require("protobufjs");
protobuf.load("yang.proto", function(err, root) {
        var base64_str = "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";
        var MatchPlayInfo = root.lookupType("yang.MatchPlayInfo");
        data = decode_yang_data(base64_str, MatchPlayInfo)

        var base64_str = encode_yang_data(data, MatchPlayInfo)
        console.log(base64_str)
        
        /*  
        // protobuf 示例
        // 有效载荷
        var payload = {"gameType":3,"stepInfoList":[{"chessIndex":22,"timeTag":0},{"chessIndex":21,"timeTag":464},{"chessIndex":74,"timeTag":400},{"chessIndex":66,"timeTag":344},{"chessIndex":58,"timeTag":392},{"chessIndex":51,"timeTag":408},{"chessIndex":45,"timeTag":368}]}

        // 获得 message 类型
        var MatchPlayInfo = root.lookupType("yang.MatchPlayInfo");

        // 验证有效负载(如可能不完整或无效)
        var errMsg = MatchPlayInfo.verify(payload);
        if (errMsg)
            throw Error(errMsg);
        // 创建新 message
        var message = MatchPlayInfo.create(payload); // 或使用 .fromObject 如果转换是必要的

        // 将 message 转换为 Uint8Array (浏览器) 或 Buffer (node)
        var buffer = MatchPlayInfo.encode(message).finish();

        // 将 Uint8Array (浏览器) 或 Buffer (node) 解码为 message
        var message = MatchPlayInfo.decode(buffer);
        // 可以将 message 转换回简单对象
        var object = MatchPlayInfo.toObject(message);
        */
})