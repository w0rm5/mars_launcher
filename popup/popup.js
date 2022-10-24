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

        let launchRequest = {}
        launchRequest.username = document.getElementById("yy_username").value;
        launchRequest.gpid = document.getElementById("yy_gpid").value;
        launchRequest.gameId = document.getElementById("yy_game_id").value;
        launchRequest.team = document.getElementById("yy_team").value;
        launchRequest.env = document.getElementById("yy_env").value;
        launchRequest.device = document.getElementById("device").value;
        launchRequest.langauge = document.getElementById("lang").value;
        launchRequest.error_msg = document.getElementById("error_msg");
        launchRequest.betcode = document.getElementById("yy_betcode").value;

        if (!launchRequest.username.trim() || isNaN(launchRequest.gpid) || isNaN(launchRequest.gameId)) {
            return;
        }

        let request = {
            "Username": launchRequest.username,
            "Portfolio": "SeamlessGame",
            "IsWapSports": false,
            "KYSportsbook": false,
            "CompanyKey": RequestData[launchRequest.env][launchRequest.team].company_key
        };

        if(RequestData[launchRequest.env][launchRequest.team].url) {
            
            fetch(RequestData[launchRequest.env][launchRequest.team].url, {
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
                    
                    let url = "http:" + data.url + "&gpid=" + launchRequest.gpid 
                                + "&gameid=" + launchRequest.gameId 
                                + "&device=" + launchRequest.device + 
                                "&lang=" + launchRequest.langauge;
                    
                    if(launchRequest.betcode) url += "&betcode=" + launchRequest.betcode;

                    launchRequest.launchInPrivate = document.getElementById("private_browser").checked;
                    
                    if (launchRequest.launchInPrivate) {
                        chrome.windows.getAll({ populate: false, windowTypes: ['normal'] }, function (windows) {
                            for (let w of windows) {
                                if (w.incognito) {
                                    StoreLastParams(launchRequest);
                                    chrome.tabs.create({ url: url, windowId: w.id });
                                    return;
                                }
                            }
                            StoreLastParams(launchRequest);
                            chrome.windows.create({ url: url, incognito: true });
                        });
                        return;
                    }
                    StoreLastParams(launchRequest);
                    chrome.tabs.create({ url: url });
                } else {
                    error_msg.innerHTML = data.error.msg;
                }

            })
            .catch((error) => {
                error_msg.innerHTML = "Request error: " + JSON.stringify(error);
            });
        }
    }
}

window.onload = function() {
    chrome.storage.local.get(['yy_last_params'], function(result) {
        let lastParams = result.yy_last_params;
        document.getElementById("yy_username").value = lastParams.username;
        document.getElementById("yy_gpid").value = lastParams.gpid;
        document.getElementById("yy_game_id").value = lastParams.gameId;
        document.getElementById("yy_team").value = lastParams.team;
        document.getElementById("yy_env").value = lastParams.env;
        document.getElementById("device").value = lastParams.device;
        document.getElementById("lang").value = lastParams.langauge;
        document.getElementById("yy_betcode").value = lastParams.betcode;
        document.getElementById("private_browser").checked = lastParams.launchInPrivate;
    });
}

function StoreLastParams(launchRequest) {
    chrome.storage.local.set({yy_last_params: launchRequest});
}