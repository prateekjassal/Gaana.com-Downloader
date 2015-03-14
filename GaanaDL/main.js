console.log("GaanaDL is up and running");
chrome.pageAction.onClicked.addListener(downloadSong);
chrome.tabs.onUpdated.addListener(hidePageAction);

var tabs_urls = {};
/**
Log requests, save Gaana streaming URLs for each tab and show page action corresponding to this
*/
chrome.webRequest.onCompleted.addListener(function(details) 
{
	if (details.statusCode == 200 && details.type == "other")
	{
		var tab = details.tabId;
		tabs_urls.tab = details.url;
		chrome.pageAction.show(details.tabId);
	}
	
}, {
    urls: ["http://streams.gaana.com/mp3/*"]
});

/**
If a new request is fired, hide the page action
*/
chrome.webRequest.onBeforeRequest.addListener(function(details)
 {
	chrome.pageAction.hide(details.tabId);

}, {
    urls: ["http://streams.gaana.com/mp3/*"]
});


/**
Hide page action as soon as a new URL loads up
*/
function hidePageAction(tabId, changeInfo, tab) 
{
	chrome.pageAction.hide(tabId);
}

/**
Download song from a particular tab
*/
function downloadSong()
{
	// Get current tab, retrieve its title and use that as the default file name
	chrome.tabs.query({currentWindow: true, active: true}, function(tab) 
	{
		var title = tab[0].title+'.mp3';
		chrome.downloads.download({url: tabs_urls.tab, saveAs: true, filename: title});
	});
	
}

