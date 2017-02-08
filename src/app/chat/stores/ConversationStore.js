import ChatDispatcher from "app/chat/dispatcher/ChatDispatcher"
import EventEmitter from 'events';
import assign from "object-assign";
import ChatConstants from "app/chat/constants/ChatConstants"
import auth from "app/Session"
import ChatWebAPIUtils from "app/chat/utils/ChatWebAPIUtils"
import MessageStore from "app/chat/stores/MessageStore"
import Lang from "lang/Lang"
import MessageNotify from "app/chat/utils/MessageNotify"
import UnreadConversationStore from "app/chat/stores/UnreadConversationStore"
import Session from "app/Session"
import Const from "app/Const"
import log from "loglevel"
import $ from "jquery"






var ActionTypes = ChatConstants.ActionTypes;
var _currentUid = null;
var _conversations = {}
var CHANGE_EVENT = 'change';
var selfPanel = true;
var focusEditor = false;
EventEmitter.prototype._maxListeners = 100;
var reminderObj = {
    showReminder:false,
    reminderType:"success",
    reminderWord:Lang.str("app_chat_transferConversationSuccess")
}
var transition = false;


var ConversationStore = assign({},EventEmitter.prototype,{
    init(rawConversations){
        if(rawConversations){
            rawConversations.forEach(function(conversation){
                let uid = conversation.uid;
                let lastMessage = this.getLastMessage(conversation);
                _conversations[uid] = {
                    uid:uid,
                    aid:conversation.aid,
                    conv_id:conversation.conv_id,
                    lastMessage:lastMessage,
                    somaUser:conversation.somaUser,
                    csAgent:conversation.csAgent,
                    startTime:conversation.start_on,
                    state:"open",
                    source:conversation.source,
                };
            },this);
        }
    },
    getLastMessage(conversation){
        let lastMessage = null;
        let lastSystemMsg = null;
        for(let i=conversation.msglist.length-1;i>=0;i=i-1){
            if(conversation.msglist[i].msg_type == 1){
                lastMessage = conversation.msglist[i];
                break;
            }else {
                lastSystemMsg = conversation.msglist[i];
            }
        }
        if(!lastMessage){
            return lastSystemMsg;
        }
        return lastMessage;
    },
    getReminderObj(){
        return reminderObj;
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

    selfPanel:function(){
        return selfPanel;
    },

    //轮转到下一个conversation,如果当前对话有uid,择取当前最近对话的uid做为当前uid
    getNextCurrentConversatoin(){
        if(!$.isEmptyObject(_conversations)){
            let selfConversation = [];
            Object.keys(_conversations).forEach(function (key) {
                let conversation = _conversations[key];
                if((conversation.aid+"") === Session.getAid()){
                    selfConversation.push(conversation);
                }
            });
            if(selfConversation.length != 0){
                selfConversation.sort(function(a,b){
                    let aStartTime = a.startTime;
                    let bStartTime = b.startTime;
                    return aStartTime<bStartTime?1:((aStartTime===bStartTime)?0:-1);
                });
                return selfConversation[0];
            }
        }else {
            return null;
        }
    },

    clickCurrentConversation(){
        let nextConversation = ConversationStore.getNextCurrentConversatoin();
        if(nextConversation){
            _currentUid = nextConversation.uid;
            let conv_id = nextConversation.conv_id;
            if(_currentUid){
                selfPanel = true;
                UnreadConversationStore.clearUnreadNumByConversationByUid(_currentUid);
                ChatWebAPIUtils.resetunread(conv_id);
                UnreadConversationStore.emitChange();
            }
        }else {
            _currentUid = null;
        }
    },

    getCurrentConversation:function(){
        if(_currentUid && _conversations[_currentUid]){
            return _conversations[_currentUid];
        }else {
            return null;
        }

    },

    getCurrentUid:function(){
        return _currentUid;
    },


    setCurrentUid:function(uid){
        _currentUid = uid;
    },



    getCurrentConversation:function () {
        return _conversations[_currentUid]
    },

    getConversationByUid(uid){
        return _conversations[uid];
    },

    getAll:function(){

        return _conversations;
    },
    clear: function () {
        _currentUid = null;
        _conversations = {}
        CHANGE_EVENT = 'change';
        selfPanel = true;
    },
    getTransition(){
        return transition;
    },
    setTransition(toTransition){
        transition = toTransition;
    },
    getFocusEditor(){
        return focusEditor;
    },
    resetFocusEditor(){
        focusEditor = false;
    },
    showLoadingMoreForCurrentConversation(){
        if(_conversations[_currentUid]){
            return !(_conversations[_currentUid].notShowMore);
        }else {
            return true;
        }

    },
    resetShowMore(){
        Object.keys(_conversations).forEach(function(uid){
            let conversation = _conversations[uid];
            conversation.notShowMore = false;
        },this);
    }
})

ConversationStore.dispatchToken = ChatDispatcher.register(
    function(action){
        switch (action.type){
            case ActionTypes.RECEIVE_INIT_CONVERSATIONS:
                ChatDispatcher.waitFor([MessageStore.dispatchToken]);
                ConversationStore.init(action.rawMessages)
                ConversationStore.emitChange();
                break;
            case ActionTypes.CLICK_CHANGE_PANNEL:
                selfPanel = !selfPanel;
                ConversationStore.emitChange();
                break;
            case ActionTypes.CLICK_CONVERSATION:
                ChatDispatcher.waitFor([MessageStore.dispatchToken]);
                _currentUid = action.uid;
                focusEditor = true;
                ConversationStore.emitChange();
                break;
            case ActionTypes.SEND_MESSAGE_SUCCESS:
                _conversations[_currentUid].lastMessage = action.sendingMessage;
                ConversationStore.emitChange();
                break;
            case ActionTypes.RECEIVE_MESSAGE:
                ChatDispatcher.waitFor([MessageStore.dispatchToken]);
                let receivedMessage = action.receivedMessage;
                if(receivedMessage.msg_type == 0 && (receivedMessage.content_type == 3 || receivedMessage.content_type == 6)){//AUTO_END_CONVERSATION
                    setTimeout(function () {
                        if(receivedMessage.uid === _currentUid){
                            if(!_conversations[receivedMessage.uid]){
                                return;
                            }
                            _conversations[receivedMessage.uid].state = "close";
                        }else if(UnreadConversationStore.getUnreadNumByConversation(receivedMessage.uid) && UnreadConversationStore.getUnreadNumByConversation(receivedMessage.uid)>0){
                            _conversations[receivedMessage.uid].state = "unreadClose";//表示未读close状态
                        }else {
                            delete _conversations[receivedMessage.uid];
                        }
                        ConversationStore.emitChange();
                    },1000);
                }else {
                    MessageNotify.messageNotify(receivedMessage);
                    let conversation = _conversations[receivedMessage.uid];
                    if(conversation && conversation.state === "open"){
                        if(receivedMessage.msg_type === 0 && receivedMessage.content_type === 2 ){//system transfer message
                            let transferMsg = JSON.parse(receivedMessage.content);
                            if ((transferMsg.fromAgent.aid + "") === Session.getAid()&& role == Const.ROLE.NORMAL) {//如果是普通客服,则删除
                                delete _conversations[receivedMessage.uid];
                                if(_currentUid == receivedMessage.uid){
                                    ConversationStore.clickCurrentConversation();
                                }
                                ConversationStore.emitChange();
                                break;
                            }
                            _conversations[receivedMessage.uid].csAgent = transferMsg.toAgent;
                            _conversations[receivedMessage.uid].aid = transferMsg.toAgent.aid;
                        }
                        if(action.receivedMessage.msg_type == 1){
                            _conversations[receivedMessage.uid].lastMessage = action.receivedMessage;
                        }
                        _conversations[receivedMessage.uid].state="open"
                        var role = Session.getRole();
                        if(receivedMessage.msg_type === 0 && receivedMessage.content_type === 2 && role == Const.ROLE.NORMAL ){//system transfer message
                            setTimeout(function () {
                                if(!_conversations[receivedMessage.uid]){
                                    return;
                                }
                                _conversations[receivedMessage.uid].state="close"
                                delete _conversations[receivedMessage.uid];
                                ConversationStore.emitChange();
                            },1000);
                        }else {
                            ConversationStore.emitChange();
                        }
                    }else {
                        if(receivedMessage.msg_type === 0 && receivedMessage.content_type === 2) {
                            let transferMsg = JSON.parse(receivedMessage.content);
                            if ((transferMsg.fromAgent.aid + "") === Session.getAid()) {//如果是自己转给自己,则不处理
                                return;
                            }
                        }
                        var getConversationCallBack = function(conversation){
                            _conversations[action.receivedMessage.uid] = {}
                            let lastMessage = ConversationStore.getLastMessage(conversation);
                            _conversations[action.receivedMessage.uid] = {
                                uid:action.receivedMessage.uid,
                                aid:conversation.aid,
                                lastMessage:lastMessage,
                                somaUser:conversation.somaUser,
                                csAgent:conversation.csAgent,
                                conv_id:conversation.conv_id,
                                startTime:conversation.start_on,
                                state:"open",
                                source:conversation.source
                            }
                            ConversationStore.emitChange();
                        }
                        ChatWebAPIUtils.getConversation(action.receivedMessage.uid,action.receivedMessage.conv_id,getConversationCallBack);
                    }
                }
                break;
            case ActionTypes.END_CONVERSATION:
                delete _conversations[action.uid];
                ConversationStore.clickCurrentConversation();
                ConversationStore.emitChange();
                break;
            case ActionTypes.REMINDER:
                reminderObj = action.reminderObj;
                ConversationStore.emitChange();
                break;
            case ActionTypes.SET_TAG:
                if( _conversations[action.uid]){
                    _conversations[action.uid].somaUser.tag = action.tag;
                }
                ConversationStore.emitChange();
                break;
            case ActionTypes.SET_REMARK:
                if(_conversations[action.uid]){
                    _conversations[action.uid].somaUser.remark = action.remark;
                }
                ConversationStore.emitChange();
                break;
            case ActionTypes.DELETE_TAG:
                if(_conversations[action.uid]){
                    _conversations[action.uid].somaUser.tag = null;
                }
                ConversationStore.emitChange();
                break;
            case ActionTypes.CLEAR_STORE:
                ConversationStore.clear();
                break;
            case ActionTypes.TRANSFER_CONVERSATION:
                if(_conversations[action.uid]){
                    var role = Session.getRole();
                    if(role == Const.ROLE.NORMAL){
                        delete _conversations[action.uid];
                        if(_currentUid == action.uid){
                            ConversationStore.clickCurrentConversation();
                        }
                    }else {
                        _conversations[action.uid].aid = action.agent.aid;
                        _conversations[action.uid].csAgent = action.agent;
                        ConversationStore.clickCurrentConversation();
                    }
                }
                ConversationStore.emitChange();
                break;
            case ActionTypes.TRANSITION_TO_CHAT:
                transition = true;
                ConversationStore.emitChange();
                break;
            case ActionTypes.LOAD_MORE_MESSAGES:
                _conversations[action.uid].notShowMore = true;
                break;
        }
    }
);




export default ConversationStore;