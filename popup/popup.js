const RequestData = {
    demo: {
        cssg: {
            url: "http://ex-api-demo-yy.568win.com/web-root/restricted/player/login.aspx",
            company_key: "19EC67817FFC4E87BEFB84DFB6872E49",
        },
        qa: {
            url: "http://ex-api-demo-yy.568win.com/web-root/restricted/player/login.aspx",
            company_key: "5C0AAB8BB7874164B08CAD39A71A2C8E",
        }
    },
    yy2: {
        cssg: {
            url: "http://ex-api-yy2.ttbbyyllyy.com/web-root/restricted/player/login.aspx",
            company_key: "7F87649F7AB04B25AC511AA366A31396",
        },
        qa: {
            url: "http://mirana-yy-prod-c171.568winex.com/web-root/restricted/player/login.aspx",
            company_key: "7F87649F7AB04B25AC511AA366A31396",
        },
    }
}

const CodeForm = document.getElementById("code_form");

if (CodeForm) {
    CodeForm.onsubmit = function (e) {
        e.preventDefault();

        let username = document.getElementById("yy_username").value;
        let gpid = document.getElementById("yy_gpid").value;
        let gameId = document.getElementById("yy_game_id").value;
        let team = document.getElementById("yy_team").value;
        let env = document.getElementById("yy_env").value;
        let device = document.getElementById("device").value;
        let langauge = document.getElementById("lang").value;
        let error_msg = document.getElementById("error_msg");
        let betcode = document.getElementById("yy_betcode").value;

        if (!username.trim() || isNaN(gpid) || isNaN(gameId)) {
            return;
        }

        let request = {
            "Username": username,
            "Portfolio": "SeamlessGame",
            "IsWapSports": false,
            "KYSportsbook": false,
            "CompanyKey": RequestData[env][team].company_key
        };

        if(RequestData[env][team].url) {
            fetch(RequestData[env][team].url, {
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
                    
                    if(betcode) url += "&betcode=" + betcode;

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
}
