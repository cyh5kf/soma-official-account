import ConversationItem from "app/chat/components/ConversationItem.react"
import Session from "app/Session"
import ChatServerActionCreator from "app/chat/actions/ChatServerActionCreator"
import log from "loglevel"



var currentNotification = null;
var timeoutInterval = null;

var isActive = true;

window.onfocus = function () {
    isActive = true;
};

window.onblur = function () {
    isActive = false;
};



export class MessageNotify{
    static messageNotify(message) {
        if (!("Notification" in window)) {
            return;//浏览器不支持
        }
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            MessageNotify.spawnNotification(message);
        }

        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    MessageNotify.spawnNotification(message);
                }
            });
        }

        // At last, if the user has denied notifications, and you
        // want to be respectful there is no need to bother them any more.
    }
    static spawnNotification(message) {
        if((!message.from_nickname) || (message.msg_type !== 1) || (isActive) || ((message.aid+"") !== Session.getAid()) || (!message.from_soma)){
            return;
        }

        log.debug("spawnNotification",message)

        var theBody = ConversationItem.getPreviewMsg(message,true),
            theIcon = message.from_avatar,
            theTitle = message.from_nickname;
        if(!theIcon){
            theIcon = require("static/images/common/head_sculpture.png");
        }
        if(currentNotification){
            currentNotification.close();
        }
        clearInterval(timeoutInterval);
        var options = {
            body: theBody,
            icon: theIcon
        }
        currentNotification = new Notification(theTitle,options);
        currentNotification.uid = message.uid;
        currentNotification.onclick = function(event){
            window.focus();
            if(currentNotification){
                currentNotification.close();
            }
            clearInterval(timeoutInterval);
            ChatServerActionCreator.transitionToChatPage();
            setTimeout(ChatServerActionCreator.clickConversation(event.target.uid,message.conv_id),500);
        }
        timeoutInterval = setTimeout(function(){
            if(currentNotification != null){
                currentNotification.close();
            }
        },5000)
    }
}


export default MessageNotify;