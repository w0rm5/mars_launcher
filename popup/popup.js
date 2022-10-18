const codeForm = document.getElementById("codeForm");

if (codeForm) {
    codeForm.onsubmit = function (e) {
        e.preventDefault();

        let username = document.getElementById("username").value;
        let gpid = document.getElementById("gpid").value;
        let company_key = document.getElementById("company_key").value;
        let gameId = document.getElementById("game_id").value;
        let device = document.getElementById("device").value;
        let langauge = document.getElementById("lang").value;
        let error_msg = document.getElementById("error_msg");

        if (!username.trim() || isNaN(gpid) || isNaN(gameId)) {
            return;
        }

        let request = {
            "Username": username,
            "Portfolio": "SeamlessGame",
            "IsWapSports": false,
            "KYSportsbook": false,
            "CompanyKey": company_key
        };

        fetch("http://ex-api-demo-yy.568win.com/web-root/restricted/player/login.aspx", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        })
            .then((response) => response.json())
            .then((data) => {

                if (data.error.id == 0) {
                    
                    let url = "http:" + data.url + "&gpid=" + gpid + "&gameid=" + gameId + "&device=" + device + "&lang=" + langauge;
                    
                    let launchInPrivate = document.getElementById("private_browser").checked;
                    
                    if (launchInPrivate) {
                        chrome.windows.getAll({ populate: false, windowTypes: ['normal'] }, function (windows) {
                            for (let w of windows) {
                                if (w.incognito) {
                                    chrome.tabs.create({ url: url, windowId: w.id });
                                    return;
                                }
                            }
                            chrome.windows.create({ url: url, incognito: true });
                        });
                        return;
                    }
                    chrome.tabs.create({ url: url });
                } else {
                    error_msg.innerHTML = data.error.msg;
                }

            })
            .catch((error) => {
                error_msg.innerHTML  = JSON.stringify(error);
            });
    }
}
