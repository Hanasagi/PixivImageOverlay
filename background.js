chrome.tabs.onUpdated.addListener((tabId, info,tab) => {
    if (tabId === tab.id) {
        chrome.tabs.sendMessage(tabId, {
            message: tab.title
        });
    }
});
