const codeForm = document.getElementById("codeForm");

if(codeForm) {
    codeForm.onsubmit = function(e) {
        e.preventDefault();

        let marsUrl = document.getElementById("mars_url").value;
        let gpid = document.getElementById("gpid").value;
        let gameId = document.getElementById("game_id").value;
        let device = document.getElementById("device").value;
        let langauge = document.getElementById("lang").value;

        if(!marsUrl.trim() || isNaN(gpid) || isNaN(gameId)) {
            return;
        }

        while(marsUrl.startsWith("/")) {
            marsUrl = marsUrl.substring(1);
        }

        let url = "http://" + marsUrl + "&gpid=" + gpid + "&gameid=" + gameId + "&device=" + device + "&lang=" + langauge;

        let launchInPrivate = document.getElementById("private_browser").checked;

        if(launchInPrivate){
            chrome.windows.getAll({populate: false, windowTypes: ['normal']}, function(windows) {
                for (let w of windows) {
                    if (w.incognito) {
                        chrome.tabs.create({url: url, windowId: w.id});
                        return;
                    }
                }
                chrome.windows.create({url: url, incognito: true});
            });
            return;
        }
        chrome.tabs.create({url: url});
    }
}
