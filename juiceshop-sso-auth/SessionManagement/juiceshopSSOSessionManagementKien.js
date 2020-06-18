/*
 * Session Management script for OWASP Juice Shop
 * 
 * For Authentication select:
 * 		Authentication method:		JSON-based authentication
 * 		Login FORM target URL:		http://localhost:3000/rest/user/login
 * 		URL to GET Login Page:		http://localhost:3000/
 * 		Login Request POST data:	{"email":"test@test.com","password":"test1"}
 * 		Username Parameter:			email
 * 		Password Parameter:			password
 * 		Logged out regex:			\Q{"user":{}}\E
 * 
 * Obviously update with any local changes as necessary.
 */

var COOKIE_TYPE   = org.parosproxy.paros.network.HtmlParameter.Type.cookie;
var HtmlParameter = Java.type('org.parosproxy.paros.network.HtmlParameter')
var ScriptVars    = Java.type('org.zaproxy.zap.extension.script.ScriptVars');

function extractWebSession(sessionWrapper) {
	var token = ScriptVars.getGlobalVar("juiceshop.token");
	if(token != null){
		sessionWrapper.getSession().setValue("token", token);
	}
	
}
    	
function clearWebSessionIdentifiers(sessionWrapper) {
	print("JS mgmt script: clear WebSessionIdentifiers");
	ScriptVars.setGlobalVar("juiceshop.token", null);
}
    	
function processMessageToMatchSession(sessionWrapper) {
	var token = sessionWrapper.getSession().getValue("token");
	if (token === null) {
		print('JS mgmt script: no token');
		return;
	}
	var cookie = new HtmlParameter(COOKIE_TYPE, "token", token);
	// add the saved authentication token as an Authentication header and a cookie
	var msg = sessionWrapper.getHttpMessage();
	msg.getRequestHeader().setHeader("Authorization", "Bearer " + token);
	var cookies = msg.getRequestHeader().getCookieParams();
	cookies.add(cookie);
	msg.getRequestHeader().setCookieParams(cookies);
}

function getRequiredParamsNames() {
	return [];
}

function getOptionalParamsNames() {
	return [];
}