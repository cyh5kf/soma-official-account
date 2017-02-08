import React from 'react'
import ConversationStore from "app/chat/stores/ConversationStore"
import session from "app/Session"
import ChatServerActionCreator from "app/chat/actions/ChatServerActionCreator"
import ChatWebAPIUtils from "app/chat/utils/ChatWebAPIUtils"
import $ from "jquery"
import PullRight from "app/chat/components/PullRight.react"
import Lang from "lang/Lang"
import Session from "app/Session"
import Const from "app/Const"
import classNames from 'classnames/bind';








export class MessagePanelHeader extends React.Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){
    }

    componentWillUnmount(){
    }

    isFromHistory(){
        return this.props.conversation && this.props.conversation.msglist
    }

    static getAvatar(originAvatarUrl){
        if(!originAvatarUrl){
            return require("static/images/common/head_sculpture.png");
        }else {
            return MessagePanelHeader.getPreviewAvatar(originAvatarUrl);
        }
    }

    static getPreviewAvatar(avatar){
        let index = avatar.replace(/\.[^/.]+$/, "").length;
        let suffix = avatar.substr(index,avatar.length);
        let prefix = avatar.substr(0,index) + "_60";
        return prefix + suffix;
    }

    /**
     * 表示这个conversation是从history页面传过来,使用这边msgList
     * @returns {*}
     */
    isFromHistory(){
        return this.props.conversation && this.props.conversation.msglist
    }

    render(){
        var role = Session.getRole();
        let avatar = MessagePanelHeader.getAvatar(this.props.conversation.somaUser.avatar);
        let onLineElement = null;
        if(!this.isFromHistory()){
            onLineElement = <div className="hdl-info-status">
                <i></i>
                <span>{Lang.str("app_chat_OnlineStatus")}</span>
            </div>
        }
        return (
            <div className="chatting-holder-header">
                <div className="hdl">
                    <img src={avatar}/>
                    <div className={classNames({"hdl-info":true,"history":this.isFromHistory()})}>
                        <span>{this.props.conversation.somaUser.name}</span>
                        {onLineElement}
                    </div>
                </div>
                {((this.props.conversation.aid == session.getAid()||(role == Const.ROLE.SUPER || role == Const.ROLE.ADMIN))
                    && (!this.isFromHistory()))?<PullRight conversation={this.props.conversation}></PullRight>:null}
            </div>
        );
    }
}

export default MessagePanelHeader;