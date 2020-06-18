var By = Java.type('org.openqa.selenium.By');
var Thread = Java.type('java.lang.Thread');

var HttpRequestHeader = Java.type('org.parosproxy.paros.network.HttpRequestHeader');
var HttpHeader = Java.type('org.parosproxy.paros.network.HttpHeader');
var URI = Java.type('org.apache.commons.httpclient.URI');
var ScriptVars    = Java.type('org.zaproxy.zap.extension.script.ScriptVars');
//var TimeUnit = Java.type('java.util.concurrent.TimeUnit');
// The authenticate function will be called for authentications made via ZAP.

// The authenticate function is called whenever ZAP requires to authenticate, for a Context for which this script
// was selected as the Authentication Method. The function should send any messages that are required to do the authentication
// and should return a message with an authenticated response so the calling method.
//
// NOTE: Any message sent in the function should be obtained using the 'helper.prepareMessage()' method.
//
// Parameters:
//		helper - a helper class providing useful methods: prepareMessage(), sendAndReceive(msg), getHttpSender()
//		paramsValues - the values of the parameters configured in the Session Properties -> Authentication panel.
//					The paramsValues is a map, having as keys the parameters names (as returned by the getRequiredParamsNames()
//					and getOptionalParamsNames() functions below)
//		credentials - an object containing the credentials values, as configured in the Session Properties -> Users panel.
//					The credential values can be obtained via calls to the getParam(paramName) method. The param names are the ones
//					returned by the getCredentialsParamsNames() below
ScriptVars.setGlobalVar("juiceshop.count", 0);
function authenticate(helper, paramsValues, credentials) {
	print("Authenticating via Selenium script...");
	count = ScriptVars.getGlobalVar("juiceshop.count");
	print("count: " + count);
	count++;
	ScriptVars.setGlobalVar("juiceshop.count", count);
	print("count: " + count);
     var juiceshop = 'http://192.168.1.14:3000/';
     var username = 'kien@kien.com';
     var password = 'kienpass';
     var extSel = org.parosproxy.paros.control.Control.getSingleton().getExtensionLoader().getExtension(org.zaproxy.zap.extension.selenium.ExtensionSelenium.class)
     var wd = extSel.getWebDriverProxyingViaZAP(1, "firefox");
	//wd.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
     wd.get(juiceshop);
	Thread.sleep(2000);	
     wd.get(juiceshop + '#/login');
     wd.findElement(By.id("email")).sendKeys(username);
     wd.findElement(By.id("password")).sendKeys(password);
     wd.findElement(By.id("loginButton")).click();
	
//	Thread.sleep(5000);	
//	var token_cookie = wd.manage().getCookieNamed('token'); 
//	var token = token_cookie.getValue();
//	print('token: ' + token);
//	ScriptVars.setGlobalVar("juiceshop.token", token);
     wd.close();
     
     var requestUri = new URI(juiceshop + "/rest/user/whoami", false );   
     var requestMethod = HttpRequestHeader.GET;
     var requestHeader = new HttpRequestHeader(requestMethod, requestUri, HttpHeader.HTTP11);
     
 	var msg = helper.prepareMessage();	
	msg.setRequestHeader(requestHeader);
	helper.sendAndReceive(msg);

	return msg;
}

// This function is called during the script loading to obtain a list of the names of the required configuration parameters,
// that will be shown in the Session Properties -> Authentication panel for configuration. They can be used
// to input dynamic data into the script, from the user interface (e.g. a login URL, name of POST parameters etc.)
function getRequiredParamsNames(){
	return [];
}

// This function is called during the script loading to obtain a list of the names of the optional configuration parameters,
// that will be shown in the Session Properties -> Authentication panel for configuration. They can be used
// to input dynamic data into the script, from the user interface (e.g. a login URL, name of POST parameters etc.)
function getOptionalParamsNames(){
	return [];
}

// This function is called during the script loading to obtain a list of the names of the parameters that are required,
// as credentials, for each User configured corresponding to an Authentication using this script 
function getCredentialsParamsNames(){
	return ["username", "password"];
}

// This optional function is called during the script loading to obtain the logged in indicator.
// NOTE: although optional this function must be implemented along with the function getLoggedOutIndicator().
//function getLoggedInIndicator() {
//	return "LoggedInIndicator";
//}

// This optional function is called during the script loading to obtain the logged out indicator.
// NOTE: although optional this function must be implemented along with the function getLoggedInIndicator().
//function getLoggedOutIndicator() {
//	return "LoggedOutIndicator";
//}