import React from 'react';
import Router from 'react-router';
import routes from 'routes';
import $ from 'jquery'
import Session from "app/Session"
import Lang from "lang/Lang"
import WebsocketUtils from "app/chat/utils/WebsocketUtils"
import log from "loglevel"


log.setDefaultLevel("debug");
//多语言初始化
var lang = Session.getLang();
if (!lang) {
    lang = window.navigator.language;
}
console.log("lang=" + lang);
Lang.setLang(lang);


var tokenExpireHandle = false;  // 为让401的提示不会跑两次
// 设置jQuery Ajax全局的参数
$(document).ajaxError(function myErrorHandler(event, xhr, ajaxOptions, thrownError) {
    switch (xhr.status) {
        case(500):
            alert(Lang.str('system_AjaxError_500') + '(' + xhr.status + ')');
            break;
        case(401):
            if (!tokenExpireHandle) {
                tokenExpireHandle = true;
                alert(Lang.str('system_AjaxError_401'));
                Session.setLogined("false");
                WebsocketUtils.logout();
                var rurl = location.protocol + '//' + location.host
                window.location.href = rurl;
            }
            break;
        case(403):
            alert(Lang.str('system_AjaxError_403') + '(' + xhr.status + ')');
            //window.location.href = location.protocol + '//' + location.hostname;
            break;
        case(408):
            alert(Lang.str('system_AjaxError_408') + '(' + xhr.status + ')');
            break;
        case(0):
            console.log("Status:0");
            break;
        default:
            alert(Lang.str('system_AjaxError_Other') + '(' + xhr.status + ':' + thrownError + ')');
            break;
    }
});

// setup内处理error的方式在刷新页面时无法处理到error
//$(function(){
//    $.ajaxSetup({
//        error: function(jqXHR, textStatus, errorThrown) {
//            console.log("ajax error !!!!!!!!!!!!!!!!")
//            switch (jqXHR.status) {
//                case(500):
//                    alert("服务器系统内部错误");
//                    break;
//                case(401):
//                    alert("该账号token已过期,或者在异地登录");
//                    Session.setLogined("false");
//                    var rurl = location.protocol + '//' + location.hostname
//                    if (location.port) {
//                        rurl = rurl + ':' + location.port
//                    }
//                    window.location.href = rurl;
//                    break;
//                case(403):
//                    alert("无权限执行此操作");
//                    //window.location.href = location.protocol + '//' + location.hostname;
//                    break;
//                case(408):
//                    alert("请求超时");
//                    break;
//                default:
//                    alert("未知错误");
//            }
//        },
//        success: function(data) {
//            alert("操作成功");
//        }
//    });
//});

Router.run(routes, Router.HistoryLocation, (Root, state) => {
    React.render(<Root {...state}/>, document.body);
});