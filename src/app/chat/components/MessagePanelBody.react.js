import React from "react";
import MessageStore from "app/chat/stores/MessageStore";
import ConversationStore from "app/chat/stores/ConversationStore";
import MessageBubble from "app/chat/components/MessageBubble.react";
import ChatServerActionCreator from "app/chat/actions/ChatServerActionCreator";
import $ from "jquery";
import ChatWebAPIUtils from "app/chat/utils/ChatWebAPIUtils";
import Lang from "lang/Lang";
import log from "loglevel"


function getStateFromStores() {
    return {
        messages: MessageStore.getMessagesForCurrentConversation(),
        showLoadingMore:ConversationStore.showLoadingMoreForCurrentConversation(),
    };
}



export class MessagePanelBody extends React.Component {
    constructor(props) {
        super(props);
        if(this.isFromHistory()){
            this.state = {
                messages:this.props.conversation.msglist,
                showLoadingMore:true,
                conv_id:this.props.conversation.msglist[0].conv_id,
                showBottomLoadingMore:true,
                scrollDirection:"top"
            }
        }else {
            this.state = getStateFromStores();
        }
    }

    componentDidMount() {
        console.log("componentDidMount")
        ConversationStore.addChangeListener(this._onChange.bind(this));
        MessageStore.addChangeListener(this._onChange.bind(this));
        let that = this;
        that.height = $(".chatting-holder-body").height();
        var scrollCallBack = function(){
            if(($(".chatting-holder-body").scrollTop() <= 10) && (!that.state.scrollTopEnd)){
                that.state.scrollDirection = "top";
                that.height = $(".chatting-holder-body").height();
                if(!$(".chatting-holder-body")[0]){
                    return;
                }
                that.state.originalScrollHeight = $(".chatting-holder-body")[0].scrollHeight;
                that.state.originalScrollTop = $(".chatting-holder-body")[0].scrollTop;
                if(!that.state.showLoadingMore){
                    let firstMessage = that.state.messages[0];
                    if(that.isFromHistory()){
                        var successCallBack = function(receivedMessage){
                            if(receivedMessage.length == 0){
                                that.state.scrollTopEnd = true;
                            }else {
                                that.state.messages = that.state.messages.concat(receivedMessage);
                                that.state.messages.sort(function(a,b){
                                    return a.msg_time-b.msg_time;
                                });
                                that.state.showLoadingMore = false;
                                that.state.scrollTopEnd = false;
                                MessageStore.shouldScroll = true;
                                that.setState(that.state)
                            }
                        }
                        ChatWebAPIUtils.getMoreMessage(firstMessage.uid,firstMessage.msg_time,successCallBack)
                    }else {

                        ChatServerActionCreator.clickLoadMoreMessage(firstMessage.uid,firstMessage.msg_time,that)
                    }
                }
            }

            if(that.isFromHistory() && ($(".chatting-holder-body").scrollTop() + that.height == $(".chatting-holder-body")[0].scrollHeight) && (!that.state.scollBottomEnd) && (!that.state.showBottomLoadingMore)){
                log.debug("bottombottombottom")
                that.state.scrollDirection = "bottom";
                let lastMessage = that.state.messages[that.state.messages.length - 1];
                var successCallBack = function(receivedMessage){
                    if(receivedMessage.length != 0){
                        that.state.messages = that.state.messages.concat(receivedMessage);
                        that.state.messages.sort(function(a,b){
                            return a.msg_time-b.msg_time;
                        });
                        that.state.showBottomLoadingMore = false;
                        that.setState(that.state)
                    }else {
                        that.state.scollBottomEnd = true;
                    }
                }
                ChatWebAPIUtils.getBottomMoreMessage(lastMessage.uid,lastMessage.msg_time,successCallBack)
            }
        };
        $(".chatting-holder-body").scroll(scrollCallBack);
        this.scrollAfterUpdate();
    }

    /**
     * 表示这个conversation是从history页面传过来,使用这边msgList
     * @returns {*}
     */
    isFromHistory(){
       return this.props.conversation && this.props.conversation.msglist
    }

    componentWillUnmount() {
        console.log("MessagePanelBody componentWillUnmount")
        ConversationStore.resetShowMore();
        ConversationStore.removeChangeListener(this._onChange.bind(this));
        MessageStore.removeChangeListener(this._onChange.bind(this));
    }

    componentWillUpdate(){

    }

    componentWillReceiveProps(nextProps){
        console.log("componentWillReceiveProps")
        if(this.isFromHistory()){
            if(this.state.conv_id != nextProps.conversation.msglist[0].conv_id){//changed
                this.state = {
                    messages:nextProps.conversation.msglist,
                    showLoadingMore:true,
                    conv_id:nextProps.conversation.conv_id,
                    showBottomLoadingMore:true,
                };
            }
        }
    }

    scrollAfterUpdate(){
        if(MessageStore.shouldScroll){
            if(MessageStore.shouldScrollBottom && !this.isFromHistory()){
                if(MessageStore.isOwnConversation){
                    this._scrollToBottom();
                }
            }else {
                if(this.state.scrollDirection === "top"){
                    if(!this.state.scrollTopEnd){
                        let toScrollTop =this.state.originalScrollTop+($(".chatting-holder-body")[0].scrollHeight-this.state.originalScrollHeight);
                        $(".chatting-holder-body").scrollTop(toScrollTop);
                    }
                    this.state.scrollDirection = "bottom";
                }
            }
            MessageStore.shouldScroll = false;
        }
    }
    componentDidUpdate(){
        this.scrollAfterUpdate();
    }

    _scrollToBottom(){
        $(".chatting-holder-body").scrollTop($(".chatting-holder-body")[0].scrollHeight);
    }

    _onChange() {
        if(!this.isFromHistory()){
            this.setState(getStateFromStores());
        }
    }

    onClickMore(){
        let that = this;
        let firstMessage = this.state.messages[0];
        this.state.originalScrollHeight = $(".chatting-holder-body")[0].scrollHeight;
        this.state.originalScrollTop = $(".chatting-holder-body")[0].scrollTop;
        if(this.isFromHistory()){
            var successCallBack = function(receivedMessage){
                if(receivedMessage.length === 0){
                    that.state.scrollTopEnd = true;
                }else {
                    that.state.messages = that.state.messages.concat(receivedMessage);
                    that.state.messages.sort(function(a,b){
                        return a.msg_time-b.msg_time;
                    });
                    that.state.scrollDirection = "top";
                    that.state.showLoadingMore = false;
                    MessageStore.shouldScroll = true;
                    that.setState(that.state);
                }
            }
            ChatWebAPIUtils.getMoreMessage(firstMessage.uid,firstMessage.msg_time,successCallBack,20)
        }else {//正常聊天页面scroll
            ChatServerActionCreator.clickLoadMoreMessage(firstMessage.uid,firstMessage.msg_time,this,20)
        }
    }

    onClickBottomMore(){
        let that = this;
        let lastMessage = this.state.messages[this.state.messages.length - 1];
        if(this.isFromHistory()){
            var successCallBack = function(receivedMessage){
                if(receivedMessage.length == 0){
                    that.state.scollBottomEnd = true;
                }else {
                    that.state.messages = that.state.messages.concat(receivedMessage);
                    that.state.messages.sort(function(a,b){
                        return a.msg_time-b.msg_time;
                    });
                    that.state.showBottomLoadingMore = false;
                    that.state.scollBottomEnd = false;
                    that.state.scrollDirection = "bottom";
                }
                that.state.showBottomLoadingMore = false;
                that.setState(that.state)
            }
            ChatWebAPIUtils.getBottomMoreMessage(lastMessage.uid,lastMessage.msg_time,successCallBack,20)
        }
    }

    render() {
        let messageList = this.state.messages;
        let messagesElement = [];
        for(let key in messageList){
            let message = messageList[key];
            let message_key = "message_" + message.uid+"_"+message.msg_time+"_"+message.msg_id+"_"+message.status;
            messagesElement.push(<MessageBubble key={message_key} isFromSoma={message.from_soma} message={message} ></MessageBubble>)
        }
        let loadingMoreItem = "";
        if(this.state.showLoadingMore){
            loadingMoreItem = (<div className="load-more" >
                <p className="load-more-btn" onClick={this.onClickMore.bind(this)}>{Lang.str("app_chat_ViewPreviousConversation")}</p>
            </div>);
        }

        let bottomLoadingMoreItem = "";
        if(this.isFromHistory() && this.state.showBottomLoadingMore){
            bottomLoadingMoreItem = <div className="load-following" >
                <p className="load-more-btn" onClick={this.onClickBottomMore.bind(this)}>{Lang.str("app_chat_viewFollowingConversation")}</p>
            </div>
        }

        if(this.isFromHistory()){
            if(this.props.conversation.oldest){
                loadingMoreItem = null;
            }
            if(this.props.conversation.latest) {
                bottomLoadingMoreItem = null;
            }
            console.log("this.props.conversation",this.props.conversation)
        }

        return (
            <div className="chatting-holder-body">
                    {loadingMoreItem}
                    <div className="chatting-messages">
                        {messagesElement}
                    </div>
                {bottomLoadingMoreItem}
            </div>
        );
    }
}

export default MessagePanelBody;