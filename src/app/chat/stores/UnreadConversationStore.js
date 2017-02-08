import ChatDispatcher from "app/chat/dispatcher/ChatDispatcher"
import EventEmitter from 'events';
import assign from "object-assign";
import ChatConstants from "app/chat/constants/ChatConstants"
import ConversationStore from "app/chat/stores/ConversationStore"
import Session from "app/Session"
import ChatWebAPIUtils from "app/chat/utils/ChatWebAPIUtils"







EventEmitter.prototype._maxListeners = 100;
var CHANGE_EVENT = 'change';
var ActionTypes = ChatConstants.ActionTypes;


var unreadConversation = {}
var allUnreadNum = 0;

var UnreadConversationStore = assign({},EventEmitter.prototype,{
    init:function (rawConversations) {
        allUnreadNum = 0;
        if(rawConversations){
            rawConversations.forEach(function(conversation){
                if(conversation.aid+"" === Session.getAid()){
                    unreadConversation[conversation.uid] = conversation.unread;
                    allUnreadNum += conversation.unread;
                }
            },this);
        }
        console.log("init:function (rawConversations)",allUnreadNum)
    },
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    /**
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    getUnreadConversations: function() {
        return unreadConversation;
    },
    getUnreadNumByConversation: function (uid) {
        return unreadConversation[uid];
    },
    clearUnreadNumByConversationByUid:function (uid) {
        allUnreadNum = allUnreadNum-unreadConversation[uid];
        unreadConversation[uid] = 0;

    },
    getAllUnreadNum:function(){
        return allUnreadNum;
    },
    clear: function () {
        unreadConversation = {}
        allUnreadNum = 0;
    }
});

UnreadConversationStore.dispatchToken = ChatDispatcher.register(function(action) {
    switch (action.type){
        case ActionTypes.RECEIVE_INIT_CONVERSATIONS:
            ChatDispatcher.waitFor([ConversationStore.dispatchToken]);
            UnreadConversationStore.init(action.rawMessages)
            UnreadConversationStore.emitChange();
            break;
        case ActionTypes.RECEIVE_MESSAGE:
            ChatDispatcher.waitFor([ConversationStore.dispatchToken])
            let uid = action.receivedMessage.uid;
            if(uid != ConversationStore.getCurrentUid() &&  action.receivedMessage.msg_type === 1 && action.receivedMessage.from_soma && action.receivedMessage.aid+"" === Session.getAid()){
                if(uid in unreadConversation){
                    unreadConversation[uid]++;
                }else {
                    unreadConversation[uid] = 1;
                }
                allUnreadNum += 1;
            }
            if(uid === ConversationStore.getCurrentUid()){
                if(ConversationStore.getCurrentConversation()){
                    ChatWebAPIUtils.resetunread(ConversationStore.getCurrentConversation().conv_id);
                }
            }
            if(action.receivedMessage.msg_type === 0 && action.receivedMessage.content_type === 2){//system transfer message
                let currentNum = unreadConversation[uid];
                if(!currentNum){
                    currentNum = 0;
                }
                allUnreadNum = allUnreadNum-currentNum;
                unreadConversation[uid] = 0;
            }
            UnreadConversationStore.emitChange();
            break;
        case ActionTypes.CLICK_CONVERSATION:
            let currentNum = unreadConversation[action.uid];
            if(!currentNum){
                currentNum = 0;
            }
            allUnreadNum = allUnreadNum-currentNum;
            unreadConversation[action.uid] = 0;
            ChatDispatcher.waitFor([ConversationStore.dispatchToken]);
            ChatWebAPIUtils.resetunread(action.conv_id);
            UnreadConversationStore.emitChange();
            break;
        case ActionTypes.CLEAR_STORE:
            UnreadConversationStore.clear();
            break;
        default:
    }
});


export default UnreadConversationStore;