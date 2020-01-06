/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(h,s){var f={},g=f.lib={},q=function(){},m=g.Base={extend:function(a){q.prototype=this;var c=new q;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
r=g.WordArray=m.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=s?c:4*a.length},toString:function(a){return(a||k).stringify(this)},concat:function(a){var c=this.words,d=a.words,b=this.sigBytes;a=a.sigBytes;this.clamp();if(b%4)for(var e=0;e<a;e++)c[b+e>>>2]|=(d[e>>>2]>>>24-8*(e%4)&255)<<24-8*((b+e)%4);else if(65535<d.length)for(e=0;e<a;e+=4)c[b+e>>>2]=d[e>>>2];else c.push.apply(c,d);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=h.ceil(c/4)},clone:function(){var a=m.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],d=0;d<a;d+=4)c.push(4294967296*h.random()|0);return new r.init(c,a)}}),l=f.enc={},k=l.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++){var e=c[b>>>2]>>>24-8*(b%4)&255;d.push((e>>>4).toString(16));d.push((e&15).toString(16))}return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b+=2)d[b>>>3]|=parseInt(a.substr(b,
2),16)<<24-4*(b%8);return new r.init(d,c/2)}},n=l.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++)d.push(String.fromCharCode(c[b>>>2]>>>24-8*(b%4)&255));return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b++)d[b>>>2]|=(a.charCodeAt(b)&255)<<24-8*(b%4);return new r.init(d,c)}},j=l.Utf8={stringify:function(a){try{return decodeURIComponent(escape(n.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return n.parse(unescape(encodeURIComponent(a)))}},
u=g.BufferedBlockAlgorithm=m.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=j.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,d=c.words,b=c.sigBytes,e=this.blockSize,f=b/(4*e),f=a?h.ceil(f):h.max((f|0)-this._minBufferSize,0);a=f*e;b=h.min(4*a,b);if(a){for(var g=0;g<a;g+=e)this._doProcessBlock(d,g);g=d.splice(0,a);c.sigBytes-=b}return new r.init(g,b)},clone:function(){var a=m.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});g.Hasher=u.extend({cfg:m.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){u.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,d){return(new a.init(d)).finalize(c)}},_createHmacHelper:function(a){return function(c,d){return(new t.HMAC.init(a,
d)).finalize(c)}}});var t=f.algo={};return f}(Math);
(function(h){for(var s=CryptoJS,f=s.lib,g=f.WordArray,q=f.Hasher,f=s.algo,m=[],r=[],l=function(a){return 4294967296*(a-(a|0))|0},k=2,n=0;64>n;){var j;a:{j=k;for(var u=h.sqrt(j),t=2;t<=u;t++)if(!(j%t)){j=!1;break a}j=!0}j&&(8>n&&(m[n]=l(h.pow(k,0.5))),r[n]=l(h.pow(k,1/3)),n++);k++}var a=[],f=f.SHA256=q.extend({_doReset:function(){this._hash=new g.init(m.slice(0))},_doProcessBlock:function(c,d){for(var b=this._hash.words,e=b[0],f=b[1],g=b[2],j=b[3],h=b[4],m=b[5],n=b[6],q=b[7],p=0;64>p;p++){if(16>p)a[p]=
c[d+p]|0;else{var k=a[p-15],l=a[p-2];a[p]=((k<<25|k>>>7)^(k<<14|k>>>18)^k>>>3)+a[p-7]+((l<<15|l>>>17)^(l<<13|l>>>19)^l>>>10)+a[p-16]}k=q+((h<<26|h>>>6)^(h<<21|h>>>11)^(h<<7|h>>>25))+(h&m^~h&n)+r[p]+a[p];l=((e<<30|e>>>2)^(e<<19|e>>>13)^(e<<10|e>>>22))+(e&f^e&g^f&g);q=n;n=m;m=h;h=j+k|0;j=g;g=f;f=e;e=k+l|0}b[0]=b[0]+e|0;b[1]=b[1]+f|0;b[2]=b[2]+g|0;b[3]=b[3]+j|0;b[4]=b[4]+h|0;b[5]=b[5]+m|0;b[6]=b[6]+n|0;b[7]=b[7]+q|0},_doFinalize:function(){var a=this._data,d=a.words,b=8*this._nDataBytes,e=8*a.sigBytes;
d[e>>>5]|=128<<24-e%32;d[(e+64>>>9<<4)+14]=h.floor(b/4294967296);d[(e+64>>>9<<4)+15]=b;a.sigBytes=4*d.length;this._process();return this._hash},clone:function(){var a=q.clone.call(this);a._hash=this._hash.clone();return a}});s.SHA256=q._createHelper(f);s.HmacSHA256=q._createHmacHelper(f)})(Math);
(function(){var h=CryptoJS,s=h.enc.Utf8;h.algo.HMAC=h.lib.Base.extend({init:function(f,g){f=this._hasher=new f.init;"string"==typeof g&&(g=s.parse(g));var h=f.blockSize,m=4*h;g.sigBytes>m&&(g=f.finalize(g));g.clamp();for(var r=this._oKey=g.clone(),l=this._iKey=g.clone(),k=r.words,n=l.words,j=0;j<h;j++)k[j]^=1549556828,n[j]^=909522486;r.sigBytes=l.sigBytes=m;this.reset()},reset:function(){var f=this._hasher;f.reset();f.update(this._iKey)},update:function(f){this._hasher.update(f);return this},finalize:function(f){var g=
this._hasher;f=g.finalize(f);g.reset();return g.finalize(this._oKey.clone().concat(f))}})})();

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function(){var h=CryptoJS,j=h.lib.WordArray;h.enc.Base64={stringify:function(b){var e=b.words,f=b.sigBytes,c=this._map;b.clamp();b=[];for(var a=0;a<f;a+=3)for(var d=(e[a>>>2]>>>24-8*(a%4)&255)<<16|(e[a+1>>>2]>>>24-8*((a+1)%4)&255)<<8|e[a+2>>>2]>>>24-8*((a+2)%4)&255,g=0;4>g&&a+0.75*g<f;g++)b.push(c.charAt(d>>>6*(3-g)&63));if(e=c.charAt(64))for(;b.length%4;)b.push(e);return b.join("")},parse:function(b){var e=b.length,f=this._map,c=f.charAt(64);c&&(c=b.indexOf(c),-1!=c&&(e=c));for(var c=[],a=0,d=0;d<
e;d++)if(d%4){var g=f.indexOf(b.charAt(d-1))<<2*(d%4),h=f.indexOf(b.charAt(d))>>>6-2*(d%4);c[a>>>2]|=(g|h)<<24-8*(a%4);a++}return j.create(c,a)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();



const nest = {
	setAPIDomain: function(url){
		if(url == null || url == ""){
			url = nest.DEFAULT_API_DOMAIN;
		}
		localStorage.setItem("nest-api-domain", url);
		nest.apidomain = url;
	}
};
(function(){
	nest.DEFAULT_API_DOMAIN = 'https://api.nest.saker.build';
	let lsapidomain = localStorage.getItem("nest-api-domain");
	if (lsapidomain != null && lsapidomain != ""){
		nest.apidomain = lsapidomain;
	}else{
		nest.apidomain = nest.DEFAULT_API_DOMAIN;
	}
}());



// https://gist.github.com/geraintluff/21beb1066fc5239304aa
// Convert from normal to web-safe, strip trailing "="s
function webSafe64(base64) {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Convert from web-safe to normal, add trailing "="s
function normal64(base64) {
    return base64.replace(/\-/g, '+').replace(/_/g, '/') + '=='.substring(0, (3 * base64.length) % 4);
}


function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
nest.utils = {
	addPendingRequest: function(){
		let lattr = document.body.getAttribute('data-requests');
		if(lattr == null) {
			lattr = 'r';
		} else {
			lattr += 'r';
		}
		document.body.setAttribute('data-requests', lattr);
	},
	removePendingRequest: function(){
		let clattr = document.body.getAttribute('data-requests');
		if(clattr == null || clattr == '' || clattr.length == 0){
			return;
		}
		clattr = clattr.substring(0, clattr.length - 1);
		document.body.setAttribute('data-requests', clattr);
	},
	makeajax: function(params) {
		nest.utils.addPendingRequest();
		return $.ajax(params).always(function(){
			nest.utils.removePendingRequest();
		});
	},
	formatDate: function(date) {
	  var monthNames = [
	    "January", "February", "March",
	    "April", "May", "June", "July",
	    "August", "September", "October",
	    "November", "December"
	  ];
	
	  var day = date.getDate();
	  var monthIndex = date.getMonth();
	  var year = date.getFullYear();
	
	  return year + ' ' + monthNames[monthIndex] + ' ' + day;
	},
	loadSortableListJs: function(){
		loadScriptIfNotLoaded(
			"/Sortable.min.js", 
			"sortable-list",
			"sha256-9D6DlNlpDfh0C8buQ6NXxrOdLo/wqFUwEB1s70obwfE="
			);
		return "sortable-list";
	},
	jsonWithSession: function(json, session, url, method){
		if(json == null){
			json = {};
		}
		if(session == null){
			return json;
		}
		let strjson = JSON.stringify(json);
		let mac = CryptoJS.HmacSHA256(CryptoJS.enc.Utf8.parse(method + url + session.key + strjson), CryptoJS.enc.Base64.parse(normal64(session.secret)));
		let macbase64 = CryptoJS.enc.Base64.stringify(mac);
		let result = {
			NestRequestContent: strjson,
			NestAPIKey: session.key,
			NestRequestMAC: webSafe64(macbase64)
		};
		return result;
	},
	jsonStrWithSession: function(json, session, url, method) {
		return JSON.stringify(nest.utils.jsonWithSession(json, session, url, method));
	},
	setAjaxData: function(params, json, session) {
		params.processData = false;
        params.contentType = "text/plain; charset=utf-8";
        params.type = 'POST';
        params.data = nest.utils.jsonStrWithSession(json, session, params.url, params.type);
	}
		
};



nest.bundleid = {
	getversion: function(bundleid) {
		let split = bundleid.split(/[-]+/);
		for (let i = 0; i < split.length; i++) {
			if(split[i].match(/v(0|([1-9][0-9]*))(\.(0|([1-9][0-9]*)))*/)){
				return split[i];
			}
		}
		return null;
	},
	withoutversion: function(bundleid) {
		let split = bundleid.split(/[-]+/);
		for (let i = 1; i < split.length; i++) {
			if(split[i].match(/v(0|([1-9][0-9]*))(\.(0|([1-9][0-9]*)))*/)){
				split.splice(i, 1);
				--i;
			}
		}
		return split.join('-');
	},
	getbundlename: function(bundleid){
		let idx = bundleid.indexOf('-');
		if(idx < 0){
			return bundleid;
		}
		return bundleid.substring(0, idx);
	},
	versioncomparator: function(l, r){
		if(l == r){
			return 0;
		}
		l = l.substring(1);
		r = r.substring(1);
		var la = l.split(/[.]+/);
		var ra = r.split(/[.]+/);
		var len = Math.min(la.length, ra.length);
		for (let i = 0; i < len; i++){
			var lv = parseInt(la[i]);
			var rv = parseInt(ra[i]);
			let cmp = lv - rv;
			if(cmp != 0){
				return cmp;
			}
		}
		return la.length - ra.length;
	},
	reverseversioncomparator: function(l, r) {
		return nest.bundleid.versioncomparator(r, l);
	}
};



nest.user = {
	login: function(username, password){
		 return nest.utils.makeajax({ 
	         url   : nest.apidomain + '/user/login',
	         type  : 'POST',
	         data  : {
	         	"username": username,
	         	"password": password
	         }
	    });
	},
	logout: function(session) {
		let params = { 
	         url   : nest.apidomain + '/user/logout',
	         type  : 'POST'
	    };
	    nest.utils.setAjaxData(params, {}, session);
		return nest.utils.makeajax(params);	
	},
	register: function(username, email, password, terms){
		 return nest.utils.makeajax({ 
	         url   :  nest.apidomain + '/user/register',
	         type  : 'POST',
	         data  : {
	         	"username": username,
	         	"password": password,
	         	"email": email,
	         	"terms": terms
	         }
	    });
	},
	info: function(session) {
		let params = { 
	         url   : nest.apidomain + '/user/info',
	         type  : 'GET'
	    };
	    nest.utils.setAjaxData(params, {}, session);
		return nest.utils.makeajax(params);	
	},
	verify: function(verification) {
		return nest.utils.makeajax({ 
	         url   : nest.apidomain + '/user/verify',
	         type  : 'POST',
	         data  : {
	         	"verification": verification
	         }
	    });
	},
	modifysettings: function(session, password, email, newpassword){
		let params = { 
	         url   : nest.apidomain + '/user/settings/modify',
	         type  : 'POST'
	    };
	    nest.utils.setAjaxData(params, {
         	"email": email,
         	"password": password,
         	"newpassword": newpassword
        }, session);
		return nest.utils.makeajax(params);
	},
	resendverification: function(session){
		let params = { 
	         url   : nest.apidomain + '/user/verification/resend',
	         type  : 'POST'
	    };
	    nest.utils.setAjaxData(params, {}, session);
		return nest.utils.makeajax(params);
	},
	forgotpassword: function(session, username){
		let params = { 
	         url   : nest.apidomain + '/user/forgot/password',
	         type  : 'POST'
	    };
	    nest.utils.setAjaxData(params, {
         	"username": username
        }, session);
		return nest.utils.makeajax(params);
	},
	forgotusername: function(session, email){
		let params = { 
	         url   : nest.apidomain + '/user/forgot/username',
	         type  : 'POST'
	    };
	    nest.utils.setAjaxData(params, {
         	"email": email
        }, session);
		return nest.utils.makeajax(params);
	}, 
	recoverpassword: function(session, reset, password){
		let params = { 
	         url   : nest.apidomain + '/user/recover/password',
	         type  : 'POST'
	    };
	     nest.utils.setAjaxData(params,{
         	"reset" : reset,
         	"password": password
         }, session);
		return nest.utils.makeajax(params);
	}
};



nest.tasks = {
	getclaimed: function(session, packagename) {
		let params = { 
	         url   : nest.apidomain + '/package/tasks/claimed?' + $.param({
	         	"packagename": packagename
	         }),
	         type  : 'GET'
	    };
	    nest.utils.setAjaxData(params, {}, session);
		return nest.utils.makeajax(params);
	},
	claim: function(session, packagename, taskname){
		let params = { 
	         url   : nest.apidomain + '/package/tasks/claim?' + $.param({
	         	"packagename" : packagename,
	         	"taskname" : taskname
	         }),
	         type  : 'POST'
	    };
	    nest.utils.setAjaxData(params, {}, session);
		return nest.utils.makeajax(params);
	},
	unclaim: function(session, packagename, taskname) {
		let params = { 
	         url   : nest.apidomain + '/package/tasks/unclaim?' + $.param({
	         	"packagename" : packagename,
	         	"taskname" : taskname
	         }),
	         type  : 'POST'
	    };
	    nest.utils.setAjaxData(params, {}, session);
		return nest.utils.makeajax(params);
	}
};



nest.bundles = {
	claim: function(session, packagename){
		let params = { 
	         url   : nest.apidomain + '/package/claim?' + $.param({
	         	"packagename": packagename
	         }),
	         type  : 'POST'
	    };
	    nest.utils.setAjaxData(params, {}, session);
		return nest.utils.makeajax(params);
	},
	getclaimed: function(session) {
		let params = { 
	         url   : nest.apidomain + '/package/claimed',
	         type  : 'GET'
	    };
	    nest.utils.setAjaxData(params, {}, session);
		return nest.utils.makeajax(params);
	},
	unclaim: function(session, packagename){
		let params = { 
	         url   : nest.apidomain + '/package/unclaim?' + $.param({
	         	"packagename": packagename
	         }),
	         type  : 'POST'
	    };
	    nest.utils.setAjaxData(params, {}, session);
		return nest.utils.makeajax(params);
	},
	getapikeys: function(session, packagename){
		let params = { 
	         url   : nest.apidomain + '/package/keys?'+ $.param({
	         	"packagename": packagename
	         }),
	         type  : 'GET'
	    };
	    nest.utils.setAjaxData(params, {}, session);
		return nest.utils.makeajax(params);
	},
	getuserbundledetails: function(session, packagename){
		let params = { 
	         url   : nest.apidomain + '/user/package/details/get?' + $.param({
	         	"packagename": packagename
	         }),
	         type  : 'GET'
	    };
	    nest.utils.setAjaxData(params, {}, session);
		return nest.utils.makeajax(params);
	},
	setuserbundledetails: function(session, packagename, details){
		let params = { 
	         url   : nest.apidomain + '/user/package/details/set?' + $.param({
	         	"packagename": packagename
	         }),
	         type  : 'POST'
	    };
	    nest.utils.setAjaxData(params, {
	    	data: details
    	}, session);
		return nest.utils.makeajax(params);
	},
	publish: function(session, packagename, version, bundles) {
		let params = { 
	         url   : nest.apidomain + '/package/publish?' + $.param({
	         	"packagename": packagename,
	         	"version": version
	         }),
	         type  : 'POST'
	    };
	    nest.utils.setAjaxData(params, {
	    	data: bundles
	    }, session);
		return nest.utils.makeajax(params);
	},
	delete: function(session, bundleid, hash) {
		let params = { 
	         url   : nest.apidomain + '/bundle/delete?' + $.param({
	         	"bundleid": bundleid,
	         	"hash": hash 
	         }),
	         type  : 'POST'
	    };
	    nest.utils.setAjaxData(params, {}, session);
		return nest.utils.makeajax(params);
	},
	search: function(session, keywords, offset, count) {
		let params = { 
	         url   : nest.apidomain + '/package/search?' + $.param({
	         	"phrase": keywords,
	         	"offset": offset,
	         	"count": count
	         }),
	         type  : 'POST'
	    };
	    nest.utils.setAjaxData(params, {}, session);
		return nest.utils.makeajax(params);
	},
	_returncachedresponse: function(response){
		return {
			done: function(donefunc) {
				donefunc(response);
				return this;
			},
			always: function(alwaysfunc) {
				alwaysfunc(response);
				return this;
			},
			fail: function(){
				//ignored
				return this;
			}
		};
	},
	_cached_details: { },
	getdetails: function(session, packagename){
		let cached = this._cached_details[packagename];
		if (cached != null){
			return this._returncachedresponse(cached);
		}
		let params = { 
	         url   : nest.apidomain + '/package/details?' + $.param({
	         	"packagename": packagename
	         }),
	         type  : 'GET'
	    };
	    nest.utils.setAjaxData(params, {}, session);
		return nest.utils.makeajax(params).done(function(response) {
			nest.bundles._cached_details[packagename] = response;
		});
	},
	_cached_versiondetails: { },
	getversiondetails: function(session, packagename, version){
		let cached = this._cached_versiondetails[packagename];
		if (cached != null){
			let cachedversion = cached[version];
			if(cachedversion != null){
				return this._returncachedresponse(cachedversion);
			}
		} else {
			this._cached_versiondetails[packagename] = { };
		}
		let params = { 
	         url   : nest.apidomain + '/package/details/version?' + $.param({
	         	"packagename": packagename,
	         	"version": version
	         }),
	         type  : 'GET'
	    };
	    nest.utils.setAjaxData(params, {}, session);
		return nest.utils.makeajax(params).done(function(response) {
			nest.bundles._cached_versiondetails[packagename][version] = response;
		});
	},
	regeneratepackagekeys: function(session, packagename, currentkeys){
		let params = { 
	         url   : nest.apidomain + '/bundle/keys/regenerate?' + $.param({
	         	"packagename": packagename
	         }),
	         type  : 'POST'
	    };
	    nest.utils.setAjaxData(params, {
	    	UploadAPIKey: currentkeys.key
	    }, session);
		return nest.utils.makeajax(params);
	},
	getdocpath: function(pathname, prefixpathlen){
		let split = pathname.split('/');
		return docpath.length <= prefixpathlen ? "" : split.slice(prefixpathlen, split.length).join('/');
	},
	findinfoindoctree: function(docpath, doctree){
		if(docpath == null || docpath == "" || docpath === undefined){
			return doctree;
		}
		let split = docpath.split('/');
		let curobj = doctree;
		for(let i = 0; i < split.length; ++i) {
			curobj = curobj.sub[split[i]];
			if(curobj == null){
				return null;
			}
		}
		return curobj;
	},
	findparentinfoindoctree: function(docpath, doctree){
		let lidx = docpath.lastIndexOf('/');
		if(lidx < 0){
			return doctree;
		}
		return nest.bundles.findinfoindoctree(docpath.substring(0, lidx), doctree);
	},
	iteratedoctree: function(doctree, consumer){
		var BreakException = {};

		if(doctree.path != ''){
			if(consumer(doctree) === false){
				return false;
			}
		}
		try {
			doctree.sorting.forEach(function(val) {
				let dt = doctree.sub[val];
				if(nest.bundles.iteratedoctree(dt, consumer) === false){
					throw BreakException;
				}
			});
			return;
		} catch (e) {
			if (e !== BreakException) throw e;
		}
		return false;
	},
	findpreviousnonemptyinfoindoctree: function(docpath, doctree){
		let latest = null;
		nest.bundles.iteratedoctree(doctree, function(dt){
			if(dt.path == docpath){
				return false;
			}
			if(dt.info.empty){
				return;
			}
			latest = dt;
		});
		return latest;
	},
	findnextnonemptyinfoindoctree: function(docpath, doctree){
		let result = null;
		let exit = false;
		nest.bundles.iteratedoctree(doctree, function(dt){
			if(dt.path == docpath){
				exit = true;
				return;
			}
			if(dt.info.empty){
				return;
			}
			if(exit){
				result = dt;
				return false;
			}
		});
		return result;
	},
	hasdoctreeanycontent: function(doctree){
		let result = false;
		nest.bundles.iteratedoctree(doctree, function(dt){
			if(!dt.info.empty){
				result = true;
				return false;
			}
		});
		return result;
	},
	hasdoctreeanydirectchildcontent: function(doctree){
		let result = false;
		$.each(doctree.sub, function(idx, val){
			if(!val.info.empty){
				result = true;
				return false;
			}
		});
		return result;
	}
};



nest.search = {
	fillTagsDiv: function(tags, tagsdiv){
		tags.forEach(function(tag){
			tagsdiv.append(
				$(document.createElement('a'))
				.text('#' + tag)
				.attr({
					"data-tag": '#' + tag,
					"title": 'Tag: ' + tag 
				})
				.addClass('searchresulttag')
				.nestLinkify('/search?' + $.param({ phrase: '#' + tag }))
			);
		});
	},
	createTagsDiv: function(tags){
		let tagsdiv = $(document.createElement('div'))
						.addClass('searchtagsdiv');
		nest.search.fillTagsDiv(tags, tagsdiv);
		return tagsdiv;
	},
	_applySearchResponseToDiv: function(jqresdiv, response){
		jqresdiv.empty();
		if(response.result.length == 0){
			
		}else{
			response.result.forEach(function(entry){
				let date = new Date(entry.publishdate);
				let entrydiv = $(document.createElement('div'))
					.addClass('searchresultentrycontainer'); 
					
				jqresdiv.append(entrydiv);
				
				let headlink = $(document.createElement('a'));
				entrydiv
				.append(
					$(document.createElement('div'))
					.css('display', 'flex')
					.css('align-items', 'center')
					.css('flex-wrap', 'wrap')
					.css('padding-bottom', '8px')
					.append(
						headlink
						.addClass('searchentrytitle')
						.attr('title', 'Package ' + entry.packagename)
						.text(entry.packagename)
						.nestLinkify('/package/' + entry.packagename)
					)
					.append(
						$(document.createElement('span'))
						.addClass('searchentrydate')
						.css('font-size', '0.9em')
						.text(nest.utils.formatDate(date))
					)
				)
				if(entry.version != null){
					headlink.append(
						$(document.createElement('span'))
						.css('font-size', '0.8em')
						.css('color', 'var(--secondary-information-text-color)')
						.text('-' + entry.version)	
					);
				}
				if(entry.description != null){
					let descdiv = $(document.createElement('div')).addClass('markdown-content');
					entrydiv.append(descdiv);
					descdiv.markdownContent(entry.description);
				}
				entrydiv.append(nest.search.createTagsDiv(entry.tags));
			});
		}
	},
	_cached_latestreleases: null,
	searchForDivLatestReleases: function(jqresdiv){
		if(nest.search._cached_latestreleases != null){
			nest.search._applySearchResponseToDiv(jqresdiv, nest.search._cached_latestreleases);
			return;
		}
		return nest.search.searchForDiv(jqresdiv, '', 0, 5)
			.done(function(response){
				nest.search._cached_latestreleases = response;
			});
	},
	searchForDiv: function(jqresdiv, phrase, offset, count) {
		return nest.bundles.search(nestclient.session, phrase, offset, count)
		.done(function(response){
			nest.search._applySearchResponseToDiv(jqresdiv, response);
		})
		.fail(function(xhr, status){
			nestclient.showtoast('Failed to execute search.', 5000);
		});
	}
};