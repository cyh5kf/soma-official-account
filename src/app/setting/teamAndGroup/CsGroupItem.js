import React from 'react'
import AddCustomerService from 'app/setting/teamAndGroup/AddCustomerService'
import Notice from 'app/setting/teamAndGroup/Notice'
import CsAgentItem from 'app/setting/teamAndGroup/CsAgentItem'
import TeamAndGroupApiUtil from 'app/setting/teamAndGroup/TeamAndGroupApiUtil'
import Lang from "lang/Lang"
import Session from 'app/Session'
import DeleteComfirm from 'app/setting/teamAndGroup/DeleteComfirm'


export class CsGroupItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {deleteState: false,isFirstClick:true};
    }

    componentWillReceiveProps(nextProps) {
        var csGroup = nextProps.csGroup;
        var group_id = csGroup.group_id;
        var successcb = function (csAgents, txtStatus, xhr) {
            if (xhr.status = 200) {
                this.setState(
                    {
                        actionType: null,
                        modifyInfo: null,
                        csGroup: csGroup,
                        csAgents: csAgents
                    }
                );
            }
        };
        TeamAndGroupApiUtil.getGroupAgents(group_id, successcb.bind(this));
    }

    componentDidMount() {
        this.state.role = Session.getRole();
        this.state.peopleRole ="";
        var csGroup = this.props.csGroup;
        var group_id = csGroup.group_id;
        var successcb = function (csAgents, txtStatus, xhr) {
            if (xhr.status = 200) {
                this.setState(
                    {
                        actionType: null,
                        modifyInfo: null,
                        csGroup: csGroup,
                        csAgents: csAgents
                    }
                );
            }
        };
        TeamAndGroupApiUtil.getGroupAgents(group_id, successcb.bind(this));
    }

    handleModifyGroup() {
        var group_id = this.state.csGroup.group_id;
        this.props.onModifyGroup(group_id);
    }

    handleDeleteGroup() {
        var group_id = this.state.csGroup.group_id;
        var successcb = function (data, txtStatus, xhr) {
            if (xhr.status = 200) {
                this.props.onAfterDeleteGroup();
            }
        };
        TeamAndGroupApiUtil.deleteCsGroup(group_id, successcb.bind(this));
    }

    handleAfterSaveCustomer() {
        this.props.onAfterSaveCustomer();
    }

    handleDeleteCustomer(event) {
        this.setState({deleteState: false});
        var aid = this.props.csAgent.aid;
        var successcb = function (data, txtStatus, xhr) {
            if (xhr.status == 200) {
                this.props.onAfterDeleteCustomer();
            }
        };
        TeamAndGroupApiUtil.deleteCsAgent(aid, successcb.bind(this));
        return false;
    }

    handleAddCustomer() {
        var successcb = function (data, txtStatus, xhr) {
            if (xhr.status == 200) {
                this.state.countService = data.count;
                this.state.actionType = 'add_customer';
                this.state.modifyInfo = {};
                this.forceUpdate();
            }
        };
        TeamAndGroupApiUtil.countservice(successcb.bind(this));

    }

    handleDeleteComfirm(csAgentType){
        this.props.csAgent = csAgentType;
        this.setState({deleteState: true});
        return false;
    }

    handleCancelComfirm(){
        this.setState({deleteState: false});
        return false;
    }

    handleFirstClick() {
        this.state.isFirstClick = true;
    }

    handleModifyCustomer(aid) {
        if (this.state.isFirstClick){
            console.log("handleModifyCustomer start")
            this.state.isFirstClick = false;
            this.state.actionType = 'modify_customer';
            var successcb = function (csAgent, txtStatus, xhr) {
                if (xhr.status = 200) {
                    this.state.peopleRole=csAgent.role;
                    if(csAgent.role=="9" && this.state.role!="9"){
                        this.state.actionType =null;
                        return false;
                    }
                    this.state.modifyInfo = csAgent;
                    this.forceUpdate();
                }
            };
            TeamAndGroupApiUtil.getAgentInfo(aid, successcb.bind(this));
        }
    }

    handleCancelCustomer() {
        this.state.actionType = null;
        this.state.modifyInfo = null;
        this.forceUpdate();
    }

    render() {
        var csGroup = this.state.csGroup;
        var csAgents = this.state.csAgents;
        if (csGroup == null || csAgents == null) {
            return <div></div>
        }

        var haveMember = csAgents != null && csAgents.length > 0;
        var addCustomerService = '';
        var noticeDialog = '';
        if (this.state.actionType != null) {
            var csAgentsLength = this.state.countService;
            if(this.state.actionType == 'modify_customer'){
                addCustomerService = <AddCustomerService csGroup={this.state.csGroup}
                                                         actionType={this.state.actionType}
                                                         modifyInfo={this.state.modifyInfo}
                                                         peopleRole={this.state.peopleRole}
                                                         onFirstClick = {this.handleFirstClick.bind(this)}
                                                         onCancelCustomer={this.handleCancelCustomer.bind(this)}
                                                         onAfterSaveCustomer={this.handleAfterSaveCustomer.bind(this)}/>;
            } else if(csAgentsLength >= 10){
                noticeDialog = <Notice actionType={this.state.actionType}
                                           onCancelNotice={this.handleCancelCustomer.bind(this)}/>
            } else if(this.state.actionType == 'add_customer'){
                addCustomerService = <AddCustomerService csGroup={this.state.csGroup}
                                                         actionType={this.state.actionType}
                                                         modifyInfo={this.state.modifyInfo}
                                                         peopleRole={this.state.peopleRole}
                                                         onFirstClick = {this.handleFirstClick.bind(this)}
                                                         onCancelCustomer={this.handleCancelCustomer.bind(this)}
                                                         onAfterSaveCustomer={this.handleAfterSaveCustomer.bind(this)}/>;
            }
        }

        var deleteDom = '';
        if (csGroup.name != 'Default' && !haveMember) {
            deleteDom = <a className="deleteFun" onClick={this.handleDeleteGroup.bind(this)}>{Lang.str('app_setting_teamAndGroup_Delete')}</a>;
        }

        var csAgentItems = [];
        for (var idx in csAgents) {
            var role = csAgents[idx].role;
            if(role == "9"){
                csAgentItems.unshift(<CsAgentItem csAgent={csAgents[idx]}
                                               onModifyCustomer={this.handleModifyCustomer.bind(this)}
                                               modifyInfo={this.state.modifyInfo}
                                               onDeleteDialog={this.handleDeleteComfirm.bind(this)}/>);
            } else {
                csAgentItems.push(<CsAgentItem csAgent={csAgents[idx]}
                                               onModifyCustomer={this.handleModifyCustomer.bind(this)}
                                               modifyInfo={this.state.modifyInfo}
                                               onDeleteDialog={this.handleDeleteComfirm.bind(this)}/>);
            }


        }

        var DeleteComfirmDialog = '';
        if(this.state.deleteState){
            DeleteComfirmDialog = <DeleteComfirm csAgent={this.state.csAgent} onAfterDeleteComfirm={this.handleDeleteCustomer.bind(this)}
                                                 onAfterCancel={this.handleCancelComfirm.bind(this)}/>
        }

        var csAgentsDom;
        if (haveMember) {
            csAgentsDom = <div className="grEx-content">
                <ul className="clearfix grEx-details">
                    {csAgentItems}
                </ul>
            </div>
        } else {
            csAgentsDom = <div>
                <div className="grEx-content">
                    <p className="defaultTip">{Lang.str('app_setting_teamAndGroup_HaveNoMembers')}{deleteDom}</p>
                </div>
            </div>
        }


        return (
            <div className="grEx-wrap">
                <div className="grEx-head clearfix">
                    <i className="group-icons icon-t-group"/>
                    <h5>{this.state.csGroup.name}</h5>
                    <div className="fright lineHeight">
                        <a className="pr15 modifyGroup" onClick={this.handleModifyGroup.bind(this)}></a>
                        <a className="pr15 addGroup" onClick={this.handleAddCustomer.bind(this)}></a>
                    </div>
                    {addCustomerService}
                    {noticeDialog}
                </div>
                {csAgentsDom}
                {DeleteComfirmDialog}
            </div>
        );
    }
}

export default CsGroupItem;