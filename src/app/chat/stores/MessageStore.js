import ChatDispatcher from "app/chat/dispatcher/ChatDispatcher"
import EventEmitter from 'events';
import assign from "object-assign";
import ConversationStore from "app/chat/stores/ConversationStore"
import ChatConstants from "app/chat/constants/ChatConstants"
import ChatMessageUtils from "app/chat/utils/ChatMessageUtils"
import UnreadConversationStore from "app/chat/stores/UnreadConversationStore"
import log from "loglevel"
import ChatWebAPIUtils from "app/chat/utils/ChatWebAPIUtils"





var MessageSentStatus = ChatConstants.MessageSentStatus;


var _messages = {

};


function _addConversations(rawConversations) {
    log.debug(rawConversations,rawConversations)
    rawConversations.forEach(function(conversation) {
        _addMessages(conversation.msglist);
    });
}



function _addMessages(messages){
    if(messages.length>0){
        messages.forEach(_addMessage);
        //排序
        sort(messages[0].uid);
    }
}


function _addMessage(message){
    let uid = message.uid;
    if(!(message.uid in _messages)){
        _messages[message.uid] = {}
        _messages[message.uid].messageList = [];
        _messages[message.uid].aid = message.aid;
        _messages[uid].messageIDMap = {};
        _messages[uid].somaMessageIDMap = {};
    }
    if((message.status) && message.status != MessageSentStatus.SUCCESS){
        _messages[message.uid].messageList.push(message)
    }else if(!(message.msg_id in _messages[uid].messageIDMap)){
        //对somamessageID 进行去重
        if(message.soma_msg_id !== 0 && message.from_soma == 1 && (message.soma_msg_id in _messages[uid].somaMessageIDMap)){
            return;
        }else {
            _messages[uid].somaMessageIDMap[message.soma_msg_id] = message.soma_msg_id;
        }
        _messages[uid].messageIDMap[message.msg_id] = message.msg_id;
        if(message.status == undefined){
            message.status = MessageSentStatus.SUCCESS;
        }
        _messages[message.uid].messageList.push(message);
    }
}

function sort(uid){
    _messages[uid].messageList.sort(function(a,b){
        return a.msg_time-b.msg_time;
    });
    let lastMsg = _messages[uid].messageList[_messages[uid].messageList.length-1];
    _messages[uid].maxMsgTime = lastMsg.msg_time;
    _messages[uid].maxMsgId = lastMsg.msg_id;
}

function syncMessage(rawConversations){
    rawConversations.forEach(function(conversation) {
        if(conversation.msglist.length>0){
            conversation.msglist.forEach(_addMessage);
            sort(conversation.msglist[0].uid);
        }
    });
}



function modifySendingMessageStatus(currentStatus,toModifyStatus,messageTime){
    var currentUid = ConversationStore.getCurrentUid();
    for(let key in _messages[currentUid].messageList){
        let message = _messages[currentUid].messageList[key];
        if(message.status === currentStatus && message.msg_time === messageTime){
            message.status = toModifyStatus;
            if(message.realTime){
                message.msg_time = message.realTime;
            }
        }
    }
}
var CHANGE_EVENT = 'change';
var ActionTypes = ChatConstants.ActionTypes;
/**
 * 所有消息都存在这里
 */
var MessageStore = assign({},EventEmitter.prototype,{
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getMessagesForCurrentConversation(){
        const uid = ConversationStore.getCurrentUid();
        if(uid in _messages){
            return _messages[uid].messageList
        }else {
            return [];
        }

    },
    //syncMsg时使用
    getSyncObjs(){
        let retArrays = [];
        for(let uid in _messages){
            let message = _messages[uid]
            retArrays.push({"convId":ConversationStore.getConversationByUid(uid)?ConversationStore.getConversationByUid(uid).conv_id:undefined,"uid":uid,"maxMsgTime":message.maxMsgTime,"maxMsgId":message.maxMsgId});
        }
        return {"params":retArrays}
    },
    shouldScrollBottom:true,//规定是否scroll到底部
    isOwnConversation:false,
    shouldScroll:false,
    clear: function () {
        _messages = {};
    }
});

MessageStore.dispatchToken = ChatDispatcher.register(function(action) {
    switch (action.type){
        case ActionTypes.RECEIVE_INIT_CONVERSATIONS:
            _addConversations(action.rawMessages);
            MessageStore.emitChange();
            break;
        case ActionTypes.SENDING_MESSAGE:
            MessageStore.shouldScrollBottom = true;
            MessageStore.isOwnConversation = true;
            MessageStore.shouldScroll = true;
            _addMessage(action.rawMessage)
            MessageStore.emitChange();
            break;
        case ActionTypes.SEND_MESSAGE_SUCCESS:
            modifySendingMessageStatus(MessageSentStatus.SENDING,MessageSentStatus.SUCCESS,action.sendingMessage.msg_time);
            MessageStore.emitChange();
            break;
        case ActionTypes.SEND_MESSAGE_FAILED:
            modifySendingMessageStatus(MessageSentStatus.SENDING,MessageSentStatus.FAILED,action.sendingMessage.msg_time);
            MessageStore.emitChange();
            break;
        case ActionTypes.RECEIVE_MESSAGE:
            if(action.receivedMessage.uid == ConversationStore.getCurrentUid()){
                MessageStore.isOwnConversation = true;
                MessageStore.shouldScroll = true;
            }else {
                MessageStore.isOwnConversation = false;
            }
            let conversation = ConversationStore.getConversationByUid(action.receivedMessage.uid);
            if(conversation && conversation.state === "open"){
                _addMessage(action.receivedMessage);
                sort(action.receivedMessage.uid);
                MessageStore.emitChange();
            }else {
                delete  _messages[action.receivedMessage.uid];
                var getConversationCallBack = function(conversation){
                    _addMessages(conversation.msglist);
                    MessageStore.emitChange();
                }
                ChatWebAPIUtils.getConversation(action.receivedMessage.uid,action.receivedMessage.conv_id,getConversationCallBack);
            }
            break;
        case ActionTypes.LOAD_MORE_MESSAGES:
            MessageStore.shouldScrollBottom = false;
            MessageStore.shouldScroll = true;
            _addMessages(action.receivedMessage)
            MessageStore.emitChange();
            break;
        case ActionTypes.CLICK_CONVERSATION:
            MessageStore.shouldScrollBottom = true;
            MessageStore.isOwnConversation = true;
            MessageStore.shouldScroll = true;
            break;
        case ActionTypes.END_CONVERSATION:
            delete _messages[action.uid];
            MessageStore.emitChange();
            break;
        case ActionTypes.RESEND_FAILED_MESSAGE:
            modifySendingMessageStatus(MessageSentStatus.FAILED,MessageSentStatus.SENDING,action.rawMessage.msg_time)
            MessageStore.emitChange();
            break;
        case ActionTypes.SYNC_MESSAGE:
            syncMessage(action.rawMessages);
            MessageStore.emitChange();
            break;
        case ActionTypes.CLEAR_STORE:
            MessageStore.clear();
            break;
        default:
        // do nothing
    }
})



export default MessageStore;