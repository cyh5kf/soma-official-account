import $ from 'jquery';
import Lang from 'lang/Lang'

var untils = {};

// 监测整个页面的click事件，如果事件源是数组中的值，那么将不会执行fn方法
(function () {
    var runFn = function (e, arr, fn) {
        var target = e.target;
        var end = false;
        for (var i in arr) {
            $(arr[i]).each(function () {
                if ($(this)[0] == target) {
                    end = true;
                    return false;
                }
            })
            if (end)
                return;
        }
        if (fn)
            fn();
    };

    untils.documentClick = function (arr, fn) {
        var Browser = untils.BROWSER;
        if (Browser.isAndorid || Browser.isiOS)
            document.addEventListener('touchend', function (e) {
                runFn(e, arr, fn);
            }, false);
        else
            document.addEventListener('mousedown', function (e) {
                runFn(e, arr, fn);
            });
    };

}).call(this);


// browser
(function () {
  var ua = navigator.userAgent.toLowerCase();
  untils.BROWSER = {
    isAndorid: ua.indexOf("android") != -1 ? 1 : 0,
    isiOS: !!ua.match(/\(i[^;]+;( u;)? cpu.+mac os x/),
    isiPhone: ua.indexOf('iphone') > -1 || ua.indexOf('mac') > -1,
    isiPad: ua.indexOf('ipad') > -1,

    isWeChat: ua.indexOf("micromessenger") != -1 ? 1 : 0
  }
}).call(this);

(function () {
    $.extend({
        messageBox : function(options) {
            var dfop={
                message: false,
                level: "success",
                speed: 500,
                life:1000
            };
            $.extend(dfop, options);
            if(options=='close'){
                $("#jGrowl").removeAttr("style").empty();
                return false;
            }
            if(!$("#jGrowl")[0]){
                $("body").append("<div id='jGrowl'></div>");
            }else{
                $("#jGrowl").removeAttr("style").empty();
            }
            dfop.message='<div class="'+dfop.level+'"><span></span>'+dfop.message+'</div>';
            $("#jGrowl").addClass("jGrowl").append(dfop.message).animate({top:"49%"},dfop.speed);
            function hideMessageBox(){
                clearTimeout(window._messageBox);
                window._messageBox=setTimeout(function(){
                    $("#jGrowl").remove();
                },dfop.life);
            }
            hideMessageBox();
            $("#jGrowl").hover(function(){
                clearTimeout(window._messageBox);
            },function(){
                hideMessageBox();
            });
        },

        loadding : function(message) {
            /**
            var disMsg = message?message:Lang.str("app_article_loading");
            if(!$("#__loaddingMask").is("div")){
                $("body").append("<div id='__loaddingMask'><img src='"+require("static/images/common/loading.gif")+"'/><div class='hintMsg'>"+disMsg+"</div></div>");
            }
            $("#__loaddingMask").removeClass("hidden");
            $("#__loaddingMask>.hintMsg").html(disMsg);
            **/
        },

        loaded : function(options) {
            //$("#__loaddingMask").addClass("hidden");
        }
    });
}).call(this);


untils.txt2html = function (txt) {
    var html, txt_list, _i, _len;
    txt_list = txt.split('\n');
    html = '';
    for (_i = 0, _len = txt_list.length; _i < _len; _i++)
        html += "<p>" + txt_list[_i] + "</p>";
    return html;
};

untils.confirmDialogue = function(info, fn){
    return function(e){
        if (confirm(info))
            if(typeof fn == typeof Function) fn();
        else
            e.preventDefault();
    }
}

untils.shallowEqual = function (obj, anotherOne) {
    if (anotherOne == obj)
        return true;
    if (typeof (obj) == "undefined" || obj == null || typeof (obj) != "object")
        return false;
    var length = 0; var length1 = 0;
    for (var ele in anotherOne) {
        length++;
    }
    for (var ele in obj) {
        length1++;
    }
    if (length != length1)
        return false;
    if (obj.constructor == anotherOne.constructor) {
        for (var ele in anotherOne) {
            if (typeof (anotherOne[ele]) == "object") {
                if (!untils.shallowEqual(obj[ele], anotherOne[ele]))
                    return false;
            }
            else if (typeof (anotherOne[ele]) == "function") {
                if (!untils.shallowEqual(obj[ele].toString(),anotherOne[ele].toString()))
                    return false;
            }
            else if (anotherOne[ele] != obj[ele])
                return false;
        }
        return true;
    }
    return false;
};

untils.byteLength = function (str) {
    // returns the byte length of an utf8 string
    var s = str.length;
    for (var i=str.length-1; i>=0; i--) {
        var code = str.charCodeAt(i);
        if (code > 0x7f && code <= 0x7ff) s++;
        else if (code > 0x7ff && code <= 0xffff) s+=2;
        if (code >= 0xDC00 && code <= 0xDFFF) i--; //trail surrogate
    }
    return s;
}

untils.cutString = function (str,targetLength) {
    let result = "";
    if(untils.byteLength(str)>targetLength){
        targetLength = targetLength-2;
        for(let i=0;i<str.length && targetLength>0;i++){
            var char = str[i];
            var code = str.charCodeAt(i);
            if(code <= 0x7f){
                result = result + char;
                targetLength = targetLength-1;
            }else if (code > 0x7f && code <= 0x7ff) {
                result = result + char;
                targetLength = targetLength-2;
            } else if (code > 0x7ff && code <= 0xffff){
                result = result + char;
                targetLength = targetLength-3;
            }
            if (code >= 0xDC00 && code <= 0xDFFF) targetLength = targetLength+1; //trail surrogate
        }
        return (result + "...");
    }else {
        return str;
    }
}


exports.documentClick = untils.documentClick;
exports.BROWSER = untils.BROWSER;
exports.txt2html = untils.txt2html;
exports.confirmDialogue = untils.confirmDialogue;
exports.shallowEqual = untils.shallowEqual;
exports.byteLength = untils.byteLength;
exports.cutString = untils.cutString;