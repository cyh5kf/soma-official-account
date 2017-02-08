import React from 'react'
import TeamAndGroupApiUtil from 'app/setting/teamAndGroup/TeamAndGroupApiUtil'
import Lang from "lang/Lang"
import Session from 'app/Session'

export class NewGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        var actionType = this.props.actionType;
        var group_id = null;
        var group_name = null;
        if (actionType == 'modify_group') {
            group_id = this.props.modifyInfo.group_id;
            group_name = this.props.modifyInfo.name;
        }
        this.setState(
            {
                actionType: actionType,
                group_id: group_id,
                group_name: group_name
            }
        );
    }

    handleSave() {
        var group_name = this.state.group_name;
        if(group_name==null||group_name==""){
            $("#tag_dialog_bg .input input").addClass("warning");
            return;
        }
        else{
            $("#tag_dialog_bg .input input").removeClass("warning");
        }

        var successcb = function (csGroup, txtStatus, xhr) {
            if (xhr.status == 200) {
                this.props.onAfterSaveGroup();
            }
        };
        var actionType = this.state.actionType;
        if (actionType == 'new_group') {
            TeamAndGroupApiUtil.createNewGroup(group_name, successcb.bind(this));
        }
        if (actionType == 'modify_group') {
            var group_id = this.state.group_id;
            TeamAndGroupApiUtil.updateGroupInfo(group_id, group_name, successcb.bind(this));
        }
    }

    handleCancel() {
        this.props.onCancelGroup();
    }

    changeGroupName(event) {
        this.state.group_name = event.target.value;
        this.forceUpdate();
    }
    handleInputKeyPress(event) {
        this.state.code = 0;
        this.state.message = "";
        this.forceUpdate();
        if(event.keyCode === 13) {
            this.handleSave(event);
        }
    }

    render() {
        var head_h3_text = '';
        if (this.state.actionType == 'new_group') {
            head_h3_text = Lang.str('app_setting_teamAndGroup_NewGroup');
        } else {
            head_h3_text = Lang.str('app_setting_teamAndGroup_EditGroup');
        }
        return (
            <div id="tag_dialog_bg">
                <div id="tag_dialog">
                    <header>
                        <h3>{head_h3_text}</h3>
                        <a className="close" onClick={this.handleCancel.bind(this)}/>
                    </header>

                    <div name={head_h3_text} className="divGroupName">
                        <ul className="info">
                            <li>
                                <span className="tit anotherWidth">{Lang.str('app_setting_teamAndGroup_groupName')}</span>
                                <span className="input">
                                    <input type="text" name="group_name" maxLength="25" onChange={this.changeGroupName.bind(this)} value={this.state.group_name} onKeyDown={this.handleInputKeyPress.bind(this)}/>
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className="btn-container btn-container11">
                        <button onClick={this.handleSave.bind(this)}>{Lang.str('app_setting_teamAndGroup_Save')}</button>
                        <button onClick={this.handleCancel.bind(this)}>{Lang.str('app_setting_teamAndGroup_Cancel')}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default NewGroup;