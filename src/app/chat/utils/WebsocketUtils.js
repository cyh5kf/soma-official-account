import ReconnectingWebSocket from "ReconnectingWebSocket"
import AppConfig from "app/Config"
import Session from "app/Session"
import chatServerActionCreator from "app/chat/actions/ChatServerActionCreator"
import ChatWebAPIUtils from "app/chat/utils/ChatWebAPIUtils"
import log from "loglevel"
import timeHelper from "utils/TimeHelper"

var notResponseTime = 0;

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

var hasInit = false;
var ws = null;

export class WebsocketUtils{

    static initWebSocket(){
        if(!hasInit){
            ws = new ReconnectingWebSocket(AppConfig.webSocketUrl+"?aid="+getCookie("aid")+"&token="+getCookie("token"),null,{debug: true,maxReconnectInterval:3000});
            ws.onmessage = function(event){
                var message = JSON.parse(event.data);
                log.debug("debug message",message)
                if("event" in message){
                    if(message.event === "pong"){
                        notResponseTime = 0;
                        timeHelper.setTimeDifference(message.time-(new Date()).valueOf());
                    }else if(message.event === "kickuser"){
                        log.warn("kickuser",message)
                        ws.close();
                        hasInit = false;
                        chatServerActionCreator.killOutUser();
                    }else if(message.event === "notify"){
                        chatServerActionCreator.receiveMessage(message)
                    }
                }
            }
            var intervalId = null;
            ws.onopen = function(){
                if(!Session.getLogined()){//如果没有登录,就不登录了

                    return;
                }
                var syncSuccessHandler = function(rawConversations){
                    log.debug("syncConversation",rawConversations)
                    rawConversations.forEach(function(conversation) {
                        log.debug("conversation",conversation)
                        for (let key in conversation.msglist) {
                            let message = conversation.msglist[key];
                            chatServerActionCreator.receiveMessage(message);
                        }
                    });
                }
                ChatWebAPIUtils.syncConversation(syncSuccessHandler)
                ChatWebAPIUtils.startservice();

                notResponseTime = 0;
                if(intervalId){
                    clearInterval(intervalId);
                }
                intervalId = setInterval(function(){
                    var sendMessage = {event:"ping","seqid":(new Date()).valueOf()}
                    ws.send(JSON.stringify(sendMessage));
                    notResponseTime++;
                },3000)
                log.debug("ws.onopen intervalId",intervalId)
            }

            ws.onclose = function(){
                log.debug("ws.onclose intervalId",intervalId)
                clearInterval(intervalId);
                notResponseTime = 0;
            }

            setInterval(function(){
                log.debug("check notResponseTime=",notResponseTime)
                if(notResponseTime>=3){
                    ws.refresh();
                }
            },1000)
            hasInit = true;
        }
    }

    static logout(){
        log.info("logout")
        if(ws){
            ws.close();
            hasInit = false;
        }
    }

}
export default WebsocketUtils;
