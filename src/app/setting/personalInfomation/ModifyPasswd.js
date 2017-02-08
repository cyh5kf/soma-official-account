/**
 * Created by jamin on 16/1/23.
 */
import React from 'react'
import Lang from "lang/Lang"
import $ from 'jquery'

export class ModifyPasswd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {newpasswd: "", passwd:"", verifypasswd:""};
    }

    componentDidMount() {
        $("input[type='password']").attr({"autocomplete":"off"});
    }

    onClose() {
        console.log("exit");
        this.props.dialogHandler('x');
    }
    onSave() {
        $("#tag_dialog input").removeClass("warning");
        if(this.state.passwd == ''){
            //如果输入为空,则显示提示:The field cannot be empty!
            $("#tag_dialog .messageBox").removeClass("hidden").html(Lang.str('app_setting_SetEditorTeam_SettingEmptyTip'));
            $(".password").addClass("warning");
            return;
        }
        else if(this.state.passwd.length <6 || this.state.passwd.length > 16){
            $(".password").addClass("warning");
            $("#tag_dialog .messageBox").removeClass("hidden").html(Lang.str('app_setting_personalInformation_PasswordLengthInvalid'));
            return;
        }
        else{
            $(".password").removeClass("warning");
            $("#tag_dialog .messageBox").addClass("hidden").html('');
        }

        if(this.state.newpasswd == ''){
            //如果输入为空,则显示提示:The field cannot be empty!
            $("#tag_dialog .messageBox").removeClass("hidden").html(Lang.str('app_setting_SetEditorTeam_SettingEmptyTip'));
            $(".newpasswd").addClass("warning");
            return;
        }else if(this.state.newpasswd.length <6 || this.state.newpasswd.length > 16){
            $(".newpasswd").addClass("warning");
            $("#tag_dialog .messageBox").removeClass("hidden").html(Lang.str('app_setting_personalInformation_PasswordLengthInvalid'));
            return;
        }else{
            $(".newpasswd").removeClass("warning");
            $("#tag_dialog .messageBox").addClass("hidden").html('');
        }

        if(this.state.verifypasswd == ''){
            //如果输入为空,则显示提示:The field cannot be empty!
            $("#tag_dialog .messageBox").removeClass("hidden").html(Lang.str('app_setting_SetEditorTeam_SettingEmptyTip'));
            $(".verifypasswd").addClass("warning");
            return;
        }else if(this.state.verifypasswd != this.state.newpasswd){
            $(".verifypasswd").addClass("warning");
            $("#tag_dialog .messageBox").removeClass("hidden").html(Lang.str('app_setting_personalInformation_PasswordNotSame'));
            return;
        }
        else{
            $("#tag_dialog .messageBox").addClass("hidden").html('');
            $(".verifypasswd").removeClass("warning");
        }
        this.props.eventHandler('a', this.state.passwd, this.state.newpasswd);
    }

    changeToPassword(e){
        if (e.target.type==='text'){
            $(e.target).attr({"type":"password"});
        }
    }

    getpasswd(event) {
        this.state.passwd = event.target.value.replace(/\s/g,"");
        this.forceUpdate();
    }
    getnewpasswd(event){
        this.state.newpasswd = event.target.value.replace(/\s/g,"");
        this.forceUpdate();
    }
    getverifypasswd(event) {
        this.state.verifypasswd = event.target.value.replace(/\s/g,"");
        this.forceUpdate();
    }
    handleInputKeyPress(event) {
        this.state.code = 0;
        this.state.message = "";
        this.forceUpdate();
        if(event.keyCode === 13) {
            this.onSave(event);
        }
    }

    render() {
        var input_passwd = <input type="text"
                                  className="password"
                                  maxLength="16"
                                  value={this.state.passwd}
                                  onFocus={this.changeToPassword.bind(this)}
                                  onChange={this.getpasswd.bind(this)}
                                  onKeyDown={this.handleInputKeyPress.bind(this)}/>
        var input_newpasswd = <input type="text"
                                     autocomplete="off"
                                     className="newpasswd"
                                     maxLength="16"
                                     value={this.state.newpasswd}
                                     onFocus={this.changeToPassword.bind(this)}
                                     onChange={this.getnewpasswd.bind(this)}
                                     onKeyDown={this.handleInputKeyPress.bind(this)}/>
        var input_verifypasswd = <input type="text"
                                        autocomplete="off"
                                        className="verifypasswd"
                                        maxLength="16"
                                        value={this.state.verifypasswd}
                                        onFocus={this.changeToPassword.bind(this)}
                                        onChange={this.getverifypasswd.bind(this)}
                                        onKeyDown={this.handleInputKeyPress.bind(this)}/>
        return (
            <div id="tag_dialog_bg" style={{opacity:this.state.opacity}}>
                <div id="tag_dialog">
                    <header>
                        <h3>{Lang.str('app_setting_personalInformation_ModifyPassword')}</h3>
                        <a className="close" onClick={this.onClose.bind(this)}></a>
                    </header>

                    <form>
                        <ul className="info info3">
                            <li>
                                <span className="tagName">{Lang.str('app_setting_personalInformation_OldPassword')}</span>
                                <span className="input">
                                    {input_passwd}
                                    <em>*</em>
                                </span>
                            </li>
                            <li>
                                <span className="tagName">{Lang.str('app_setting_personalInformation_NewPassword')}</span>
                                <span className="input">
                                    {input_newpasswd}
                                    <em>*</em>
                                </span>
                            </li>
                            <li>
                                <span className="tagName">{Lang.str('app_setting_personalInformation_ConfirmNewPassword')}</span>
                                <span className="input">
                                    {input_verifypasswd}
                                    <em>*</em>
                                </span>
                            </li>
                            <li className="messageBox hidden">

                            </li>
                        </ul>
                    </form>
                    <div className="btn-container btn-container2">
                        <button onClick={this.onSave.bind(this)}>{Lang.str('app_setting_personalInformation_Save')}</button>
                        <button onClick={this.onClose.bind(this)}>{Lang.str('app_setting_personalInformation_Cancel')}</button>
                    </div>

                </div>
            </div>
        );
    }
}
