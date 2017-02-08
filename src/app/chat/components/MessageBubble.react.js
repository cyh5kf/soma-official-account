import React from 'react'
import ChatConstants from 'app/chat/constants/ChatConstants'
import classNames from 'classnames/bind';
import ChatServerActionCreator from "app/chat/actions/ChatServerActionCreator"
import AudioMessage from "app/chat/components/AudioMessage.react"
import TextMessage from "app/chat/components/TextMessage.react"
import linkify from "linkifyjs"
import emoji from "js-emoji"
import Lang from "lang/Lang"
import GeoMessage from "app/chat/components/GeoMessage.react"
import Session from "app/Session"
import ImageMessage from "app/chat/components/ImageMessage.react"
import SystemMessageBubble from "app/chat/components/SystemMessageBubble.react"



var MessageSentStatus = ChatConstants.MessageSentStatus;


export var contentTypeMap = {
    1:()=>Lang.str("app_chat_UserStartsAConversation"),
    2:(fromAgent,toAgent)=>Lang.str("app_chat_UserTransferAConversation",fromAgent,toAgent),
    3:(endOperatorName)=>Lang.str("app_chat_EndConversation_notice",endOperatorName),
    6:()=>Lang.str("app_chat_ConversationIsTimeOutSystemEndConversation")
}

export class MessageBubble extends React.Component{
    constructor(props) {
        super(props);
        this.state = {}
    }

    resendFailedMessage(message,status){
        if(status === MessageSentStatus.FAILED){
            ChatServerActionCreator.resendFailedMessage(message)
        }
    }

    getTextMessageContent(messageContent){
        emoji.img_path='https://github.com/github/gemoji/tree/master/images/emoji/unicode';
        return emoji.replace_unified(linkify(messageContent));
    }


    formatAMPM(date) {
        var month = date.getMonth()+1<10?"0"+(date.getMonth()+1):(date.getMonth()+1);
        var day = date.getDate()<10?"0"+date.getDate():date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = month+"-"+day +" " + hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    render(){
        let retHtml = "";
        let msgStatusHtml = <span onClick={this.resendFailedMessage.bind(this,this.props.message,this.props.message.status)} className= {classNames( {"chatting-msg-status":true,
        "chatting-msg-status-loading":this.props.message.status === MessageSentStatus.SENDING,
        "chatting-msg-status-failed":this.props.message.status === MessageSentStatus.FAILED
        })}></span>
        let horner = <div className="horn"></div>
        if(this.props.message.msg_type==1){//普通消息
            let messageContent = null;
            if(this.props.message.content_type === 2){//文字消息
                let textContent =  <TextMessage message={this.props.message}></TextMessage>
                messageContent =  (<div className="bubble" title="">
                        {textContent}
                        {msgStatusHtml}
                        {horner}
                         </div>);
            }else if(this.props.message.content_type === 3 || this.props.message.content_type===15){
                messageContent =  <ImageMessage message={this.props.message}></ImageMessage>
            }else if(this.props.message.content_type === 1){//audio
                let audioSrc = JSON.parse(this.props.message.content);
                messageContent =  <AudioMessage audioObj={audioSrc} ></AudioMessage>
            }else if(this.props.message.content_type === 27){//geo message
                let geoMessage = JSON.parse(this.props.message.content);
                messageContent = <GeoMessage geoMessage={geoMessage}></GeoMessage>
            }else {//其余消息显示内容
                messageContent =<div className="bubble" title="">
                    <div className="text" ><span className="unsupport-msg" ></span>
                        {Lang.str("app_chat_messageIsNotSupported")}
                </div></div>
            }


            let timeItem = this.formatAMPM(new Date(this.props.message.msg_time));
            if(!this.props.isFromSoma){
                if((this.props.message.aid  + ""=== Session.getAid()) ||(this.props.message.aid==0)){
                    timeItem = timeItem + " "+Lang.str("app_chat_Me");
                }else {
                    timeItem = timeItem + " " + this.props.message.from_nickname;
                }
            }

            return <div className={classNames({'msg-agent': !this.isMessageClient(this.props.isFromSoma),
                            'msg-client':this.isMessageClient(this.props.isFromSoma),"chatting-message":true})}>
                <div className="time-sender">
                    <span className="time">{timeItem}</span>
                </div>
                {messageContent}
            </div>
        }else if(this.props.message.msg_type === 0){//系统消息

            retHtml = (
                <SystemMessageBubble message={this.props.message}></SystemMessageBubble>);
        }
        return retHtml;
    }

    isMessageClient(fromSoma){
        return fromSoma>0;
    }
}


export default MessageBubble;