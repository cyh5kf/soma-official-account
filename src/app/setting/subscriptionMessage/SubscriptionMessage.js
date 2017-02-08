import React from 'react'
import $ from 'jquery'
import Lang from "lang/Lang"

export class SubscriptionMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount(){
        $("input[name = newFollowerMessageSwitch]").click(function(){
            var scriptionMessageSend = {};
            if($("input[name = newFollowerMessageSwitch]").is(':checked')){
                scriptionMessageSend.new_follower_message_on =true;
                $(".subscriptionMessageWrap").addClass("selected_bdcolor");
            }else{
                scriptionMessageSend.new_follower_message_on =false;
                $(".subscriptionMessageWrap").removeClass("selected_bdcolor");
            }
            $.messageBox({message:Lang.str('app_setting_systemAutoReply_ChangeSaved'),level: "success"});
            scriptionMessageSend.new_follower_message = $(".messageContentWrap").attr("data-message");
            $.ajax({
                url: '/api/v1/official/account/submsg',
                type: 'PUT',
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                data:JSON.stringify(scriptionMessageSend),
                async: true,
                success: function (cont, txtStatus, xhr) {
                    if (xhr.status != 200) {
                        return false;
                    }

                }
            })
        });

        $(".subscriptionMessageWrap .save").click(function(){
            var scriptionMessageSend = {};
            if($("input[name = newFollowerMessageSwitch]").is(':checked')){
                scriptionMessageSend.new_follower_message_on =true;
            }else{
                scriptionMessageSend.new_follower_message_on =false;
            }
            var content = $(".messageContentWrap textarea").val();
            content = content.trim();
            scriptionMessageSend.new_follower_message = content;
            $.ajax({
                url: '/api/v1/official/account/submsg',
                type: 'PUT',
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                data:JSON.stringify(scriptionMessageSend),
                async: true,
                success: function (cont, txtStatus, xhr) {
                    if (xhr.status != 200) {
                        return false;
                    }

                    $.messageBox({message:Lang.str('app_setting_systemAutoReply_ChangeSaved'),level: "success"});

                }
            })

            $(".messageContentWrap textarea").remove();
            var message="";
            message+='<div class="scriptionMessage selected_message_bgcolor" contenteditable="false">'+content+'</div>';
            $(".messageContentWrap").append(message);
            $(".messageContentWrap").attr("data-message",content);
            $(".subscriptionMessageWrap .save").addClass("hidden");
            $(".subscriptionMessageWrap .cancel").addClass("hidden");
            $(".subscriptionMessageWrap .modify").removeClass("hidden");
        });


        var messageContent = function(){
            $.ajax({
                url: '/api/v1/official/account',
                type: 'GET',
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                async: false,
                success: function (cont, txtStatus, xhr) {
                    if(xhr.status!=200){
                        return false;
                    }
                    var data=xhr.responseJSON;
                    var message="";
                    message+='<div class="scriptionMessage selected_message_bgcolor" contenteditable="false">'+data.new_follower_message+'</div>'
                    $(".messageContentWrap").append(message);
                    if(data.new_follower_message_on){
                        $("input[name = newFollowerMessageSwitch]").attr("checked", true);
                        $(".subscriptionMessageWrap").addClass("selected_bdcolor");

                    } else {
                        $("input[name = newFollowerMessageSwitch]").attr("checked",false);
                    }
                }
            })
            var content = $(".scriptionMessage").text();
            $(".messageContentWrap").attr("data-message",content);
        }
        messageContent();

        //textarea高度自适应方法
        var autoTextarea = function (elem, extra, maxHeight) {
            extra = extra || 0;
            var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
                isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
                addEvent = function (type, callback) {
                    elem.addEventListener ?
                        elem.addEventListener(type, callback, false) :
                        elem.attachEvent('on' + type, callback);
                },
                getStyle = elem.currentStyle ? function (name) {
                    var val = elem.currentStyle[name];

                    if (name === 'height' && val.search(/px/i) !== 1) {
                        var rect = elem.getBoundingClientRect();
                        return rect.bottom - rect.top -
                            parseFloat(getStyle('paddingTop')) -
                            parseFloat(getStyle('paddingBottom')) + 'px';
                    };

                    return val;
                } : function (name) {
                    return getComputedStyle(elem, null)[name];
                },
                minHeight = parseFloat(getStyle('height'));


            elem.style.resize = 'none';

            var change = function () {
                var scrollTop, height,
                    padding = 0,
                    style = elem.style;

                if (elem._length === elem.value.length) return;
                elem._length = elem.value.length;

                if (!isFirefox && !isOpera) {
                    padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
                };
                scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

                elem.style.height = minHeight + 'px';
                if (elem.scrollHeight > minHeight) {
                    if (maxHeight && elem.scrollHeight > maxHeight) {
                        height = maxHeight - padding;
                        style.overflowY = 'auto';
                    } else {
                        height = elem.scrollHeight - padding;
                        style.overflowY = 'hidden';
                    };
                    style.height = height + extra + 'px';
                    scrollTop += parseInt(style.height) - elem.currHeight;
                    document.body.scrollTop = scrollTop;
                    document.documentElement.scrollTop = scrollTop;
                    elem.currHeight = parseInt(style.height);
                };
            };

            addEvent('propertychange', change);
            addEvent('input', change);
            addEvent('focus', change);
            change();
        };

        $(".subscriptionMessageWrap .cancel").click(function(){
            $(".subscriptionMessageWrap textarea").remove();
             var content = $(".messageContentWrap").attr("data-message");
            var message="";
            message+='<div class="scriptionMessage selected_message_bgcolor" contenteditable="false">'+content+'</div>';
            $(".messageContentWrap").append(message);
            $(".subscriptionMessageWrap .save").addClass("hidden");
            $(".subscriptionMessageWrap .cancel").addClass("hidden");
            $(".subscriptionMessageWrap .modify").removeClass("hidden");
        });


        $(".subscriptionMessageWrap").on('click','.modify',function() {
            var content = $(".scriptionMessage").text();
            var textArea = '<textarea id="textArea">'+content+'</textarea>';
            $(".messageContentWrap").attr("data-message",content);
            $(".scriptionMessage").remove();
            $(".messageContentWrap").append(textArea);
            $(".subscriptionMessageWrap .modify").addClass("hidden");
            $(".subscriptionMessageWrap .save").removeClass("hidden");
            $(".subscriptionMessageWrap .cancel").removeClass("hidden");

            var text = document.getElementById("textArea");
            autoTextarea(text);// 调用

        });

    }

    render() {
        return (
            <div className="publicAccount pl40">
                <div className="subscriptionMessageWrap clearfix">
                    <input name="newFollowerMessageSwitch" type="checkbox" />
                    <span>{Lang.str('app_setting_SubscriptionMessage_NewFollowerMsg')}</span>
                    <i>{Lang.str('app_setting_SubscriptionMessage_NewFollowNote')}</i>
                    <div className="messageContentWrap">
                        <button className="modify"></button>
                        <button className="save  hidden"></button>
                        <button className="cancel hidden"></button>
                    </div>
                </div>

            </div>
        );
    }
}

export default SubscriptionMessage;