import React from 'react'
import RouteComponent from 'app/RouteComponent';
import classNames from 'classnames/bind';
import RightInfoPanel from "app/chat/components/RightInfoPanel.react"
import ChattingContent from "app/chat/components/ChattingContent.react"


export class HistoryChatDetail extends RouteComponent{
    constructor(props) {
        super(props);
    }

    closeDialog(){
        this.props.closeDialog();
    }

    render(){
        console.log("conversation",this.props.conversation)
        if(!this.props.conversation){
            return null;
        }
        return <div id="history-detail-wrapper" className={classNames({"hide":!this.props.showDetailDialog})}  >
            <div className="chatting-holder">
                <ChattingContent conversation={this.props.conversation} showEditor={false}></ChattingContent>
                <RightInfoPanel conversation={this.props.conversation} readOnly={true} showClose={true} closeDialog={this.closeDialog.bind(this)}></RightInfoPanel>
            </div>
        </div>
    }
}

export default HistoryChatDetail;
