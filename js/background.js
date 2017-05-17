var local_tabId;
function injectScript(tabId, src) {
    local_tabId = tabId;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            chrome.tabs.executeScript(local_tabId,
                {
                    code:
                        "var scr = document.createElement('script');" +
                        "scr.innerHTML = \"" + this.responseText + "\";" +
                        "document.body.appendChild(scr);",
                }
            );

        }
    };
    xhttp.open("GET", src, true);
    xhttp.send();
}

var r = /fluig\.totvs\.com\/.+\/portal-servicos/i;
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    console.debug(changeInfo, tab.url);
    if (changeInfo.status == 'complete'
    &&  r.test(tab.url)) {
        console.debug("loading");
        injectScript(tab.id, "js/injection_script.js");
    }
});
