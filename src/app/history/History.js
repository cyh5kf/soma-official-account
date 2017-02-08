import React from 'react'
import RouteComponent from 'app/RouteComponent'
import $ from "jquery"
import {Session} from 'app/Session'
import {ImageThumbHelper} from 'utils/ImageThumbHelper'
import {TimeHelper} from 'utils/TimeHelper'
import CommonConstants from 'app/Const'
import HistoryChatDetail from "app/history/components/HistoryChatDetail.react"
import ChatWebAPIUtils from "app/chat/utils/ChatWebAPIUtils"
import Lang from "lang/Lang"

var ENTER_KEY_CODE = 13;
var pageCount = 10;

export class History extends RouteComponent {

    constructor(props) {
        super(props);
        this.state = {
            taids: [],
            mintime: '',
            maxtime: '',
            agentList: [],
            groupList: [],
            historyList: [],
            showDetailDialog:false,
            showMore:true
        };
    }

    closeDialog(){
        this.state.showDetailDialog = false;
        this.setState(this.state)
    }

    // 获取客服信息：所属公众号的所有客服信息?
    getAgentList(successhandler) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "/api/v1/cs/agent/getagentlist",
            async: true,
            success: successhandler
        });
    }

    // 获取组信息，以组合group-cs列表

    getGroupList(successhandler) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "/api/v1/cs/group",
            async: true,
            success: successhandler
        });
    }

    // 获取会话记录，带翻页信息
    getHistoryList(lastconvid, successhandler) {
        var now = new Date(), taids, params = {}, urlStr = '/api/v1/cs/conversation/downloadconvhistory';

        console.log(this.state)

        if (this.state.mintime) {
            params.mintime = this.state.mintime;
        }
        if (this.state.maxtime) {
            params.maxtime = this.state.maxtime;
        }
        if (this.state.taids) {
            params['taid[]']  = this.state.taids;
        }

        //var textFilter = document.getElementById("textFilter").value;
        //this.state.textfilter = textFilter;
        params.textfilter = this.state.textfilter;

        if (lastconvid) {
            if (this.state.lastmintime) {
                params.maxtime = this.state.lastmintime;
            }
            params.lastconvid  = lastconvid;
        } else {
            params.day = this.state.day;
        }
        params.count = pageCount;

        urlStr += '?day=' + this.state.day;
        urlStr += '&maxtime=' + this.state.maxtime;
        urlStr += '&mintime=' + this.state.mintime;
        for (var t in this.state.taids) {
            urlStr += '&taid[]=' + this.state.taids[t];
        }
        if (this.state.textfilter) {
            urlStr += '&textfilter=' + this.state.textfilter;
        }

        // 导出指向的链接信息？
        $('#a_export').attr('href', urlStr);

        console.log("-----------------params:");
        console.log(params);

        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: 'api/v1/cs/conversation/getconvhistory',
            data: params,
            async: true,
            success: successhandler
        });
    }

    convertTime(t) {
        var time = new Date(t),
            month = time.getMonth() + 1,
            day = time.getDate(),
            hours = time.getHours(),
            minutes = time.getMinutes(),
            seconds = time.getSeconds();
        month = month < 10 ? ('0' + month) : month;
        day = day < 10 ? ('0' + day) : day;
        hours = hours < 10 ? ('0' + hours) : hours;
        minutes = minutes < 10 ? ('0' + minutes) : minutes;
        seconds = seconds < 10 ? ('0' + seconds) : seconds;

        return time.getFullYear().toString() + '-' + month + '-' + day + '  ' + hours + ':' + minutes + ':' + seconds;
    }

    // 数据加载
    componentDidMount() {
        let that = this;
        require.ensure([], function () {
            require('static/css/reset.css');
            require('static/css/common.css');
            require('static/css/history.css');
            require('static/css/chat.css');
        }.bind(this));

        console.log("role:" + Session.getRole());
        var ids = [];
        if (Session.getRole() == CommonConstants.ROLE.ADMIN || Session.getRole() == CommonConstants.ROLE.SUPER) {
            that.state.selectButtonDisable = false;
            that.getAgentList(function (data) {
                that.state.agentList = data;
                that.setState(that.state);
            });
        } else {
            $('#div_category').hide();
            that.state.selectButtonDisable = true;
            ids.push(Session.getAid());
            that.state.taids = ids;
        }

        var mintime = TimeHelper.getTimeStamp(0)[0];
        var maxtime = TimeHelper.getTimeStamp(0)[1];
        that.state.mintime = mintime;
        that.state.maxtime = maxtime;
        that.state.day = 0;

        that.getGroupList(function (data) {
            that.state.groupList = data;
            that.setState(that.state);
        });

        that.getHistoryList(null, function (data) {
            that.state.historyList = data;
            that.setState(that.state);
        });
    }

    // 时间段选择
    onTimeClick() {
        $('#time_container').slideToggle();
    }

    onTimeSelect(e) {
        let self = this;
        var enums = [Lang.str('app_history_Today'), Lang.str('app_history_Yesterday'), Lang.str('app_history_Past7Days'), Lang.str('app_history_Past15Days'), Lang.str('app_history_Past30Days'), Lang.str('app_history_AllDays')], mintime, maxtime;
        $('#div_time button').html(enums[e]);
        $('#time_container').slideToggle();

        if (e == 0) {
            //today
            mintime = TimeHelper.getTimeStamp(0)[0];
            maxtime = TimeHelper.getTimeStamp(0)[1];
            self.state.day = 0;
        } else if (e == 1) {
            //yesterday
            mintime = TimeHelper.getTimeStamp(1)[0];
            maxtime = TimeHelper.getTimeStamp(1)[1];
            self.state.day = 1;
        } else if (e == 2) {
            //last 7 days
            mintime = TimeHelper.getTimeStamp(7)[0];
            maxtime = TimeHelper.getTimeStamp(7)[1];
            self.state.day = 7;
        } else if (e == 3) {
            //last 15 days
            mintime = TimeHelper.getTimeStamp(15)[0];
            maxtime = TimeHelper.getTimeStamp(15)[1];
            self.state.day = 15;
        } else if (e == 4){
            //last 30 days
            mintime = TimeHelper.getTimeStamp(30)[0];
            maxtime = TimeHelper.getTimeStamp(30)[1];
            self.state.day = 30;
        } else {
            // 默认所有时间,实际将时间设为10年
            //last 3650 days
            mintime = TimeHelper.getTimeStamp(3650)[0];
            maxtime = TimeHelper.getTimeStamp(3650)[1];
            self.state.day = 3650;
        }

        self.state.mintime = mintime;
        self.state.maxtime = maxtime;
        self.getHistoryList(null, function (data) {
            self.state.historyList = data;
            self.state.appendhistory = false;
            self.setState(self.state);
        });
    }

    onCategoryClick() {
        $('#category_container').slideToggle();
    }

    onCategorySelect() {
        let self = this;
        var ids = [];
        var select = "";
        $('#category_container [name = cschb]:checked').each(function(){
            ids.push($(this).data('id'));
            select += ($(this).attr("value"));
            select += ";";
        });

        if (select == "")
        {
            select = Lang.str('app_history_AllCustomer');
        }
        $("#labelSelect").text(select);

        self.state.taids = ids;
        self.getHistoryList(null, function (data) {
            self.state.historyList = data;
            self.state.appendhistory = false;
            self.setState(self.state);
        });
        $('#category_container').slideToggle();
    }

    onCsSelectAll(e){
        let self = this;
        var ids = [];

        self.state.taids = ids;
        self.getHistoryList(null, function (data) {
            self.state.historyList = data;
            self.state.appendhistory = false;
            self.setState(self.state);
        });

        var textSelect = Lang.str('app_history_AllCustomer');
        $("#labelSelect").text(textSelect);

        $("#category_container input:checkbox").prop("checked", false);
        $('#category_container').slideToggle();
    }

    //  展开翻页？
    onShowMoreClick() {
        var lastconvid = this.state.lastconvid;
        let self = this;
        self.getHistoryList(lastconvid, function (data) {
            self.state.historyList = self.state.historyList.concat(data);
            self.state.appendhistory = true;

            var newGet = 0;
            if (data){
                newGet = data.length;
            }
            if (newGet < pageCount) {
                self.state.showMore = false;
            }
            else {
                self.state.showMore = true;
            }

            self.setState(self.state);
        });
    }
    
    onClickSearchhit(){
        var self = this;
        this.state.textfilter = document.getElementById("textFilter").value;
            this.getHistoryList(null, function(data) {
                self.state.historyList = data;
                self.state.appendhistory = false;
                self.setState(self.state);
            });
    }

    //  过滤查找
    onKeyDown(event){
        var self = this;
        if (event.keyCode === ENTER_KEY_CODE) {
            event.preventDefault();
            this.state.textfilter = document.getElementById("textFilter").value;
            this.getHistoryList(null, function(data) {
                self.state.historyList = data;
                self.state.appendhistory = false;
                self.setState(self.state);
            });

            //document.getElementById("textFilter").value = "";
        }
    }

    getTimeStr(timeValue) {
        if (timeValue == null) return "0";

        if (timeValue > 0) {
            var min = parseInt(timeValue / 60);
            var sec = parseInt(timeValue % 60);
            if (sec < 10) sec = "0" + sec;
            timeValue = min + ":" + sec;
        }

        return timeValue;
    }

    ClickHistoryDetail(uid,conv_id){
        console.log("ClickHistoryDetail",uid,conv_id)
        let that = this;
        let successHandler = function(conversation){
            that.state.showDetailDialog = true;
            that.state.conversation = {
                                    uid:conversation.uid,
                                    aid:conversation.aid,
                                    somaUser:conversation.somaUser,
                                    csAgent:conversation.csAgent,
                                    startTime:conversation.start_on,
                                    msglist:conversation.msglist,
                                    end_on:conversation.end_on,
                                    source:conversation.source,
                                    oldest:conversation.oldest,
                                    latest:conversation.latest,
                            };

            that.setState(that.state);
        }
        ChatWebAPIUtils.getConversation(uid,conv_id,successHandler);
    }

    CheckGroup(gid){
        var isChecked = $('input[data-id=' + gid + ']').is(':checked');
        if(isChecked){
            $('input.' + gid).prop("checked", true);
        }
        else {
            $('input.' + gid).prop("checked", false);
        }
    }

    CheckCs(gid){
        //检查该同group所有li，全选则设备group选中，否则设置group不选中
        var allChecked = true;
        $('#category_container input.' + gid).each(function(){
            if ($(this).is(':checked') == false){
                allChecked = false;
                return false;
            }
        });
        $('input[data-id=' + gid + ']').prop("checked", allChecked);
    }

    onSwitchCsDisplay(gid){
        if($('li[value=' + gid + ']').hasClass('isShow')) {
            $('li[value=' + gid + ']').removeClass('isShow').addClass("isHidden");
        }
        else {
            $('li[value=' + gid + ']').removeClass('isHidden').addClass("isShow");
        }

        $('li.' + gid) .slideToggle();
    }

    SwitchCsDisplay(e){
        if($(e.target).attr("id")=="group_arrow") {
            return;
        }
        else if ($(e.target).attr("id")=="group_title"){
            this.onSwitchCsDisplay($(e.target).attr("value"));
        }
    }


    onHideMenuClick(e){
        if($(e.target).attr("id")!="button_time") {
            $('#time_container').hide();
        }

        if (!this.checkZone(e, "div_category")) {
            $('#category_container').hide();
        }
    }

    checkZone(e, zone) {
        var parents = $(e.target).parents();
        for (var i in parents) {
            var id = $(parents[i]).attr("id");
            if (id && id === zone) {
                return true;
            } else if (id == "main"){
                return false;
            }
        }

        return false;
    }

    getCSName(name) {
        if (!name) {
            return "Unknown";
        }

        if (name.length > 16) {
            return name.substr(0, 12) + " ...";
        }

        return name;
    }
    /*
    changeCheckedStatus(index,e){
        var customerData = this.state.agentList;
        var curTarget = $(e.currentTarget);
        if(curTarget.find("input").prop("checked")){
            curTarget.find("input").prop("checked",false);
            customerData[index].checked=false;
        }else {
            curTarget.find("input").prop("checked", true);
            customerData[index].checked=true;
        }
        return false;
    }
    */
    render(){
        var customers = [],
            histories = [],
            divDisplay = {},
            emptyResultNoteDisplay = {},
            resultDisplay={},
            customerData = this.state.agentList,
            groupData = this.state.groupList,
            historyData = this.state.historyList;
        if (this.state.appendhistory == false || this.state.appendhistory == null) {
            histories = []
        }

        //  fcj.todo: 这里做group-cs信息的组合
    for (var j in groupData) {
        var groupName = this.getCSName(groupData[j].name);
        var groupId = groupData[j].group_id;

        var countCs = 0;
        for (var i in customerData) {
            if (customerData[i].group_id != ""
                && customerData[i].group_id == groupId)
            {
                countCs++;
            }
        }

        if(countCs > 0)
        {
            customers.push(<li className="isShow" id = "group_title" value={groupId} onClick={this.SwitchCsDisplay.bind(this)}>
                <label className="group_lab" id = "group_arrow"  onClick={this.CheckGroup.bind(this, groupId)} value={groupId}>
                    <input className="groupchb" type="checkbox" value={groupData[j].name} data-id={groupId} />
                    {groupData[j].name}
                </label>
            </li>);

            for (var i in customerData) {
                if (customerData[i].group_id != ""
                    && customerData[i].group_id == groupId)
                {
                    var csName = this.getCSName(customerData[i].name);

                    customers.push(<li id="li-cs" className={customerData[i].group_id} onClick={this.CheckCs.bind(this, groupId)}><label className="chb">
                        <input className={groupId} name="cschb" type="checkbox" value={customerData[i].name} data-id={customerData[i].aid} />
                        {csName}
                    </label>
                    </li>);
                }
            }
        }
    }

        var lastconvid = 0;
        var lastmintime = this.state.mintime;
        for (var i in historyData) {
            if (!historyData[i].csAgent.avatar) {
                historyData[i].csAgent.avatar = require("static/images/common/head_sculpture.png");
            }
            if (!historyData[i].somaUser.avatar) {
                historyData[i].somaUser.avatar = require("static/images/common/head_sculpture.png");
            }

            lastconvid = historyData[i].conv_id;
            lastmintime = historyData[i].start_on;

            var avgResp;
            if (historyData[i].firstRespTime <= 0) {
                avgResp = Lang.str('app_history_NoResponse');
            } else {
                avgResp = this.getTimeStr(historyData[i].firstRespTime);
            }

            var convDuration = "";
            if (historyData[i].end_on > 0) {
                convDuration = this.getTimeStr(historyData[i].duration);
            }

            histories.push(
                <tr onClick={this.ClickHistoryDetail.bind(this,historyData[i].somaUser.uid,historyData[i].conv_id)}>
                    <td>
                        <img className="avatar-1" src={ImageThumbHelper.getSquareThumbUrlByDefaultSize(historyData[i].somaUser.avatar)}/>
                        <span>{historyData[i].somaUser.name}</span>
                    </td>
                    <td>{avgResp}</td>
                    <td>{convDuration}</td>
                    <td>
                        <i className="msgIn"></i>
                        <span className="spanInMsgNum">{historyData[i].userMsgVolume}</span>
                        <i className="msgOut"></i>
                        <span  className="spanOutMsgNum">{historyData[i].csMsgVolume}</span>
                    </td>
                    <td>{historyData[i].source}</td>
                    <td>
                        <img className="avatar-2" src={ImageThumbHelper.getSquareThumbUrlByDefaultSize(historyData[i].csAgent.avatar)}/>
                        {historyData[i].csAgent.name}
                    </td>
                    <td>{this.convertTime(historyData[i].start_on)}</td>
                </tr>);
        }
        this.state.lastconvid = lastconvid;
        this.state.lastmintime = lastmintime;

        if (historyData == null || historyData.length < pageCount) {
            divDisplay = {display:'none'};
        }
        else if (this.state.appendhistory == true && this.state.showMore == false){
            divDisplay = {display:'none'};
        }
        else {
            divDisplay = {};
        }

        if (historyData == null || historyData.length < 1)
        {
            resultDisplay = {display:'none'};
        }
        else
        {
            emptyResultNoteDisplay = {display:'none'};
        }

        console.log("lastconvid:" + lastconvid)
        console.log("lastmintime:" + lastmintime)

    	return <div id="main" onClick={this.onHideMenuClick.bind(this)}>
                <header className="his-header">
                    <h2>{Lang.str('app_history_HistoryConversation')}</h2>
                </header>
                
                <div className="his-filter">
                    <div className="dropdown" id="div_time">
                        <button className="time" id="button_time" onClick={this.onTimeClick}>{Lang.str('app_history_Today')}</button>
                        <div className="dropdown-container" id="time_container">
                            <ul>
                                <li><a onClick={this.onTimeSelect.bind(this, 5)}>{Lang.str('app_history_AllDays')}</a></li>
                                <li><a onClick={this.onTimeSelect.bind(this, 0)}>{Lang.str('app_history_Today')}</a></li>
                                <li><a onClick={this.onTimeSelect.bind(this, 1)}>{Lang.str('app_history_Yesterday')}</a></li>
                                <li><a onClick={this.onTimeSelect.bind(this, 2)}>{Lang.str('app_history_Past7Days')}</a></li>
                                <li><a onClick={this.onTimeSelect.bind(this, 3)}>{Lang.str('app_history_Past15Days')}</a></li>
                                <li><a onClick={this.onTimeSelect.bind(this, 4)}>{Lang.str('app_history_Past30Days')}</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="dropdown" id="div_category">
                        <button className ="btnCsSelect" onClick={this.onCategoryClick} disabled = {this.state.selectButtonDisable}>
                            <label id = "labelSelect">{Lang.str('app_history_AllCustomer')}</label>
                            <span className="caret" id="caret_customer"></span>
                        </button>
                        <div className="dropdown-container" id="category_container">
                            <ul>
                                <li className="selectAll"><a href="#" className="all" onClick={this.onCsSelectAll.bind(this)}>{Lang.str('app_history_AllCustomer')}</a></li>
                                {customers}
                            </ul>
                            <button className="csSelectSave" onClick={this.onCategorySelect.bind(this)}>{Lang.str('app_history_Save')}</button>
                        </div>
                    </div>

                    <div className="searchBox">
                        <a className="searchit" href="javascript:;" onClick={this.onClickSearchhit.bind(this)}></a>
                        <input className="searchInput" id="textFilter" type="text" placeholder={Lang.str('app_history_Filter')} onKeyDown={this.onKeyDown.bind(this)}/>
                     </div>

                    <a className="export" href="" id="a_export"><i></i>{Lang.str('app_history_Export')}</a>
                </div>
                <div className="empty_result_note" style={emptyResultNoteDisplay}>{Lang.str('app_history_noQueryResult')}</div>
                <div className="his-list-box" style={resultDisplay}>
                <table className="his-list">
                    <thead>
                        <tr>
                            <td>{Lang.str('app_history_UserInformation')}</td>
                            <td>{Lang.str('app_history_FirstResponseTime')}</td>
                            <td>{Lang.str('app_history_DurationOfConversations')}</td>
                            <td>{Lang.str('app_history_MessageVolumn')}</td>
                            <td>{Lang.str('app_history_Source')}</td>
                            <td>{Lang.str('app_history_CustomerService')}</td>
                            <td>{Lang.str('app_history_ConversationStartTime')}</td>
                        </tr>
                    </thead>
                    <tbody>
                        {histories}
                    </tbody>
                </table>
                </div>
                <footer className="his-footer" id="show_more" style={divDisplay}>
                    <a onClick={this.onShowMoreClick.bind(this)}>{Lang.str('app_history_ShowMore')}</a>
                </footer>
                <HistoryChatDetail showDetailDialog={this.state.showDetailDialog} closeDialog={this.closeDialog.bind(this)}  conversation={this.state.conversation}/>
            </div>;
    }
}

export default History;
