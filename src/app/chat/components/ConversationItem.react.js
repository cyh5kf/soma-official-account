import React from 'react'
import classNames from 'classnames/bind';

import ConversationStore from "app/chat/stores/ConversationStore"
import ChatServerActionCreator from "app/chat/actions/ChatServerActionCreator"
import TextMessage from "app/chat/components/TextMessage.react"
import {contentTypeMap} from "app/chat/components/MessageBubble.react"
import Lang from "lang/Lang"
import Date from "utils/DateFormatUtils"
import RightInfoPanel from "app/chat/components/RightInfoPanel.react"
import MessagePanelHeader from "app/chat/components/MessagePanelHeader.react"
import log from "loglevel"


var colorMap = {
    "1":"tag-orange",
    "2":"tag-green",
    "3":"tag-blue",
    "4":"tag-pink",
    "5":"tag-red",
    "6":"tag-purple",
    "7":"tag-brown",
    "8":"tag-gray"
}

function getStateFromStores() {
    return {
        currentUid: ConversationStore.getCurrentUid()
    };
}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

export class ConversationItem extends React.Component{
    constructor(props) {
        super(props);
        this.state  = getStateFromStores()
    }

    componentDidMount(){
        ConversationStore.addChangeListener(this._onChange.bind(this));
    }

    componentWillUnmount(){
        ConversationStore.removeChangeListener(this._onChange.bind(this));
    }

    _onChange(){
        this.setState(getStateFromStores());
    }

    //惦记切换对话
    onClickConversation(uid,conv_id){
        ChatServerActionCreator.clickConversation(uid,conv_id)
    }

    static getPreviewMsg(message,isNotify){
        let messageContent = null;
        if(message.msg_type === 1){
            if(message.content_type === 2){//文字消息
                messageContent = message.content;
                if(!isNotify){
                    messageContent =  TextMessage.getTextMessageContent(messageContent);
                }
            }else if(message.content_type === 3 || message.content_type===15){
                messageContent =  Lang.str("app_chat_previewImageMessage")
            }else if(message.content_type === 1){//audio
                messageContent =  Lang.str("app_chat_previewAudioMessage");
            }else if(message.content_type === 27){
                messageContent =  Lang.str("app_chat_previewGeoMessage");
            }else {//其余消息显示内容
                messageContent =  Lang.str("app_chat_messageIsNotSupported")
            }
        }else {//系统消息
            return "";
        }
        return messageContent;
    }

    render(){
        let lastMessage = this.props.conversation.lastMessage;
        let content = ConversationItem.getPreviewMsg(lastMessage);
        content = content.trim().replace(/<br>/g," ");
        let unReadItems = null;
        if(this.props.unreadCount != 0){
            let styles = null;
            if(this.props.unreadCount>9){
                styles = {padding:"0 3px"};
            }
            unReadItems =  <i className="list-msgnum" style={styles} >{this.props.unreadCount}</i>
        }
        let tagHtml = null;
        if(this.props.conversation.somaUser && this.props.conversation.somaUser.tag){
            let tagClassName = "list-level "+colorMap[this.props.conversation.somaUser.tag.color];
            tagHtml = <em className={tagClassName}>{RightInfoPanel.getPreviewTag(this.props.conversation.somaUser.tag.name,15)}</em>
        }
        let avatar = MessagePanelHeader.getAvatar(this.props.conversation.somaUser.avatar);
        return (
            <li className="conversationItem" onClick={this.onClickConversation.bind(this,this.props.uid,this.props.conversation.conv_id)}>
                <div className={classNames({
                    'li-cont': true,
                    'unread':this.props.unreadCount != 0,
                    'current-conversation':this.state.currentUid == this.props.conversation.somaUser.uid
                })}>
                    <img src={avatar}/>
                    <div className={classNames({"li-cont-detail":true,"li-cont-detail-unread":this.props.unreadCount!=0})}>
                        <span className="list-name">{this.props.conversation.somaUser.name}</span>
                        {tagHtml}
                        <div className="converstaion-item-right">
                            <div><span className="converstaion-time">{formatAMPM(new Date(lastMessage.msg_time))}</span></div>
                        </div>
                        <p  dangerouslySetInnerHTML={{__html: content}}></p>
                        {this.props.isSelf?null:<span className="collegue-name">{this.props.conversation.csAgent.name}</span>}
                        {unReadItems}
                    </div>
                </div>
            </li>
        );
    }
}

ConversationItem.propTypes = {
    conversation:React.PropTypes.object
}


export default ConversationItem