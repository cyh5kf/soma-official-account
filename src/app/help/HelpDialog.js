/**
 * Created by jamin on 16/1/23.
 */
import React from 'react'
import {TagColorCenter} from 'utils/TagColorCenter'
import Lang from "lang/Lang"
import $ from "jquery"

export class HelpDialog extends React.Component {
    constructor(props) {
        super(props);
       //this.state = {urlSrc: this.props.urlSrc};
    }
    onClose() {
        this.props.dialogHandler('x');
    }
    
    componentDidMount(){
        var urlHelpDoc = "https://d51wm8y7a2ot9.cloudfront.net/official-account/doc/SOMA-Public-Account-Guide-"+Lang.str("app_lang")+"-v3.pdf";
        $('#a_dlHelp').attr('href', urlHelpDoc);
        $('#a_dlHelp').attr('download', urlHelpDoc);
    }

    render() {       
        var tableContent = [];
 
        return (
            <div id="tag_dialog_bg">
                <div id="tag_dialog" className="helpDlg">
                    <header>
                        <h3>{Lang.str('app_home_dlg_Download')}</h3>
                        <a className="close" onClick={this.onClose.bind(this)}></a>
                    </header>

                    <div className="home-his-list-div help-content-div" id="dialog">
                        <span className="downloadTemps">{Lang.str('app_home_dlg_Download')} <span className="template_name">{Lang.str("app_Help_File") + " ?"}</span></span>                            
                    </div>


                    <div className="btn-container btn-container3">
                        <a className="download" href="" id="a_dlHelp" onClick={this.onClose.bind(this)}>{Lang.str('app_home_dlg_Download')}</a>
                        
                        <button onClick={this.onClose.bind(this)}>{Lang.str('app_setting_personalInformation_Cancel')}</button>
                    </div>
                </div>
            </div>
        );
    }
}
