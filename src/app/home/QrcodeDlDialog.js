/**
 * Created by jamin on 16/1/23.
 */
import React from 'react'
import {TagColorCenter} from 'utils/TagColorCenter'
import Lang from "lang/Lang"

export class QrcodeDlDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {urlSrc: this.props.urlSrc};
    }
    onClose() {
        this.props.dialogHandler('x');
    }

    downloadQrCode(url){
       this.props.downloadHandler(url);
    }

    render() {
        var sizeList = [],
            disList = [],
            urlList = [];

        sizeList.push("8cm");
        sizeList.push("12cm");
        sizeList.push("15cm");
        sizeList.push("30cm");
        sizeList.push("50cm");

        disList.push("0.5m");
        disList.push("0.8m");
        disList.push("1m");
        disList.push("1.5m");
        disList.push("2.5m");

        urlList.push(this.state.urlSrc + "&size=258");
        urlList.push(this.state.urlSrc + "&size=344");
        urlList.push(this.state.urlSrc + "&size=430");
        urlList.push(this.state.urlSrc + "&size=860");
        urlList.push(this.state.urlSrc + "&size=1280");


        var tableContent = [];
        for(var i=0,len=urlList.length;i<len;i++){
            tableContent.push(
            <tr >
                <td>{sizeList[i]}</td>
                <td>{disList[i]}</td>
                <td>
                    <a className="click-download"  href="#" onClick={this.downloadQrCode.bind(this, urlList[i])}>{Lang.str('app_home_dlg_Download')}</a>
                </td>
            </tr>
            );
        }

        return (
            <div id="tag_dialog_bg">
                <div id="tag_dialog">
                    <header>
                        <h3>{Lang.str('app_home_Download')}</h3>
                        <a className="close" onClick={this.onClose.bind(this)}></a>
                    </header>

                    <div className="home-his-list-div" id="dialog">
                            <table className="home-his-list" id="tb-dialog">
                                    <thead>
                                        <tr>
                                            <td>{Lang.str('app_home_dlg_QrCode')}</td>
                                            <td>{Lang.str('app_home_dlg_Description')}</td>
                                            <td>{Lang.str('app_home_dlg_Operation')}</td>
                                        </tr>
                                    </thead>
                                <tbody>
                                    {tableContent}
                                </tbody>
                        </table>
                    </div>


                    <div className="btn-container btn-container3">
                        <button onClick={this.onClose.bind(this)}>{Lang.str('app_home_dlg_Close')}</button>
                    </div>
                </div>
            </div>
        );
    }
}
