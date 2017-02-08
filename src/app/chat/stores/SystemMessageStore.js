import ChatDispatcher from "app/chat/dispatcher/ChatDispatcher"
import EventEmitter from 'events';
import assign from "object-assign";
import ChatConstants from "app/chat/constants/ChatConstants"



var CHANGE_EVENT = 'change';
var ActionTypes = ChatConstants.ActionTypes;

var shouldKillOut = false;

var SystemMessageStore = assign({},EventEmitter.prototype,{
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
    shouldKillOut: function () {
        return shouldKillOut;
    },
    clear: function () {
        shouldKillOut = false;
    }
});


SystemMessageStore.dispatchToken = ChatDispatcher.register(function(action) {
    switch (action.type) {
        case ActionTypes.KICK_OUT:
            console.log("SystemMessageStore.dispatchToken",ActionTypes.KICK_OUT)
            shouldKillOut = true;
            SystemMessageStore.emitChange();
            break;
        case ActionTypes.CLEAR_STORE:
            SystemMessageStore.clear();
            break;
    }
});

export default SystemMessageStore;