import React from 'react'
import ChatServerActionCreator from "app/chat/actions/ChatServerActionCreator"
import OpenedEditor from "app/chat/components/OpenedEditor.react"
import Lang from "lang/Lang"



export class MessagePanelEditor extends React.Component{
    render(){
        if(this.props.conversation.state && (this.props.conversation.state==="close" ||this.props.conversation.state==="unreadClose" )){
            return <div className="chatting-holder-editor">
                <div className="closed-editor">
                <div className="editor-empty-wrapper">
                    <div className="conversation-over">
                        <span>{Lang.str("app_chat_ThisConversationHasEnded")}</span>
                    </div>
                    <div className="close-conversation">
                        <a onClick={this.onEndChat.bind(this)}>{Lang.str("app_chat_CloseThisWindow")}</a>
                    </div>
                </div>
            </div>
            </div>
        }else {
            return (
                <OpenedEditor conversation={this.props.conversation}></OpenedEditor>
            )
        }
    }

    onEndChat(){
        ChatServerActionCreator.endChat(this.props.conversation.uid);
    }


}



export default MessagePanelEditor