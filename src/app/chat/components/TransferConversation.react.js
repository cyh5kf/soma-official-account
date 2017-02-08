import React from 'react'
import classNames from 'classnames/bind';
import Lang from "lang/Lang"
import Session from "app/Session"
import Const from "app/Const"
import {cutString} from "utils/tools"



export class TransferConversation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "collapses":{}
        }
    };

    clickCollapse(groupId){
        if(this.state.collapses[groupId]){
            this.state.collapses[groupId] = false;
        }else {
            this.state.collapses[groupId] = true;
        }
        this.setState(this.state)
    }

    transfer(agent,conversation){
        console.log("transfer",agent)
        this.props.onTransferConversation(agent,conversation);
    }

    render() {
        let groupHtml = [];
        if(this.props.groups.length != 0){
            groupHtml = [];
            groupHtml.push(<li >
                <div className="accordion-tit">{Lang.str("app_chat_TransferConversation")}</div>
            </li>);
            for(let i in this.props.groups){
                let group = this.props.groups[i];
                let agentListHtml = [];
                for(let j in group.agentList){
                    let agent = group.agentList[j]
                    var role = Session.getRole();
                    if(agent.aid !== this.props.conversation.aid){
                        let avatar = agent.avatar;
                        if(!avatar){
                            avatar = require("static/images/common/head_sculpture.png");
                        }
                        agentListHtml.push(<li onClick={this.transfer.bind(this,agent,this.props.conversation)}>
                            <i className="online"></i>
                            <img width="28" height="28" className="portrait" src={avatar} alt="portrait"/>
                            <a href="#">{cutString(agent.name,13)}</a>
                            <em>{agent.active_conv_count}</em>
                        </li>)
                    }
                }
                if(agentListHtml.length !== 0){
                    groupHtml.push(<li className="" >
                        <div className="link" onClick={this.clickCollapse.bind(this,group.groupId)}><span>{cutString(group.group.name,20)}</span>
                            <i className={classNames({"grpTit-up":this.state.collapses[group.groupId],"grpTit-down":!this.state.collapses[group.groupId]})} ></i></div>
                        <ul className={classNames({"submenu":true,"show":!this.state.collapses[group.groupId]})}>
                            {agentListHtml}
                        </ul>
                    </li>);
                }
            }
            if(groupHtml.length ===1){
                groupHtml = [];
            }
        }

        if(groupHtml.length === 0){
           return <div className={classNames({"accordion-empty-customer":true,"hidden":!this.props.showPopup})} >{Lang.str("app_chat_noOnlineCustomerService")}</div>;
        }else {
            return (<ul className={classNames({"accordion":true,"hidden":!this.props.showPopup})}>
                {groupHtml}
            </ul>)
        }

    }

}

export default TransferConversation;
