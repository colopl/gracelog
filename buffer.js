var buff = {
	verbose: { data: [], size: 0 },
	sys: { data: [], size: 0 },
	debug: { data: [], size: 0 },
	trace: { data: [], size: 0 },
	info: { data: [], size: 0 },
	warn: { data: [], size: 0 },
	error: { data: [], size: 0 },
	fatal: { data: [], size: 0 }
};
// default 8 KB
var limit = 8192;

module.exports.setup = function (size) {
	if (size !== undefined && size !== null) {
		limit = size;
	}
};

module.exports.add = function (level, msg) {
	buff[level].data.push({
		msg: msg.message,
		time: msg.timestamp
	});
	buff[level].size += Buffer.byteLength(msg.message);

	if (buff[level].size > limit) {
		return module.exports.flush(level);
	}

	return null;
};

module.exports.flush = function (level) {
	if (buff[level].size) {
		var data = buff[level].data;
		buff[level].data = [];
		buff[level].size = 0;
		return data;
	}
	return null;
};

module.exports.flushAll = function () {
	var flushed = {};
	for (var level in buff) {
		flushed[level] = module.exports.flush(level);
	}
	return flushed;
};
