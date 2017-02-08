/**
 * Created by jamin on 16/1/23.
 */
import React from 'react'
import Lang from "lang/Lang"
import $ from "jquery"

export class RenameCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {newname: this.props.name};
    }
    onClose() {
        this.props.dialogHandler('x');
    }
    onSave() {
        var target = $(event.target);
        if (!target.hasClass("disable")){
            target.addClass("disable");
            if(!this.state.newname) {
                $(".tagNameIuput").addClass("warning");
                target.removeClass("disable");
                return;
            }
            console.log("rename category  to:" + this.state.newname);
            this.props.eventHandler('a', this.state.newname);
        }
    }

    getInputName(event) {
        this.state.newname = event.target.value;
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
        inputText = <input type="text"
                           className="inputValue tagNameIuput"
                           maxLength="20"
                           onChange={this.getInputName.bind(this)}
                           onKeyDown={this.handleInputKeyPress.bind(this)}
                           defaultValue={this.props.name}/>

        return (
            <div id="tag_dialog_bg" style={{opacity:this.state.opacity}}>
                <div id="tag_dialog">
                    <header>
                        <h3>{Lang.str('app_setting_quickReply_RenameCategory')}</h3>
                        <a className="close" onClick={this.onClose.bind(this)}></a>
                    </header>
                    <div>
                        <ul className="info info4">
                            <li className="input">
                                <strong className="tagName tagName3">{Lang.str('app_setting_quickReply_AddCategory')}</strong>
                                    {inputText}
                            </li>
                        </ul>
                    </div>
                    <div className="btn-container btn-container10">
                        <button onClick={this.onSave.bind(this)}>{Lang.str('app_setting_quickReply_Save')}</button>
                        <button onClick={this.onClose.bind(this)}>{Lang.str('app_setting_quickReply_Cancel')}</button>
                    </div>
                </div>
            </div>
        );
    }
}