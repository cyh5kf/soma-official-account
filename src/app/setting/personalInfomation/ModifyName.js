/**
 * Created by jamin on 16/1/23.
 */
import React from 'react'
import {TagColorCenter} from 'utils/TagColorCenter'
import Lang from "lang/Lang"

export class ModifyName extends React.Component {
    constructor(props) {
        super(props);
        this.state = {newemail: this.props.name};
    }
    onClose() {
        this.props.dialogHandler('x');
    }
    onSave() {
        if(this.state.newemail == "") {
            $(".tagNameIuput").addClass("warning");
            return;
        }
        console.log("modify email to:" + this.state.newemail);
        this.props.eventHandler('a', this.state.newemail);
    }

    getInputName(event) {
        var val = event.target.value;
        this.state.newemail = val.replace(/(^\s*|\s*$)/g,"");
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
        var inputText = "";
        inputText = <input type="text" autocomplete="off"
                           className="tagNameIuput"
                           defaultValue={this.props.name}
                           maxLength="25"
                           onChange={this.getInputName.bind(this)}
                           onKeyDown={this.handleInputKeyPress.bind(this)}/>
        return (
            <div id="tag_dialog_bg" style={{opacity:this.state.opacity}}>
                <div id="tag_dialog">
                    <header>
                        <h3>{Lang.str('app_setting_personalInformation_ModifyName')}</h3>
                        <a className="close" onClick={this.onClose.bind(this)}></a>
                    </header>

                    <div>
                        <ul className="info info2">
                            <li>
                                <span className="tagName tagName2 tagTitle">{Lang.str('app_setting_personalInformation_NewName')}</span>
                                <span className="input">
                                    {inputText}
                                    <em>*</em>
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className="btn-container btn-container3">
                        <button className="btn_save disabled" onClick={this.onSave.bind(this)}>{Lang.str('app_setting_personalInformation_Save')}</button>
                        <button onClick={this.onClose.bind(this)}>{Lang.str('app_setting_personalInformation_Cancel')}</button>
                    </div>
                </div>
            </div>
        );
    }
}
