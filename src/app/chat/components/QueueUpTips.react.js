import React from 'react'
import classNames from 'classnames/bind';
import Lang from "lang/Lang"



export class QueueUpTips extends React.Component {
    constructor(props) {
        super(props);
    }
    render(){
        if(this.props.waitingCount == 0){
            return null;
        }
        let userWaiting = Lang.str("app_chat_UsersAreWaitingForConnecting",'<em class="chat-queue-up-tips-num">' + this.props.waitingCount + '</em>');
        if(this.props.waitingCount && this.props.waitingCount==1){
            userWaiting =  Lang.str("app_chat_UserAreWaitingForConnecting",'<em class="chat-queue-up-tips-num">' + this.props.waitingCount + '</em>');
        }
        return (<div className="chat-queue-up-tips-container">
                <div className="chat-queue-up-tips">
                    <span className="chat-queue-up-tips-icon"></span>
                    <div>
                        <span className="chat-queue-up-tips-text" dangerouslySetInnerHTML={{"__html":userWaiting}}></span>
                    </div>
                </div>
        </div>);
    }
}

export default QueueUpTips;