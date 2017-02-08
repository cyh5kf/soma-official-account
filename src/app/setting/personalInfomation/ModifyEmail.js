/**
 * Created by jamin on 16/1/23.
 */
import React from 'react'
import Lang from "lang/Lang"

export class ModifyEmail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {newemail: ""};
    }
    onClose() {
        this.props.dialogHandler('x');
    }
    checkEmail(email) {
        var validEmailStyle = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        return validEmailStyle.test(email)
    }

    onSave() {
        if(this.state.newemail == "") {
            return;
        }
        if (this.checkEmail(this.state.newemail) != true) {
            //alert(Lang.str('app_setting_personalInformation_InvalidEmail'));
            $.messageBox({message:Lang.str('app_setting_personalInformation_InvalidEmail'),level: "error"});
            return;
        }
        console.log("modify email to:" + this.state.newemail);
        this.props.eventHandler('a', this.state.newemail);
    }

    getInputName(event) {
        this.state.newemail = event.target.value;
        this.forceUpdate();
    }

    render() {
        var inputText = "";
        inputText = <input type="email"
                           placeholder={Lang.str('app_setting_personalInformation_NewEmail')} maxLength="100"
                           defaultValue={this.props.email}
                           onChange={this.getInputName.bind(this)}/>
        return (
            <div id="tag_dialog_bg">
                <div id="tag_dialog">
                    <header>
                        <h3>{Lang.str('app_setting_personalInformation_ModifyEmail')}</h3>
                        <a className="close" onClick={this.onClose.bind(this)}></a>
                    </header>
                    <form>
                        <ul className="info">
                            <li>
                                <span className="input">
                                    {inputText}
                                    <em>*</em>
                                </span>
                            </li>
                        </ul>
                    </form>
                    <div className="btn-container">
                        <button onClick={this.onSave.bind(this)}>{Lang.str('app_setting_personalInformation_Save')}</button>
                        <button onClick={this.onClose.bind(this)}>{Lang.str('app_setting_personalInformation_Cancel')}</button>
                    </div>
                </div>
            </div>
        );
    }
}
