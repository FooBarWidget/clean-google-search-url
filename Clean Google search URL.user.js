// ==UserScript==
// @name          Clean Google search URL
// @author        SumTips
// @description   Unscrambles urls on Google search
// @homepage      http://sumtips.com/
// @match         *://*.google.com/search*
// @match         *://*.google.nl/search*
// @version       1.0
// ==/UserScript==

// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
function parseUri(str) {
	var	o   = parseUri.options,
		m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i   = 14;

	while (i--) uri[o.key[i]] = m[i] || "";

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});

	return uri;
};

parseUri.options = {
	strictMode: false,
	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	q:   {
		name:   "queryKey",
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};

function cleanGoogleUrl(url) {
	var uri = parseUri(url);
	if ((uri.host.match(/^www\.google\..+$/) || uri.host == '') && uri.path == "/url" && uri.query && uri.queryKey.url) {
		return unescape(uri.queryKey.url);
	} else {
		return url;
	}
}

function install() {
	var uri = parseUri(location.href);
	if (uri.host.indexOf("google.") >= 0 && uri.path == "/search") {
		var links = document.querySelectorAll("a.l");
		for (var i = 0; i < links.length; i++) {
			var link = links[i];
			var href = link.getAttribute("href");
			link.setAttribute("href", cleanGoogleUrl(href));
			link.setAttribute("onmousedown", "");
	    }
	}
}

function test() {
	console.log(cleanGoogleUrl("http://www.chello.nl"));
	console.log(cleanGoogleUrl("http://www.google.com/tos"));
	console.log(cleanGoogleUrl("http://www.google.com/test?url=foo"));
	console.log(cleanGoogleUrl("http://www.google.nl/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0CFYQFjAA&url=http%3A%2F%2Fwww.mattcutts.com%2Fblog%2Fclean-up-extra-url-parameters-when-searching-google%2F&ei=klTBT5OQJ4eW0QWflvisCg&usg=AFQjCNGqHWFtwg9QIgZ3RbMld-OEpdrnQw"));
	console.log(cleanGoogleUrl("/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0CFYQFjAA&url=http%3A%2F%2Fwww.mattcutts.com%2Fblog%2Fclean-up-extra-url-parameters-when-searching-google%2F&ei=klTBT5OQJ4eW0QWflvisCg&usg=AFQjCNGqHWFtwg9QIgZ3RbMld-OEpdrnQw"));
}

if (this.window) {
	install();
} else {
	test();
}
