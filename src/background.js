browser.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    if (details.frameId === 0)
        setTimeout(() => {
            chrome.tabs.sendMessage(details.tabId, {
                message: "refresh",
                url: details.url
            });
        }, 2000)
});
browser.webNavigation.onCompleted.addListener(function(details) {
    if (details.frameId === 0)
        chrome.tabs.sendMessage(details.tabId, {
            message: "start",
            url: details.url
        });

});