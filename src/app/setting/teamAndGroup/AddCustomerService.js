import React from 'react'
import TeamAndGroupApiUtil from 'app/setting/teamAndGroup/TeamAndGroupApiUtil'
import Lang from "lang/Lang"
import $ from "jquery"
import {Session} from 'app/Session'

export class AddCustomerService extends React.Component {
    constructor(props) {
        super(props);
        this.state = {"isShowDialog":false};
    }

    componentDidMount() {
        var role= 0;
        this.props.modifyInfo.group_id = this.props.csGroup.group_id;
        var actionType = this.props.actionType;
        if (actionType == 'modify_customer') {
            var role = this.props.modifyInfo.role;
            this.props.modifyInfo.is_admin = role === 1;
        }
        else{
            this.props.modifyInfo.service_ceiling = 20;
            this.props.modifyInfo.role = 0;
            this.props.modifyInfo.is_admin = false;
        }
        var successcb = function (csGroups, txtStatus, xhr) {
            if (xhr.status = 200) {
                this.props.onFirstClick();
                this.state.isShowDialog = true;
                this.props.csGroups = csGroups;
                $("input[name='email']").attr({"autocomplete":"off"});
                $("input[name='password']").attr({"autocomplete":"off","maxlength":"16"});
                $("input[name='confirm_password']").attr({"autocomplete":"off","maxlength":"16"});
                this.forceUpdate();
            }
        };
        TeamAndGroupApiUtil.getInitialTeamAndGroup(successcb.bind(this));
    }

    handleChange(event) {        
        var targetName = event.target.name;
        var targetValue = event.target.value;
        if (targetName == "email") {
            if (targetValue.length <= 64) {
                this.props.modifyInfo[targetName] = targetValue;
                this.forceUpdate();
            }
        }else if (targetName == 'csid') {
            if (targetValue.length <= 8) {
                this.props.modifyInfo[targetName] = targetValue.replace(/\s/g,"");
                this.forceUpdate();
            }
        }else if (targetName == 'password') {                
                this.props.modifyInfo[targetName] = targetValue.replace(/\s/g,"");
                this.forceUpdate();

        }else if (targetName == 'confirm_password') {                
                this.props.modifyInfo[targetName] = targetValue.replace(/\s/g,"");
                this.forceUpdate();

        } else if (targetName == 'service_ceiling') {
            if (targetValue&&!isNaN(targetValue)) {
                this.props.modifyInfo[targetName] = parseInt(targetValue)+'';
                this.forceUpdate();
            }
            else{
                this.props.modifyInfo[targetName] = targetValue.replace(/\D/gi,"");
                this.forceUpdate();
            }
        }
        else {
            this.props.modifyInfo[targetName] = targetValue;
            this.forceUpdate();
        }
    }

    handleGroupId(event) {
        this.props.modifyInfo[event.target.name] = event.target.options[event.target.selectedIndex].id;
        this.forceUpdate();
    }
    onTimeSelect(id,name){
        $('#div_time button').html(name);
        $('#time_container').slideToggle();

        this.props.modifyInfo.group_id = id;
        this.forceUpdate();
    }
    handleAccountType(is_admin) {
        if (is_admin) {
            this.props.modifyInfo.role = 1;
            this.props.modifyInfo.is_admin = true;
        } else {
            this.props.modifyInfo.role = 0;
            this.props.modifyInfo.is_admin = false;
        }
        this.forceUpdate();
    }

    handleSave() {        
        var aid = this.props.modifyInfo.aid;
        var email = this.props.modifyInfo.email;
        var password = this.props.modifyInfo.password;
        var confirm_password = this.props.modifyInfo.confirm_password;
        var tmpName = this.props.modifyInfo.name;
        if (typeof(tmpName) == "undefined") { 
            tmpName = "";
        }           
        var name = tmpName.replace(/(^\s*|\s*$)/g,"");
        var csid = this.props.modifyInfo.csid;
        var service_ceiling = this.props.modifyInfo.service_ceiling+"";
        var role = this.props.modifyInfo.role;
        var group_id = this.props.modifyInfo.group_id;

        //初始化
        $("#tag_dialog .errorMsg").html("");
        $("input").removeClass("errorInput");

        var emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if(!email){
            $("#tag_dialog .errorMsg").html(Lang.str("app_setting_teamAndGroup_fieldEmpty"));
            $("input[name='email']").addClass("errorInput");
            return false;
        }else{
            if(!emailReg.test(email)){
                $("#tag_dialog .errorMsg").html(Lang.str("app_setting_SetEditorTeam_SettingEamilCheck"));
                $("input[name='email']").addClass("errorInput");
                return false;
            }
        }
        if(this.props.actionType == 'reset_passwd' || this.props.actionType =="add_customer"){
            if(!password){
                $("#tag_dialog .errorMsg").html(Lang.str("app_setting_teamAndGroup_fieldEmpty"));
                $("input[name='password']").addClass("errorInput");
                return false;
            }else{
                var len=password.length;
                if(len<6 || len>16){
                    $("#tag_dialog .errorMsg").html(Lang.str("app_setting_SetEditorTeam_SettingPasswordLengthCheck"));
                    $("input[name='password']").addClass("errorInput");
                    return false;
                }
            }
            if(!confirm_password){
                $("#tag_dialog .errorMsg").html(Lang.str("app_setting_teamAndGroup_fieldEmpty"));
                $("input[name='confirm_password']").addClass("errorInput");
                return false;
            }else{
                if(confirm_password!=password){
                    $("#tag_dialog .errorMsg").html(Lang.str("app_setting_SetEditorTeam_SettingPasswordCheck"));
                    $("input[name='confirm_password']").addClass("errorInput");
                    return false;
                }
            }
        }

        if(!name){
            $("#tag_dialog .errorMsg").html(Lang.str("app_setting_teamAndGroup_fieldEmpty"));
            $("input[name='name']").addClass("errorInput");
            return false;
        }
        if(!service_ceiling||isNaN(service_ceiling)){
            $("#tag_dialog .errorMsg").html(Lang.str("app_setting_teamAndGroup_fieldEmpty"));
            $("input[name='service_ceiling']").addClass("errorInput");
            return false;
        }
        else if((!isNaN(service_ceiling))&&parseInt(service_ceiling)>50){
            $("#tag_dialog .errorMsg").html(Lang.str("app_setting_teamAndGroup_serviceCeilingOut",50));
            $("input[name='service_ceiling']").addClass("errorInput");
            return false;
        }


        var successcb = function (data, txtStatus, xhr) {
            if (xhr.status == 200) {
                if(actionType == 'add_customer'){
                    $.messageBox({message:Lang.str('app_setting_teamAndGroup_repAdded'),level: "success"});
                } else {
                    $.messageBox({message:Lang.str('app_setting_teamAndGroup_changeSaved'),level: "success"});
                }

                this.props.onAfterSaveCustomer();
                if (aid == Session.getAid()){
                    Session.setName(name);
                    var csGroups = this.props.modifyInfo.csGroups;
                    var groupName="";
                    for (var idx in csGroups) {
                        var csGroup = csGroups[idx];
                        if (group_id == csGroup.group_id) {
                            groupName=csGroup.name;
                            Session.setGroupId(group_id);
                            Session.setGroupName(groupName);
                            return;
                        }
                    }
                }
            }

            if(xhr.status==207){
                $("#tag_dialog .errorMsg").html(Lang.str("app_setting_teamAndGroup_emailExists"));
                $("input[name='email']").addClass("errorInput");
            }
        };

        var reqdata = {
            aid: aid,
            email: email,
            password: password,
            name: name,
            csid: csid,
            service_ceiling: service_ceiling,
            role: role,
            group_id: group_id
        };

        var actionType = this.props.actionType;
        if (actionType == 'add_customer') {
            TeamAndGroupApiUtil.createNewAgent(reqdata, successcb.bind(this));
        } else {
            TeamAndGroupApiUtil.updateAgentInfo(reqdata, successcb.bind(this));
        }

    }

    serviceLimitKeyup(e){
        var obj = e.target;
        obj.value=obj.value.replace(/\D/gi,"");
    }

    onTimeClick() {
        $('#time_container').slideToggle();
        return false;
    }
    handleReset() {
        this.props.actionType = 'reset_passwd';
        this.forceUpdate(function () {
            $("input[name='email']").attr({"autocomplete":"off"});
            $("input[name='password']").attr({"autocomplete":"off","maxlength":"16"});
            $("input[name='confirm_password']").attr({"autocomplete":"off","maxlength":"16"});
        }.bind(this));

    }

    changeToPassword(e){
        if (e.target.type==='text') {
            $(e.target).attr({"type": "password"});
        }
    }

    handleCancel() {
        this.props.onCancelCustomer();
    }
    handleInputKeyPress(event) {
        this.state.code = 0;
        this.state.message = "";
        this.forceUpdate();
        if(event.keyCode === 13) {
            this.handleSave(event);
        }
    }

    clickHide() {
        $('#time_container').slideUp();
        return false;
    }


    render() {
        var header_text_h3_text = Lang.str('app_setting_teamAndGroup_EditCustomerService');
        if (this.props.actionType == 'add_customer') {
            header_text_h3_text = Lang.str('app_setting_teamAndGroup_AddCustomerService');
        }
        var password_dom = '';
        var confirm_password_dom = '';
        var reset_dom = '';
        var group_select_doms = [];
        var delete_customer_dom = '';
        var group_id = this.props.modifyInfo.group_id;
        var csGroups = this.props.csGroups;
        var groupName="";
        var optionsLi=[];
        for (var idx in csGroups) {
            var csGroup = csGroups[idx];
            var selected = false;
            if (group_id == csGroup.group_id) {
                selected = true;
                groupName=csGroup.name;
            }
            group_select_doms.push(<option id={csGroup.group_id} selected={selected}>{csGroup.name}</option>);
            optionsLi.push(<a onClick={this.onTimeSelect.bind(this, csGroup.group_id,csGroup.name)}>{csGroup.name}</a>);
        }
        var isHiddenPsd="";
        var hiddenClass="hidden";
        if(this.props.peopleRole=="9"){
            hiddenClass="hidden";
            isHiddenPsd="hidden";
        }
        if (this.props.actionType == 'add_customer' || this.props.actionType == 'reset_passwd') {
            password_dom = <li>
                <span className="tit">{Lang.str('app_setting_teamAndGroup_Password')}</span>
                <span className="input">
                    <input type="text" className="anotherWidth" maxlength="16" name="password" value={this.props.modifyInfo.password}
                           onFocus={this.changeToPassword.bind(this)}
                           onChange={this.handleChange.bind(this)}
                           onKeyDown={this.handleInputKeyPress.bind(this)}/>
                    <em>*</em>
                </span>
            </li>;
            confirm_password_dom = <li>
                <span className="tit">{Lang.str('app_setting_teamAndGroup_ConfirmPassword')}</span>
                <span className="input">
                    <input type="text" className="anotherWidth" maxlength="16" name="confirm_password" value={this.props.modifyInfo["confirm_password"]}
                           onFocus={this.changeToPassword.bind(this)}
                           onChange={this.handleChange.bind(this)}
                           onKeyDown={this.handleInputKeyPress.bind(this)}/>
                    <em>*</em>
                </span>
            </li>;
        } else if (this.props.actionType == 'modify_customer') {
            password_dom = <li className={isHiddenPsd}>
                <span className="tit">{Lang.str('app_setting_teamAndGroup_Password')}</span>
                <span style={{display: 'block',paddingTop: '2px',height: '29px'}} className="input inputPwd-finished">
                    <input className="psword-noborder anotherWidth" type="password" name="password" value="********" disabled="disabled" onKeyDown={this.handleInputKeyPress.bind(this)}/>
                </span>
            </li>;
            reset_dom = <li className={"pwdResetLine "+isHiddenPsd}>
                <label className="pwdReset" onClick={this.handleReset.bind(this)}>{Lang.str('app_setting_teamAndGroup_Reset')}</label>
            </li>;
        }


        return (
            <div id="tag_dialog_bg" className={this.state.isShowDialog?'':'hidden'}>
                <div id="tag_dialog" onClick={this.clickHide}>
                    <header>
                        <h3>{header_text_h3_text}</h3>
                        <a className="close" onClick={this.handleCancel.bind(this)}/>
                    </header>

                    <form name={header_text_h3_text}>
                        <ul className="info">
                            <li>
                                <span className="tit">{Lang.str('app_setting_teamAndGroup_RegisteredEmail')}</span>
                                <span className="input">
                                    <input type="text" className="anotherWidth" name="email" value={this.props.modifyInfo.email} autocomplete="off" onChange={this.handleChange.bind(this)} onKeyDown={this.handleInputKeyPress.bind(this)}/>
                                    <em>*</em>
                                </span>
                            </li>
                            {password_dom}
                            {confirm_password_dom}
                            {reset_dom}
                            <li className="groupName">
                                <span className="tit">{Lang.str('app_setting_teamAndGroup_Name')}</span>
                                <span className="input">
                                    <input type="text" className="anotherWidth" name="name" value={this.props.modifyInfo.name} onChange={this.handleChange.bind(this)} onKeyDown={this.handleInputKeyPress.bind(this)}/>
                                    <em>*</em>
                                </span>
                            </li>

                            <li>
                                <span className="tit">{Lang.str('app_setting_teamAndGroup_Id')}</span>
                                <span className="input">
                                    <input type="text" className="anotherWidth" name="csid" value={this.props.modifyInfo.csid} onChange={this.handleChange.bind(this)} onKeyDown={this.handleInputKeyPress.bind(this)}/>
                                </span>
                            </li>

                            <li>
                                <span className="tit">{Lang.str('app_setting_teamAndGroup_ServiceLimit')}</span>
                                <span className="input-short input">
									 <input type="text" name="service_ceiling" value={this.props.modifyInfo.service_ceiling} onChange={this.handleChange.bind(this)} onKeyUp={this.serviceLimitKeyup.bind(this)}/>                                    <em>*</em>
                                </span>
                                <p className="limitExplain">{Lang.str('app_setting_teamAndGroup_ServiceLimitDesc')}</p>
                            </li>

                            <li>
                                <span className="tit">{Lang.str('app_setting_teamAndGroup_Group')}</span>
                                <label className="settingRadio">
                                    <select className="hidden" name="group_id" onChange={this.handleGroupId.bind(this)} onKeyDown={this.handleInputKeyPress.bind(this)}>
                                    {group_select_doms}
                                    </select>
                                    <div className="dropdown" id="div_time">
                                        <div className="time" id="button_time" onClick={this.onTimeClick}>{groupName}</div>
                                        <div className="dropdown-container" id="time_container">
                                            <ul>
                                                {optionsLi}
                                            </ul>
                                        </div>
                                    </div>
                                </label>
                            </li>

                            <li className={hiddenClass}>
                                <span className="tit">{Lang.str('app_setting_teamAndGroup_AccountType')}</span>
                                <label className="settingRadio">
                                    <input type="radio" name="accountType" onClick={this.handleAccountType.bind(this, true)} checked={this.props.modifyInfo.is_admin}/>
                                    <span>{Lang.str('app_setting_teamAndGroup_Administrator')}</span>
                                    <input type="radio" name="accountType" onClick={this.handleAccountType.bind(this, false)} checked={!this.props.modifyInfo.is_admin}/>
                                    <span>{Lang.str('app_setting_teamAndGroup_NormalStaff')}</span>
                                </label>
                            </li>
                        </ul>
                    </form>
                    <p className="errorMsg"></p>
                    <div className="btn-container btn-container7">
                        <button onClick={this.handleSave.bind(this)}>{Lang.str('app_setting_teamAndGroup_Save')}</button>
                        <button onClick={this.handleCancel.bind(this)}>{Lang.str('app_setting_teamAndGroup_Cancel')}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddCustomerService;