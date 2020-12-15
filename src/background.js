browser.tabs.onUpdated.addListener(function(tabId, info, tab) {
    if (info.status === "complete") {
        chrome.tabs.sendMessage(tabId, {
            message: tab.title
        });
    }
})