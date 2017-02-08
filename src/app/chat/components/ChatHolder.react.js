import React from "react";
import ConversationStore from "app/chat/stores/ConversationStore";
import RightInfoPanel from "app/chat/components/RightInfoPanel.react";
import ChattingContent from "app/chat/components/ChattingContent.react";
import ChattingReminder from "app/chat/components/ChattingReminder.react";
import Lang from "lang/Lang";
import log from "loglevel";


function getStateFromStores() {
    return {
        conversation: ConversationStore.getCurrentConversation(),
        showReminder:ConversationStore.getReminderObj().showReminder,
        reminderType:ConversationStore.getReminderObj().reminderType,
        reminderWord:ConversationStore.getReminderObj().reminderWord
    };
}

export class ChatHolder extends React.Component{
    constructor(props) {
        super(props);
        this.state = getStateFromStores();
    };

    componentDidMount(){
        ConversationStore.addChangeListener(this._onChange.bind(this));
    }

    componentWillUnmount(){
        ConversationStore.removeChangeListener(this._onChange.bind(this));
    }


    _onChange(){
        this.setState(getStateFromStores());
    }

    render(){
            if(this.state.conversation){
                return <div className="chatting-holder">
                    <ChattingContent conversation={this.state.conversation} showEditor={true}></ChattingContent>
                    <RightInfoPanel conversation={this.state.conversation} readOnly={false}></RightInfoPanel>
                    <ChattingReminder showReminder={this.state.showReminder} reminderType={this.state.reminderType} reminderWord={this.state.reminderWord} ></ChattingReminder>
                </div>
            }else {
                return (<div className="chatting-holder-empty">
                    <div className="chatting-holder-empty-child">
                        {Lang.str("app_chat_OpenConversationFromLeftPanel")}
                    </div>
                    <ChattingReminder showReminder={this.state.showReminder} reminderType={this.state.reminderType} reminderWord={this.state.reminderWord} ></ChattingReminder>
                </div>);
            }
    }
}

export default ChatHolder;