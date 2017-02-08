import React from "react";
import MessagePanelHeader from "app/chat/components/MessagePanelHeader.react";
import MessagePanelBody from "app/chat/components/MessagePanelBody.react";
import MessagePanelEditor from "app/chat/components/MessagePanelEditor.react";



export class ChattingContent extends React.Component{
    render(){
        let chattingHeader = null;
        let chattingBody = null;
        let chattingEditor = null;
        if(this.props.conversation){
            chattingHeader = <MessagePanelHeader conversation={this.props.conversation}></MessagePanelHeader>;
            chattingBody =  <MessagePanelBody conversation={this.props.conversation}></MessagePanelBody>;
            if(this.props.showEditor){
                chattingEditor = <MessagePanelEditor conversation={this.props.conversation}></MessagePanelEditor>;
            }
        }

        return (
            <div className="chatting-cont">
                <div className="cont-empty"></div>
                {chattingHeader}
                {chattingBody}
                {chattingEditor}
            </div>
        );
    }
}

export default ChattingContent;