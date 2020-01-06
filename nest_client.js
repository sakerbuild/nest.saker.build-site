var nestclient = {
	session: null,
	site_title_append: ' | saker.nest',
	userinfo: {
		loggedin: false,
		_isset: false,
		_set: function(info){
			if(info == null){
				nestclient.userinfo.loggedin = false;
			} else {
				$.each(info, function(idx, val){
					nestclient.userinfo[idx] = val;
				});
				nestclient.userinfo.loggedin = true;
			}
			nestclient.userinfo._isset = true;
			nestclient.userinfo.readies.forEach(function(rc){
				rc();
			});
			nestclient.userinfo.readies = [ ];
		},
		readies: [ ],
		ready: function(readycall){
			if(nestclient.userinfo._isset){
				readycall();
			}else{
				nestclient.userinfo.readies.push(readycall);
			}
		}
	},
	setSession: function setSession(session){
		if(nestclient.session != null){
			if(session == null || session.key != nestclient.session.key){
				//logout from current session
				//or swapping a session (which actually shouldnt ever happen)
				nest.user.logout(nestclient.session);
				//dont care about the result
			}
		}
		nestclient.session = session;
		if (session == null) {
			localStorage.removeItem(nest.apidomain + "nest_session_key");
			localStorage.removeItem(nest.apidomain + "nest_session_secret");
		} else {
			localStorage.setItem(nest.apidomain + "nest_session_key", session.key);
			localStorage.setItem(nest.apidomain + "nest_session_secret", session.secret);
		}
	},
	contentPageLogoutHandlers: [],
	onlogout: function(handler){
		nestclient.contentPageLogoutHandlers.push(handler);
	},
	updatelogininfo: function(info){
		nestclient.userinfo._set(info);
		if (info == null){
			document.body.classList.remove('userloggedin');
			document.body.classList.remove('userverified');
			nestclient.contentPageLogoutHandlers.forEach(function(entry){
				entry();
			});
		} else {
			$('body .user-name-display').attr('data-username', info.username);
			document.body.classList.add('userloggedin');
			if(info.verified){
				document.body.classList.add('userverified');
			}
			let redirsattr = $('#content [data-login-redirect]').attr('data-login-redirect');
			if(redirsattr != null && redirsattr != ''){
				nestclient.navigateTo(redirsattr);			
			}
		}
	},
	pushHistoryURL: function(url, ccontent){
		if(ccontent == null){
			ccontent = $("#content").html();
		}
		window.history.pushState({"html":ccontent}, "", url.toString());
	},
	replaceHistoryURL: function(url, ccontent){
		if(ccontent == null){
			ccontent = $("#content").html();
		} 
		window.history.replaceState({"html":ccontent}, "", url.toString());
	},
	loadingPlaceholderHtml: '<div class="lds-ellipsis" style="position: absolute; left: 0; right: 0; top: 0; bottom: 0; margin: auto;"><div></div><div></div><div></div><div></div></div>',
	loadStringContent: function(content, urlPath, addhistory){
		if(addhistory) {
		 	nestclient.pushHistoryURL(urlPath, content);
		}else{
		 	nestclient.replaceHistoryURL(urlPath, content);
		}
		contentPageLogoutHandlers = [];
		$("#content").empty().append(content);
	},
	loadContent: function (url, urlPath, addhistory){
		contentPageLogoutHandlers = [];
		let loadinghtml = nestclient.loadingPlaceholderHtml;
		$("#content").empty().append(loadinghtml);
		nest.utils.makeajax({
			"url" : url,
			type  : 'GET'	
		}).done(function(response){
			nestclient.loadStringContent(response, urlPath, addhistory);
		}).fail(function(xhr) {
			let response = '<div class="container">Failed to retrieve website content.</div>';
			nestclient.loadStringContent(response, urlPath, addhistory);
		});
	},
	navigateTo: function (urlpath, addhistory){
		if(addhistory == null){
			addhistory = true;
		}
		let url;
		if(urlpath.startsWith('/')){
			url = new URL(urlpath, window.location.origin);
		}else{
			url = new URL(urlpath);
		}
		if(url){
			if(url.pathname == "/"){
				nestclient.loadContent("/landing.html", url, addhistory);
				return;
			} else if (url.pathname.startsWith("/user")) {
				if (url.pathname == "/user/verify"){
					nestclient.loadContent("/user/verify.html", url, addhistory);
					return;
				}else if (url.pathname == "/user/packages"){
					nestclient.loadContent("/user/packages.html", url, addhistory);
					return;
				}else if(url.pathname == "/user/settings"){
					nestclient.loadContent("/user/settings.html", url, addhistory);
					return;	
				} else if (url.pathname == '/user/recover/password'){
					nestclient.loadContent("/user/recover/password.html", url, addhistory);
					return;
				}
			}else if (url.pathname == '/register'){
				nestclient.loadContent("/register.html", url, addhistory);
				return;
			}else if (url.pathname == '/login'){
				nestclient.loadContent("/login.html", url, addhistory);
				return;
			} else if (url.pathname == '/forgot/password'){
				nestclient.loadContent("/forgot/password.html", url, addhistory);
				return;
			} else if (url.pathname == '/forgot/username'){
				nestclient.loadContent("/forgot/username.html", url, addhistory);
				return;
			}else if(url.pathname == '/search'){
				nestclient.loadContent("/search.html", url, addhistory);
				return;
			}else if(url.pathname.startsWith('/package')){
				nestclient.loadContent("/package.html", url, addhistory);
				return;
			}else if(url.pathname == '/apidomain'){
				nestclient.loadContent("/apidomain.html", url, addhistory);
				return;
			}else if(url.pathname == '/privacy'){
				nestclient.loadContent("/privacy.html", url, addhistory);
				return;
			}else if(url.pathname == '/terms'){
				nestclient.loadContent("/terms.html", url, addhistory);
				return;
			}
			
			nestclient.loadContent("/404_content.html", url, addhistory);
			return;
		}
	},
	movedelementarray: function(array, oldidx, newidx){
		if(oldidx == newidx){
			return array;
		}
		let elem = array[oldidx];
		if(oldidx < newidx) {
			//element was moved forward
			let result = array.slice();
			result.copyWithin(oldidx, oldidx + 1, newidx + 1);
			result[newidx] = elem;
			return result;
		}
		//element was moved backward
		let result = array.slice();
		result.copyWithin(newidx + 1, newidx, oldidx);
		result[newidx] = elem;
		return result;
	},
	passwordmarkerhtml: `
		<svg class="passwordmasker" viewBox="0 0 24 24">
		    <path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
		</svg>
	`,
	licensesvg: `
		<svg style="width:24px;height:24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" >
			<path fill="currentColor" d="M514 192c34-1 61-28 62-62 1-37-29-67-66-66-34 1-61 28-62 62-1 37 29 67 66 66z m464 384h-18l-127-246c18-2 36-9 52-16 24-11 29-43 11-62l-1-1c-11-11-28-15-43-8-14 6-34 13-53 13-56 0-81-64-287-64s-231 64-287 64c-20 0-39-6-53-13-15-6-32-3-43 8l-1 1c-18 19-13 50 11 62 16 8 34 14 52 16l-127 246h-18c-8 0-14 7-13 15 11 64 92 113 191 113s180-49 191-113c1-8-5-15-13-15h-18l-127-245c83-7 127-49 191-49v486c-35 0-64 29-64 64h-71c-28 0-57 29-57 64h512c0-35-29-64-71-64h-57c0-35-29-64-64-64v-486c64 0 108 42 191 49l-127 245h-18c-8 0-14 7-13 15 11 64 92 113 191 113s180-49 191-113c1-8-5-15-13-15z m-658 0h-192l96-180 96 180z m384 0l96-180 96 180h-192z"/>
		</svg>
	`,
	createpasswordmasker: function(maskerjquery){
		let releaser = function(e){
			$(this).prev()[0].type = 'password';
		};
		let downer = function(e) {
			$(this).prev()[0].type = 'text';
			e.preventDefault();
		};
		$.each(maskerjquery, function(idx, elem){
			$(elem)
				.click(function(e){
					e.preventDefault();
				})
				.mousedown(downer)
				.on('touchstart', downer)
				.on('touchend', releaser)
				.mouseup(releaser)
				.mouseleave(releaser);
		});
	},
	initLoginRequiredPage: function(starturl, handler) {
		if(nestclient.requireLoginRedirectIfSameUrl(starturl)){
			return false;
		}
		nestclient.onlogout(function(){
			if(handler == null) {
				nestclient.requireLoginRedirectIfSameUrl(starturl);
			} else {
				handler();
			}
		});
		return true;
	},
	requireLoginRedirectIfSameUrl: function(starturl){
		let myurl = (new URL(document.location));
		if(starturl.href != myurl.href){
			//check if the user navigated away
			return false;
		}
		return nestclient.requireLoginRedirectUrl(myurl);
	},
	requireLoginRedirectUrl: function(myurl){
		if(nestclient.userinfo.loggedin){
			return false;
		}
		let sp = myurl.searchParams.toString();
		let redurl;
		if(sp != ''){
			redurl = myurl.pathname + '?' + sp;
		}else{
			redurl = myurl.pathname;
		}
		nestclient.navigateTo('/login?' + $.param({ redirect: redurl }));
		return true;
	},
	requireLoginRedirect: function(){
		return nestclient.requireLoginRedirectUrl(new URL(document.location));
	},
	navigateToNoUnsaved: function(url, jqroot){
		nestclient.navigateNoUnsaved(function(){
			nestclient.navigateTo(url);
		}, jqroot);
	},
	confirmNoUnsaved: function(jqroot) {
		if(nestclient.hasUnsaved(jqroot)){
			return window.confirm('There are unsaved data on this page. Are you sure you want to continue?');
		}
		return true;
	},
	navigateNoUnsaved: function(navigator, jqroot){
		if(nestclient.confirmNoUnsaved(jqroot)){
			navigator();
		}
	},
	hasUnsaved: function(jqroot){
		let foundunsaved = false;
		(jqroot == null ? $('[data-unsaved]') : jqroot.add(jqroot.find('[data-unsaved]')))
			.each(function(i, obj){
				let unsavedid = $(this).attr('data-unsaved');
				if(unsavedid != null && unsavedid.trim() != ''){
					foundunsaved = true;
					return false;
				}
			});
		return foundunsaved;
	},
	hasUnsavedId: function(id, jqroot){
		return (jqroot == null ? $('[data-unsaved~="' + id + '"]') > 0 : jqroot.add(jqroot.find('[data-unsaved]')).is('[data-unsaved~="' + id + '"]'));
	},
	addUnsaved: function(jqelem, id){
		jqelem.attr('data-unsaved', function(i, val){
			if(val == null){
				return ' ' + id + ' ';
			}else if(!val.includes(' ' + id + ' ')){
				return val + ' ' + id;
			}
		});
	},
	clearUnsaved: function(jqelem){
		jqelem.add(jqelem.find('[data-unsaved]')).removeAttr('data-unsaved');
	},
	showtoast: function(text, dismisstime){
		let jq = $(document.createElement('div'))
			.addClass('toast toast-dismissable')
			.append(
				$(document.createElement('div'))
				.addClass('toast-content')
				.text(text)
			);
		jq.click(function(){
			jq.slideToggle(100, function(){
				jq.remove();
			});
		});
		$('body #toastcontentcontainer').append(jq);
		$(document).ready(function(){
			jq.slideToggle(100);
			if(dismisstime != null){
				if(dismisstime === 0 || dismisstime < 0){
					dismisstime = 3000; 
				}
				setTimeout(function dismissfunction(){
					if($('body #toastcontentcontainer').is(':hover')){
						$('body #toastcontentcontainer').on('mouseout.toast.dismiss', function mouseouthandler(){
							setTimeout(dismissfunction, dismisstime);
							$(this).off('mouseout.toast.dismiss');
						});
					}else{
						jq.slideToggle(100, function(){
							jq.remove();
						});
					}
				}, dismisstime);
			}
		});
	},
	handleGenericRequestErrors: function(xhr){
		if(xhr == null){
			return false;
		}
		let json = xhr.responseJSON; 
    	if(json == null || json.error == null){
    		nestclient.showtoast('Failed to execute request. (Status: ' + xhr.status + ')', 5000);
    		return true;
    	}
    	switch(json.error){
			case "success":
				//the success error code shouldn't be called for error handling
    			nestclient.showtoast('Unexpected request error. (Inconsistent request result.)', 5000);
    			return true;
			case "internal_error":
				nestclient.showtoast('Internal server error during request.' + (json.message == null ? "" : ` (${ json.message })` ), 5000);
				return true;
			case "missing_parameter":
			case "invalid_method":
				nestclient.showtoast('API protocol error.' + (json.message == null ? "" : ` (${ json.message })` ), 5000);
				return true;
			case "not_logged_in":
				nestclient.showtoast('User is not logged in.' + (json.message == null ? "" : ` (${ json.message })` ), 5000);
				return true;
			case "not_logged_in":
				nestclient.showtoast('User is already logged in.' + (json.message == null ? "" : ` (${ json.message })` ), 5000);
				return true;
			case "invalid_credentials":
				nestclient.showtoast('Invalid credentials.' + (json.message == null ? "" : ` (${ json.message })` ), 5000);
				return true;
			case "illegal_username":
				nestclient.showtoast('Invalid user name.' + (json.message == null ? "" : ` (${ json.message })` ), 5000);
				return true;
			case "illegal_password":
				nestclient.showtoast('Invalid password.' + (json.message == null ? "" : ` (${ json.message })` ), 5000);
				return true;
			case "access_denied":
				nestclient.showtoast('Access denied.' + (json.message == null ? "" : ` (${ json.message })` ), 5000);
				return true;
			case "verification_failed":
				nestclient.showtoast('Failed to verify e-mail address. Verification code may be incorrect or the link expired.', 5000);
				return true;
			default:
				return false;
    	}
		return false;
	},
	unexpectedRequestError: function(xhr){
		if(nestclient.handleGenericRequestErrors(xhr)){
    		return;
    	}
    	let json = xhr.responseJSON;
    	nestclient.showtoast('Unexpected error: ' + json.error + (json.message == null ? "" : ` (${ json.message })` ), 5000);
	},
	resendVerification(){
		nest.user.resendverification(nestclient.session)
		.done(function(response){
			nestclient.showtoast('Success! The e-mail has been sent with the verification link.', 5000);
		}).fail(function(xhr){
			if(nestclient.handleGenericRequestErrors(xhr)){
	    		return;
	    	}
	    	let json = xhr.responseJSON;
	    	nestclient.showtoast('Unexpected error: ' + json.error + (json.message == null ? "" : ` (${ json.message })` ), 5000);
		});
	},
	setAPIDomain: function(url){
		nest.setAPIDomain(url);
		location.reload();
	},
	initMarkdownTextArea: function(jqtextarea) {
		let tabbedviewer;
		let edittab;
		let previewtab;
		if(jqtextarea.parent('.tabcontent').length){
			tabbedviewer = jqtextarea.closest('.tabbedviewer'); 
			edittab = tabbedviewer.children('.tabs').children('.tab[data-tab-content-id="edit"]');
			previewtab = tabbedviewer.children('.tabcontainer').children('.tabcontent[data-tab-content-id="preview"]');
		} else {
			tabbedviewer = $(document.createElement('div'))
				.addClass('tabbedviewer');
			let tabcontainer = $(document.createElement('div'))
				.addClass('tabcontainer')
				.css('padding', '0px')
				.css('min-height', '100px');
			let tabsdiv = $(document.createElement('div'))
				.addClass('tabs')
				.css('border-bottom', 'none');
			edittab = $(document.createElement('div'))
				.addClass('tab')
				.attr('data-tab-content-id', 'edit')
				.attr('title', 'Edit markdown')
				.text('Edit');
			tabsdiv.append(
				edittab
			);
			jqtextarea.css('border', 'none');
			tabcontainer.css('border', '1px solid var(--hr-color)');
			tabcontainer.css('border-radius', '0 0 3px 3px');
			tabcontainer.css('background-color', 'var(--color-background)');
			tabsdiv.append(
				$(document.createElement('div'))
					.addClass('tab')
					.attr('data-tab-content-id', 'preview')
					.attr('title', 'Preview rendered markdown')
					.text('Preview')
			);
			let texttab = $(document.createElement('div'))
				.addClass('tabcontent')
				.attr('data-tab-content-id', 'edit');
			previewtab = $(document.createElement('div'))
				.addClass('tabcontent')
				.addClass('markdown-content')
				.css('padding', '5px')
				.css('min-height', '100px')
				.attr({'data-tab-content-id': 'preview'});
			tabcontainer.append(texttab);
			tabcontainer.append(previewtab);
			tabbedviewer.append(tabsdiv);
			tabbedviewer.append(tabcontainer);
			
			jqtextarea.replaceWith(tabbedviewer);
			
			texttab.append(jqtextarea);
		}
		
		previewtab.off('nest.tab.activated').on('nest.tab.activated', function(){
			previewtab.empty();
			previewtab.markdownContent(jqtextarea.val());
		});
		nestclient.initTabs(tabbedviewer);
		nestclient.activateTab(edittab);
	},
	activateTab: function(tabjquery) {
    	let tabbedviewer = tabjquery.closest('.tabbedviewer');
        tabbedviewer.children('.tabs').children('.tab.active')
        	.removeClass('active').trigger('nest.tab.deactivated');
    	tabbedviewer.children('.tabcontainer').children('.tabcontent.active')
        	.removeClass('active');
        tabjquery.addClass('active');
        tabbedviewer.children('.tabcontainer').children('.tabcontent[data-tab-content-id="' + tabjquery.attr('data-tab-content-id') + '"]')
        	.addClass('active').trigger('nest.tab.activated');
    },
    initTabs: function(jqtabbedviewer) {
    	jqtabbedviewer.children('.tabs').children('.tab[data-tab-content-id]')
	        .click(function() {
	            nestclient.activateTab($(this));
	        });
    }
};
(function() {
	var k = localStorage.getItem(nest.apidomain + "nest_session_key");
	var s = localStorage.getItem(nest.apidomain + "nest_session_secret");
	if (k != null && s != null){
		nestclient.session = {
			key: k,
			secret: s
		};
	}
	window.onpopstate = function(e){
	    if(e.state){
	    	$(document).ready(function() {
	    		nestclient.navigateNoUnsaved(function(){
		    		contentPageLogoutHandlers = [];
		    		$("#content").empty().append(e.state.html);
	    		});
	    		//XXX if navigate fails, then we should push back the previous url
	    	});
	    }
	};
	if(nestclient.session != null){
		nest.user.info(nestclient.session)
		.done(function(response){
			if(response.error == "success"){
				nestclient.updatelogininfo(response.info);
			}else{
				nestclient.updatelogininfo(null);
			}
		}).fail(function(xhr){
			nestclient.updatelogininfo(null);
			nestclient.unexpectedRequestError(xhr);
		});
	}else{
		nestclient.updatelogininfo(null);
	}
	nestclient.navigateTo(window.location.href, false);
})();
var loadedScripts = [];
var loadedScriptWaiters = {};
var loadedStyleSheets = [];
var loadedStyleSheetWaiters = {};
function loadScriptIfNotLoaded(url, id, integrity){
	let myElem = document.getElementById(id);
	if (myElem === null) {
		nest.utils.addPendingRequest();
		
		let script = document.createElement("script");
		
	    script.addEventListener('load', function() {
	    	nest.utils.removePendingRequest();
			loadedScripts.push(id);
			if(loadedScriptWaiters[id] != null){
				loadedScriptWaiters[id].forEach(function(entry){
					entry();
				});
			}
			loadedScriptWaiters[id] = [];
		});
	    
		script.type = "text/javascript";
		script.src = url;
		script.id = id;
		script.async = false;
		if(integrity != null){
			script.integrity = integrity;
			script.crossOrigin = 'anonymous';
		}
		//script.setAttribute("defer", false);
		document.getElementsByTagName("head")[0].appendChild(script);
		return script;
	}
	return myElem;
}
function doWithLoadedScript(id, func){
	if(loadedScripts.includes(id)){
		func();
	}else{
		if(loadedScriptWaiters[id] == null) {
			loadedScriptWaiters[id] = [];
		}
		loadedScriptWaiters[id].push(func);
	}
}
function loadStyleSheetIfNotLoaded(url, id, integrity){
	let myElem = document.getElementById(id);
	if (myElem === null) {
		nest.utils.addPendingRequest();
		
		let link = document.createElement('link');
		
		link.addEventListener('load', function() {
			nest.utils.removePendingRequest();
			loadedStyleSheets.push(id);
			if(loadedStyleSheetWaiters[id] != null){
				loadedStyleSheetWaiters[id].forEach(function(entry){
					entry();
				});
			}
			loadedStyleSheetWaiters[id] = [];
		});
		
		link.id = id;
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = url;
		if(integrity != null){
			link.integrity = integrity;
			link.crossOrigin = 'anonymous';
		}
		document.getElementsByTagName('head')[0].insertBefore(link, document.getElementById('css-nest'));
	}
	return myElem;
}
function doWithLoadedStyleSheet(id, func){
	if(loadedScripts.includes(id)){
		func();
	}else{
		if(loadedStyleSheetWaiters[id] == null) {
			loadedStyleSheetWaiters[id] = [];
		}
		loadedStyleSheetWaiters[id].push(func);
	}
}

$.fn.nestLinkify = function(href) {
	this.each(function(i, elem){
		let thehref;
		if(href == null){
			thehref = $(elem).attr('href');
		}else{
			$(elem).attr({
				"href": href
			});
			thehref = href;
		}
	    return $(elem).off('click.nest').on('click.nest', function(e){
	    	if (e.ctrlKey || e.shiftKey) {
		        //is special click
		    }else{
		    	e.preventDefault();
				nestclient.navigateToNoUnsaved(thehref);
		    }
		});
	});
	return this;
}
$.fn.markdownContent = function(mdtext) {
	let jqthis = this;
	if(mdtext != null){
		this.text(mdtext);
		loadScriptIfNotLoaded("https://cdnjs.cloudflare.com/ajax/libs/markdown-it/10.0.0/markdown-it.min.js", "markdown-it", "sha256-YASERpEeN8gRNr/Fy4Km34WGFqIq1h6HkJMAQnVHlhk=");
		doWithLoadedScript('markdown-it', function(){
			let rendered = new markdownit().render(mdtext);
			let htmlrender = $($.parseHTML(rendered));
			htmlrender.find('img').remove();
			htmlrender.find('a').replaceWith(function(){
				 return $(this).text();
			});
			jqthis.html(htmlrender);
		});
	}else{
		this.empty();
	}
	return this;
};
window.addEventListener('beforeunload', function (e) {
	if(nestclient.hasUnsaved()){
		// Cancel the event as stated by the standard.
		e.preventDefault();
		// Chrome requires returnValue to be set.
		e.returnValue = 'There are unsaved data on this page. Are you sure you want to continue?';
	}
});
