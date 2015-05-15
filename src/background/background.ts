/// <reference path="../../modules/DefinitelyTyped/chrome/chrome.d.ts" />

module TabLiver {

    export function init(): void {
        var tabFetcher = function() {
            setTimeout(() => {
                chrome.tabs.getCurrent( (tab: chrome.tabs.Tab) => {
                    console.log(tab.id, tab.url);
                    tabFetcher();
                });
            }, 300);
        };
        tabFetcher();
    }
}

TabLiver.init();
