import React from 'react'
import NewGroup from 'app/setting/teamAndGroup/NewGroup'
import CsGroupItem from 'app/setting/teamAndGroup/CsGroupItem'
import TeamAndGroupApiUtil from 'app/setting/teamAndGroup/TeamAndGroupApiUtil'
import Lang from "lang/Lang"

export class GroupSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        var successcb = function (csGroups, txtStatus, xhr) {
            if (xhr.status = 200) {
                this.setState({actionType: null, modifyInfo: null, csGroups: csGroups});
            }
        };
        TeamAndGroupApiUtil.getInitialTeamAndGroup(successcb.bind(this));
    }

    handleNewGroup() {
        this.state.actionType = 'new_group';
        this.state.modifyInfo = null;
        this.forceUpdate();
    }

    handleModifyGroup(group_id) {
        this.state.actionType = 'modify_group';
        var successcb = function (csGroup, txtStatus, xhr) {
            if (xhr.status = 200) {
                this.state.modifyInfo = csGroup;
                this.forceUpdate();
            }
        };
        TeamAndGroupApiUtil.getGroupInfo(group_id, successcb.bind(this));
    }

    handleAfterSaveGroup() {
        var successcb = function (csGroups, txtStatus, xhr) {
            if (xhr.status = 200) {
                this.setState({actionType: null, modifyInfo: null, csGroups: csGroups});
            }
        };
        TeamAndGroupApiUtil.getInitialTeamAndGroup(successcb.bind(this));
    }

    handleAfterDeleteGroup() {
        var successcb = function (csGroups, txtStatus, xhr) {
            if (xhr.status = 200) {
                this.setState({actionType: null, modifyInfo: null, csGroups: csGroups});
            }
        };
        TeamAndGroupApiUtil.getInitialTeamAndGroup(successcb.bind(this));
    }

    handleCancelGroup() {
        this.state.actionType = null;
        this.state.modifyInfo = null;
        this.forceUpdate();
    }

    handleAfterSaveCustomer() {
        var successcb = function (csGroups, txtStatus, xhr) {
            if (xhr.status = 200) {
                this.setState({actionType: null, modifyInfo: null, csGroups: csGroups});
            }
        };
        TeamAndGroupApiUtil.getInitialTeamAndGroup(successcb.bind(this));
    }

    handleAfterDeleteCustomer() {
        var successcb = function (csGroups, txtStatus, xhr) {
            if (xhr.status == 200) {
                this.setState({actionType: null, modifyInfo:null, csGroups: csGroups});
                $.messageBox({message:Lang.str("app_setting_teamAndGroup_deleteGroupSuccess"),level: "success"});
            }
        };
        TeamAndGroupApiUtil.getInitialTeamAndGroup(successcb.bind(this));
    }

    render() {
        var csGroups = this.state.csGroups;
        var csGroupItems = [];
        var seviceCount = '';
        for (var idx in csGroups) {
            csGroupItems.push(<CsGroupItem csGroup={csGroups[idx]}
                                           onModifyGroup={this.handleModifyGroup.bind(this)}
                                           onAfterDeleteGroup={this.handleAfterDeleteGroup.bind(this)}
                                           onAfterSaveCustomer={this.handleAfterSaveCustomer.bind(this)}
                                           onAfterDeleteCustomer={this.handleAfterDeleteCustomer.bind(this)}
                                           />);
        }
        var groupDialog = '';
        if (this.state.actionType != null) {
            groupDialog = <NewGroup actionType={this.state.actionType}
                                    modifyInfo={this.state.modifyInfo}
                                    onAfterSaveGroup={this.handleAfterSaveGroup.bind(this)}
                                    onCancelGroup={this.handleCancelGroup.bind(this)}/>
        }

        return (
            <div className="groupExamples">
                <div className="group">
                    <h3>{Lang.str('app_setting_teamAndGroup_GroupSetting')}</h3>
                    <div id="settings_new" onClick={this.handleNewGroup.bind(this)}>{Lang.str('app_setting_teamAndGroup_NewGroup')}</div>
                </div>
                {csGroupItems}
                {groupDialog}
            </div>
        );
    }
}

export default GroupSetting;