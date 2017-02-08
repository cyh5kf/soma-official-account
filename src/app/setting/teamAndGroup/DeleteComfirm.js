import React from 'react'
import Lang from "lang/Lang"

export class DeleteComfirm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleCancel() {
        this.props.onAfterCancel();
        return false;
    }

    handleDelete() {
        var csAgent = this.props.csAgent
        this.props.onAfterDeleteComfirm(csAgent);
        return false;
    }

    render() {
        return (
            <div id="tag_dialog_bg">
                <div id="tag_dialog">
                    <header>
                        <h3>{Lang.str('app_setting_teamAndGroup_Delete')}</h3>
                        <a className="close" onClick={this.handleCancel.bind(this)}/>
                    </header>
                    <div className="deleteContent">
                        <p className="remind">{Lang.str('app_setting_teamAndGroup_deleteComfirm ')}</p>
                        <p className="deleteText">{Lang.str('app_setting_teamAndGroup_DeleteCustomerServiceDesc')}</p>
                    </div>
                    <div className="btn-container">
                        <button onClick={this.handleDelete.bind(this)}>{Lang.str('app_article_confirm')}</button>
                        <button onClick={this.handleCancel.bind(this)}>{Lang.str('app_setting_teamAndGroup_Cancel')}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default DeleteComfirm;