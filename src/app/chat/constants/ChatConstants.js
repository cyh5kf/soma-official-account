import keyMirror from 'keymirror';

export default {
  ActionTypes: keyMirror({
    RECEIVE_INIT_CONVERSATIONS:null,
    CLICK_CHANGE_PANNEL:null,
    CLICK_CONVERSATION:null,
    SENDING_MESSAGE:null,
    SEND_MESSAGE_SUCCESS:null,
    SEND_MESSAGE_FAILED:null,
    RECEIVE_MESSAGE:null,
    LOAD_MORE_MESSAGES:null,
    END_CONVERSATION:null,
    RESEND_FAILED_MESSAGE:null,
    SYNC_MESSAGE:null,
    AUTO_END_CONVERSATION:null,
    REMINDER:null,
    SET_TAG:null,
    SET_REMARK:null,
    KICK_OUT:null,
    CLEAR_STORE:null,
    TRANSFER_CONVERSATION:null,
    DELETE_TAG:null,
    TRANSITION_TO_CHAT:null
  }),
  MessageSentStatus:keyMirror({
    SENDING:null,
    SUCCESS:null,
    FAILED:null
  })
};
