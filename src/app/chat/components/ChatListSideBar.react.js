import React from 'react'

import ConversationStore from "app/chat/stores/ConversationStore"
import UnreadConversationStore from "app/chat/stores/UnreadConversationStore"
import ConversationItem from "app/chat/components/ConversationItem.react"
import classNames from 'classnames/bind';
import ChatServerActionCreator from "app/chat/actions/ChatServerActionCreator"
import Lang from "lang/Lang"
import Session from "app/Session"
import Const from "app/Const"
import log from "loglevel"





function getStateFromStores() {
    return {
        selfPanel: ConversationStore.selfPanel(),
        conversations:ConversationStore.getAll(),
        unreadConversations:UnreadConversationStore.getUnreadConversations()
    };
}

export class ChatListSideBar extends React.Component{
    constructor(props) {
        super(props);
        this.state  = getStateFromStores()
    }

    componentDidMount(){
        console.log("ChatListSideBar componentDidMount")
        ConversationStore.addChangeListener(this._onChange.bind(this));
        UnreadConversationStore.addChangeListener(this._onChange.bind(this));
        if(ConversationStore.getCurrentConversation()){
            ChatServerActionCreator.clickConversation(ConversationStore.getCurrentUid(),ConversationStore.getCurrentConversation().conv_id);
        }
    }

    componentDidUpdate(){

    }

    componentWillUnmount(){
        ConversationStore.removeChangeListener(this._onChange.bind(this));
        UnreadConversationStore.removeChangeListener(this._onChange.bind(this));
    }


    _onChange(){
        this.setState(getStateFromStores());
    }


    onClickCollege(){
        let role = Session.getRole();
        if(role == Const.ROLE.NORMAL){
            return;
        }
        ChatServerActionCreator.clickChangePanel();
    }

    render(){
        var selfConversationItems = [];
        var colleagueConversationItems = [];

        if(Object.keys(this.state.conversations).length != 0){
            let conversations = this.state.conversations;
            for (var key in conversations) {
                if (conversations.hasOwnProperty(key) ) {
                    if(conversations[key].state && conversations[key].state==="close"){
                        continue;
                    }
                    let uid = conversations[key].uid;
                    let unreadCount = 0;
                    if(uid in this.state.unreadConversations){
                        unreadCount = this.state.unreadConversations[uid]
                    }
                    let conversationKey = "conversationItem_" + uid;
                    if(conversations[key].aid+"" === Session.getAid()){
                        let conversationItem = {conversation:<ConversationItem key={conversationKey} conversation={conversations[key]} hide="true" isSelf={true} unreadCount={unreadCount} uid={uid}></ConversationItem>,
                        startTime:conversations[key].startTime}
                        selfConversationItems.push(
                            conversationItem
                        );
                    }else {
                        let conversationItem = {conversation:<ConversationItem key={conversationKey} conversation={conversations[key]} hide="true" isSelf={false} unreadCount={unreadCount} uid={uid} hide={false}></ConversationItem>,
                            startTime:conversations[key].startTime}
                            colleagueConversationItems.push(
                                conversationItem
                        );
                    }
                }
            }
        }


        selfConversationItems.sort(function(a,b){
                let aStartTime = a.startTime;
                let bStartTime = b.startTime;
                return aStartTime<bStartTime?1:((aStartTime===bStartTime)?0:-1);
            });
        selfConversationItems = selfConversationItems.map(function(c){
            return c.conversation;
        });
        colleagueConversationItems.sort(function(a,b){
            let aStartTime = a.startTime;
            let bStartTime = b.startTime;
            return aStartTime<bStartTime?1:((aStartTime===bStartTime)?0:-1);
        });

        colleagueConversationItems = colleagueConversationItems.map(function(c){
            return c.conversation;
        });


        if(selfConversationItems.length ===0){
            let key = "self_chatting-empty-status";
            selfConversationItems.push((<li key={key} className="chatting-empty-status">
                <div className="empty-text">{Lang.str("app_chat_DontHaveAnyConversation")}</div></li>));
        }

        if(colleagueConversationItems.length === 0){
            let key = "colleague_chatting-empty-status";
            colleagueConversationItems.push(<li key={key} className="chatting-empty-status">
                <div className="empty-text">{Lang.str("app_chat_ThereIsNoColleagueConversation")}</div></li>
            );
        }

        let role = Session.getRole();
        let myListStyle = {"box-sizing": "border-box"};
        if(role == Const.ROLE.NORMAL){
            myListStyle = {"box-sizing": "border-box","padding-bottom":"60px"};
        }
        return (
            <div className="chatting-peoList">
                <div className={classNames({
                            'chatting-collapse-group': true,
                            'closed': !this.state.selfPanel
                        })} >
                    <div className={classNames({"mylisthd":true,"showCollegue":role != Const.ROLE.NORMAL})} onClick={this.onClickCollege.bind(this)}>
                        <h3 className="list-tit">{Lang.str("app_chat_MyConversation")}</h3>
                    </div>
                    <div className="mylistbd" style={myListStyle}>
                        <ul>
                            {selfConversationItems}
                        </ul>
                    </div>
                </div>
                {role == Const.ROLE.NORMAL?"":<div className="chatting-collapse-group" >
                    <div className="collapsehd" onClick={this.onClickCollege.bind(this)}>
                        <h3 className="list-tit-others" >{Lang.str("app_chat_ConversationsOfOtherColleagues")}</h3>
                    </div>
                    <div className="mylistbd">
                        <ul>
                            {colleagueConversationItems}
                        </ul>
                    </div>
                </div>}
            </div>
        );
    }
}

export default ChatListSideBar