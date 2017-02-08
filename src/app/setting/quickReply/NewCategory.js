/**
 * Created by jamin on 16/1/23.
 */
import React from 'react'
import Lang from "lang/Lang"

export class NewCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {newcategory: ""};
    }
    onClose() {
        this.props.dialogHandler('x');
    }
    onSave() {
        var target = $(event.target);
        if (!target.hasClass("disable")){
            target.addClass("disable");
            if(!this.state.newcategory) {
                $("#tag_dialog_bg .input input").addClass("warning");
                target.removeClass("disable");
                return;
            }
            console.log("add new category  to:" + this.state.newcategory);
            this.props.eventHandler('a', this.state.newcategory);
            target.removeClass("disable");
        }
    }

    getInputName(event) {
        this.state.newcategory = event.target.value;
        //this.forceUpdate();
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
                           maxLength="20"
                           onChange={this.getInputName.bind(this)}
                           onKeyDown={this.handleInputKeyPress.bind(this)}/>

        return (
            <div id="tag_dialog_bg" style={{opacity:this.state.opacity}}>
                <div id="tag_dialog">
                    <header>
                        <h3>{Lang.str('app_setting_quickReply_NewCategory')}</h3>
                        <a className="close" onClick={this.onClose.bind(this)}></a>
                    </header>
                    <div>
                        <ul className="info info4">
                            <li>
                                <span className="tagName tagName3">{Lang.str('app_setting_quickReply_AddCategory')}</span>
                                <span className="input">
                                    {inputText}
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className="btn-container btn-container5">
                        <button onClick={this.onSave.bind(this)}>{Lang.str('app_setting_quickReply_Save')}</button>
                        <button onClick={this.onClose.bind(this)}>{Lang.str('app_setting_quickReply_Cancel')}</button>
                    </div>
                </div>
            </div>
        );
    }
}