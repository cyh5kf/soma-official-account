import React from 'react'
import {contentTypeMap} from  "app/chat/components/MessageBubble.react"
import classNames from 'classnames/bind';




export class SystemMessageBubble extends React.Component{
    constructor(props) {
        super(props);
        this.state = {}
    }

    formatAMPM(date) {
        var month = date.getMonth()+1<10?"0"+(date.getMonth()+1):(date.getMonth()+1);
        var day = date.getDate()<10?"0"+date.getDate():date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = month+"-"+day +" " + hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    render(){
        let systemMessage = contentTypeMap[this.props.message.content_type]();
        if(this.props.message.content_type === 2){//systemssage
            let transferMsg = JSON.parse(this.props.message.content);
            let fromName = "";
            if(transferMsg.operator && transferMsg.operator.name){
                fromName = transferMsg.operator.name;
            }else {
                fromName = transferMsg.fromAgent.name;
            }

            systemMessage = contentTypeMap[this.props.message.content_type](fromName,transferMsg.toAgent.name)
        }
        if(this.props.message.content_type === 3){
            let endOperatorName = "";
            try {
                endOperatorName = JSON.parse(this.props.message.content).name;
            }catch (e){
                //
            }
            systemMessage = contentTypeMap[this.props.message.content_type](endOperatorName);
            console.log("endOperatorName",systemMessage)
        }
        if(this.props.message.content_type === 1){
            return (<div className={classNames({"system-message":true,"system-message-start-conv":true})}>
                <div className="divider left"></div>
                <span className="system-message-content">{systemMessage}</span>
                <span>&nbsp;</span>
                <span className="system-message-time">{this.formatAMPM(new Date(this.props.message.msg_time))}</span>
                <div className="divider right"></div>
            </div>);
        }else {
            return (<p className={classNames({"system-message":true,"system-message-end-conv":(this.props.message.content_type === 3||this.props.message.content_type === 6)})}>
                <span>{systemMessage}</span>
                <span>&nbsp;</span>
                <span >{this.formatAMPM(new Date(this.props.message.msg_time))} </span>
            </p>);
        }
    }
}

export default SystemMessageBubble;