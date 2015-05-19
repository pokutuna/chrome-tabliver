/// <reference path="../../modules/DefinitelyTyped/chrome/chrome.d.ts" />

module TabLiver {

    export function init(): void {
        var query: chrome.tabs.QueryInfo = {
            active: true,
            currentWindow: true,
        };
        var tabFetcher = function() {
            setTimeout(() => {
                chrome.tabs.query(query, (tabs: chrome.tabs.Tab[]) => {
                    if (tabs.length) console.log(tabs[0].id, tabs[0].url);
                    tabFetcher();
                });
            }, 300);
        };
        tabFetcher();
    }
}

TabLiver.init();
