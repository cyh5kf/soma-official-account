import React from 'react'
import ConversationStore from "app/chat/stores/ConversationStore"
import session from "app/Session"
import ChatServerActionCreator from "app/chat/actions/ChatServerActionCreator"
import ChatWebAPIUtils from "app/chat/utils/ChatWebAPIUtils"
import TransferConversation from "app/chat/components/TransferConversation.react"
import $ from "jquery"
import ChattingPullRightHover from "app/chat/components/ChattingPullRightHover.react"
import Lang from "lang/Lang"




export class PullRight extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            showPopup:false,
            groups:[],
            showAgent:false,
            agentList:[],
            isShowTransfer:false,
            isShowClose:false
        }
    }

    clickDocument(event){
        if($(event.target).hasClass('accordion') || $(event.target).parents(".accordion").size()){
            return ;
        }
        this.state.showPopup = false;
        this.state.showAgent = false;
        this.setState(this.state);
        $(document).unbind('click', this.clickDocument);
    }


    onRedirectChat(){
        let that = this;
        if(!this.state.showPopup){
            var successHandler = function(data){
                that.state.groups = data;
                that.state.showPopup = true;
                that.setState(that.state);
                $(document).bind('click', that.clickDocument.bind(that));
            }
            ChatWebAPIUtils.getActiveAgentList(successHandler)
        }
    }


    onEndChat(){
        ChatServerActionCreator.endChat(this.props.conversation.uid);
    }

    onTransferConversation(agent,conversation){
        let uid = ConversationStore.getCurrentUid();
        var successHandler = function(cont, txtStatus, xhr){
            if(xhr.status === 200){
                ChatServerActionCreator.transferConversationSuccess(conversation.uid,agent);
            }else {
                ChatServerActionCreator.transferConversationFailed();
            }
        }
        ChatWebAPIUtils.transferConversation(uid,agent.aid,successHandler);
        this.state.showPopup = false;
        this.setState(this.state);
    }

    onMouseTransfer(type,action){
        if(type === "transfer"){
            if(action === "leave"){
                this.state.isShowTransfer = false;
            }else {
                this.state.isShowTransfer = true;
            }
        }else {
            if(action === "leave"){
                this.state.isShowClose = false;
            }else {
                this.state.isShowClose = true;
            }
        }

        this.setState(this.state);
    }


    render(){
        return (<div className="hdr">
            {(!this.props.conversation.state || !(this.props.conversation.state === "close" || this.props.conversation.state === "unreadClose"))?<span className="hdr-reply"
                                                                                                    onMouseLeave={this.onMouseTransfer.bind(this,"transfer","leave")} onMouseOver={this.onMouseTransfer.bind(this,"transfer","over")} onClick={this.onRedirectChat.bind(this)}></span>:null}
            <span className="hdr-close" onMouseLeave={this.onMouseTransfer.bind(this,"close","leave")} onMouseOver={this.onMouseTransfer.bind(this,"close","over")}  onClick={this.onEndChat.bind(this)}></span>
            <TransferConversation conversation={this.props.conversation} showPopup={this.state.showPopup} groups={this.state.groups} onTransferConversation={this.onTransferConversation.bind(this)} ></TransferConversation>
            {this.state.isShowTransfer?<ChattingPullRightHover text={Lang.str("app_chat_TransferConversation")} type="transfer" ></ChattingPullRightHover>:null}
            {this.state.isShowClose?<ChattingPullRightHover text={Lang.str("app_chat_CloseConversation")} type="close" ></ChattingPullRightHover>:null}
        </div>);
    }
}

export default PullRight;