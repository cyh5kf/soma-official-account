import ChatServerActionCreators from "app/chat/actions/ChatServerActionCreator";
import $ from "jquery"
export class ChatDao{
    static getAllConversations(){
        $.ajax({
            url: 'api/v1/cs/message/currentConversationMessages',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            success: function (rawMessages) {
                ChatServerActionCreators.receiveConversations(rawMessages);
            }
        });
    }
}


export default ChatDao;