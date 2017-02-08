/**
 * Created by jamin on 16/1/23.
 */
import React from 'react'
import {TagColorCenter} from 'utils/TagColorCenter'

export class ModifyId extends React.Component {
    constructor(props) {
        super(props);
        this.state = {newemail: ""};
    }
    onClose() {
        this.props.dialogHandler('x');
    }
    onSave() {
        if(this.state.newemail == "") {
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
        inputText = <input type="text"
                           placeholder="ID" maxLength="100"
                           onChange={this.getInputName.bind(this)}/>
        return (
            <div id="tag_dialog_bg" style={{opacity:this.state.opacity}}>
                <div id="tag_dialog">
                    <header>
                        <h3>Modify Id</h3>
                        <a className="close" onClick={this.onClose.bind(this)}></a>
                    </header>

                    <ul>{inputText}</ul>
                    <div className="btn-container">
                        <button onClick={this.onSave.bind(this)}>Save</button>
                        <button onClick={this.onClose.bind(this)}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}
