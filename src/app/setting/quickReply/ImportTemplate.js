/**
 * Created by jamin on 16/1/23.
 */
import React from 'react'
import Lang from "lang/Lang"

export class ImportTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {tag:props.tag, fileToLoad:null};
    }
    onClose() {
        this.props.dialogHandler('x');
    }
    onSave() {
        if (this.state.fileToLoad == null) {
            return
        }
        var file = this.state.fileToLoad
        this.props.sendFileHandler(file);
        this.props.dialogHandler('x')
    }

    uploadFile(event){
        this.state.fileToLoad = event.target.files[0];
    }
    getInputName(event) {
        this.state.newcategory = event.target.value;
        this.forceUpdate();
    }
    render() {
        return (
            <div id="tag_dialog_bg" style={{opacity:this.state.opacity}}>
                <div id="tag_dialog">
                    <header>
                        <h3>{Lang.str('app_setting_quickReply_ImportReply')}</h3>
                        <a className="close" onClick={this.onClose.bind(this)}></a>
                    </header>
                    <div>
                        <form>
                            <ul className="info">
                                <li>
                                <span className="input">
                                <input ref="uploadFile"
                                    type="file" accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={this.uploadFile.bind(this)} />
                                </span>
                                </li>
                            </ul>
                        </form>
                    </div>
                    <div className="btn-container">
                        <button onClick={this.onSave.bind(this)}>{Lang.str('app_setting_quickReply_Import')}</button>
                        <button onClick={this.onClose.bind(this)}>{Lang.str('app_setting_quickReply_Cancel')}</button>
                    </div>
                </div>
            </div>
        );
    }
}