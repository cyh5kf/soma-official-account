/**
 * Created by chenyu on 16/4/21.
 */
import React from 'react'
import Lang from "lang/Lang"

export class Notice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleCancel() {
        this.props.onCancelNotice();
    }

    render() {
        return (
            <div id="tag_dialog_bg">
                <div id="tag_dialog">
                    <header>
                        <h3>{Lang.str('app_setting_teamAndGroup_notice')}</h3>
                        <a className="close" onClick={this.handleCancel.bind(this)}/>
                    </header>
                    <p className="noticeContent">{Lang.str('app_setting_teamAndGroup_noticeContent')}</p>
                    <div className="btn-container">
                        <button className="okBtn" onClick={this.handleCancel.bind(this)}>{Lang.str('app_setting_teamAndGroup_OK')}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Notice;