import $ from 'jquery'
import Session from 'app/Session'
import WebsocketUtils from "app/chat/utils/WebsocketUtils"
import ChatServerActionCreator from "app/chat/actions/ChatServerActionCreator"
import CookieHelper from "utils/CookieHelper"



export class Auth {
    static login(email, pass, cb) {
        cb = arguments[arguments.length - 1];
        if (Session.getLogined()) {
            if (cb) cb({ authenticated: true });
            return;
        }
        loginRequest(email, pass, (res) => {
            if (res.authenticated) {
                Session.setLogined(true);
                Session.setToken(res.data.token);
                Session.setName(res.data.agent.name);
                if (res.data.agent.csid) {
                    Session.setCsId(res.data.agent.csid);
                }
                else {
                    Session.setCsId("");
                }
                Session.setAid(res.data.agent.aid);
                if (res.data.agent.email) Session.setEmail(res.data.agent.email);
                Session.setGroupId(res.data.agent.group_id);
                Session.setRole(res.data.agent.role);
                Session.setOid(res.data.agent.oid);
                if (res.data.agent.avatar) {
                    Session.setAvatar(res.data.agent.avatar);
                } else {
                    Session.setAvatar("");
                }

                if (res.data.group) {
                    Session.setGroupName(res.data.group.name);
                }

                if (res.data.official.lang) Session.setLang(res.data.official.lang);
                if (res.data.official.name) Session.setOffName(res.data.official.name);
                Session.setOffQRCode(res.data.official.qr_code);

                // 当status == 0时表示agent接受新会话
                var onlinestatus = "online";
                if (res.data.agent.status == 1) onlinestatus = "offline";
                Session.setStatus(onlinestatus);

                console.log("res.data.agent",res.data.agent)
                if (cb) cb(res);
            } else {
                if (cb) cb(res);
            }
        })
    }

    static getToken() {
        return Session.getToken();
    }

    static logout(cb) {
        ChatServerActionCreator.clearStores()
        WebsocketUtils.logout();
        Session.setLogined(false);
        logoutRequest(cb);
    }

    static logoutWithoutLogoutRequest(){
        ChatServerActionCreator.clearStores()
        WebsocketUtils.logout();
        Session.setLogined(false);
        CookieHelper.deleteAllCookies();
    }

    static loggedIn() {
        return Session.getLogined();
    }
}

/*
function loginRequest(email, pass, cb) {
    $.ajax({
        url: '/api/v1/cs/login',
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        data: {
            email: email,
            passwd: pass
        },
        success: (cont, txtStatus, xhr) => {
            if (xhr.status === 200) {
                cb({authenticated: true, data: JSON.parse(xhr.responseText)});
            }
            else {
                cb({ authenticated: false, data: JSON.parse(xhr.responseText) });
            }
        },
        error: (xhr, txtStatus, errorThrown) => {
            console.log(xhr);
            cb({ authenticated: false });
        }
    })
}
*/

function loginRequest(email, pass, cb) {
    $.ajax({
        url: '/api/v1/cs/login',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({
            email: email,
            passwd: pass
        }),
        success: (cont, txtStatus, xhr) => {
            if (xhr.status === 200) {
                cb({authenticated: true, data: JSON.parse(xhr.responseText)});
            }
            else {
                cb({ authenticated: false, data: JSON.parse(xhr.responseText) });
            }
        },
        error: (xhr, txtStatus, errorThrown) => {
            console.log(xhr);
            cb({ authenticated: false });
        }
    })
}

function logoutRequest(cb) {
    $.ajax({
        url: '/api/v1/cs/logout',
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        data: {
        },
        success: (cont, txtStatus, xhr) => {
            if (xhr.status === 200) {
                console.log("logout ok: " + JSON.stringify(cont));
            }
            else {
                console.log("logout error: " + JSON.stringify(cont));
            }
            if (cb) cb();
        },
        error: (xhr, txtStatus, errorThrown) => {
            console.log(xhr);
            if (cb) cb();
        }
    })
}

export default Auth