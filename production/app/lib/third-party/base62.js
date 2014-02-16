Base62 = (function () {
  _this = null;

  function Base62() {
	_this = this;
	_this.chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  }

  Base62.prototype = {
	  constructor : Base62,
	  encode : function(i){
		if (i === 0) {return '0'}
		var s = ''
		while (i > 0) {
		  s = this.chars[i % 62] + s
		  i = Math.floor(i/62)
		}
		return s
	  },
	  decode : function(a,b,c,d){
		for (
		  b = c = (
			a === (/\W|_|^$/.test(a += "") || a)
		  ) - 1;
		  d = a.charCodeAt(c++);
		)
		b = b * 62 + d - [, 48, 29, 87][d >> 5];
		return b
	  }
  }
  return Base62;
})();