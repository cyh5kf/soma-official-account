import React from 'react'
import RouteComponent from 'app/RouteComponent'
import {Session} from 'app/Session'
import {QrcodeDlDialog} from 'app/home/QrcodeDlDialog'
import {ImageThumbHelper} from 'utils/ImageThumbHelper'
            import {TimeHelper} from 'utils/TimeHelper'
            import CommonConstants from 'app/Const'
            import Lang from "lang/Lang"

            export class Home extends RouteComponent {
                constructor(props) {
                    super(props);
                    this.state = {
                        groupids: [],
                        day: 0,
                        membersShowType: 0,      //0-不展示 1-展示客服 2-展示编辑 
                    };
                }

                getGroupList(successhandler) {
                    $.ajax({
            type: "GET",
            dataType: "json",
            url: "/api/v1/cs/group",
            async: true,
            success: successhandler
        });
    }
    
    // 获取客服信息：所属公众号的所有客服信息(与getcslist不同，这个带有groupId)
    getAgentList(successhandler) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "/api/v1/cs/agent/getagentlist",
            async: true,
            success: successhandler
        });
    }
    
    //获取编辑信息
    getEditorList(successhandler){
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "/api/v1/cs/agent/listeditor",
            contentType: 'application/json; charset=utf-8',
            async: true,
            success: successhandler            
        });
    }

    // 获取customer service列表
    getCsList(params, successhandler) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "/api/v1/cs/statistics/getcslist",
            data: params,
            async: true,
            success: successhandler
        });
    }

    // 获取统计数据
    getStatistics(params, successhandler) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "/api/v1/cs/statistics/getstatistics",
            data: params,
            async: true,
            success: successhandler
        });
    }

    // 获取公众号内所有客服或者某个group内所有客服的平均数据
    getAvgStats(params, successhandler) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "/api/v1/cs/statistics/getavgstats",
            data: params,
            async: true,
            success: successhandler
        });
    }

    // 获取公众号的订阅数据
    getSubStats(params, successhandler) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "/api/v1/cs/statistics/getsubstats",
            data: params,
            async: true,
            success: successhandler
        });
    }

    getTimeRangeParam(day) {
        var params = {};
        params.starttime = TimeHelper.getTimeStamp(day)[0];
        params.endtime = TimeHelper.getTimeStamp(day)[1];
        params.day = day;

        return params;
    }

    // 获取数据
    // 参数 getCsList 表示是否获取agent list数据
    // 参数 day 表示获取的时什么时间数据, day=0表示today, day=1表示yesterday, day=7表示一周内数据, day=30表示30天内数据
    getHomeData(day, toGetCsList, toGetSubStats, toGetGroup) {
        let that = this;
        var params = {}
        if(Session.getRole() == CommonConstants.ROLE.ADMIN || Session.getRole() == CommonConstants.ROLE.SUPER) {
            if (toGetSubStats && Session.getRole() == CommonConstants.ROLE.SUPER) {
                params = that.getTimeRangeParam(1);
                that.getSubStats(params, function(data) {
                    that.state.substats = data;
                    that.setState(that.state);
                });
            }

            if (toGetGroup) {
                that.getGroupList(function(data) {
                    that.state.groupList = data;
                    that.setState(that.state);
                });
            }

            params = that.getTimeRangeParam(day);
            params['groupid[]'] = that.state.groupids;
            that.getAvgStats(params, function(data){
                that.state.statistics = data;
                that.state.btnstatus = day
                that.setState(that.state);
            });

            if (toGetCsList) {
                that.getCsList(params, function (data) {
                    that.state.csagentlist = data;
                    that.setState(that.state);
                });
            }
        } else if (Session.getRole() == CommonConstants.ROLE.EDITOR) {
            if (toGetSubStats) {
                params = that.getTimeRangeParam(1);
                that.getSubStats(params, function(data) {
                    that.state.substats = data;
                    that.setState(that.state);
                });
            }
        } else {
            params = that.getTimeRangeParam(day);
            that.getStatistics(params, function(data){
                that.state.statistics = data;
                that.state.btnstatus = day
                that.setState(that.state);
            });
        }
    }

    // 处理统计数据按键事件
    handleOnClick(day) {
        console.log("onclick: " + day)
        this.state.day = day;
        this.getHomeData(day, true, false, false);
    }

    onCategoryClick() {
        $('#group-container').slideToggle();
    }

    // 勾选了组后做保存
    onCategorySelect() {
        let self = this;
        var ids = [];
        var selectGroup = "";
        $('#group-container input:checked').each(function(){
            ids.push($(this).data('id'));
            selectGroup += ($(this).attr("value"));
            selectGroup += ";";
        });

        if (selectGroup == "")
        {
            selectGroup = Lang.str('app_home_AllGroups');
        }

        $("#labelGroupSelect").text(selectGroup);
        self.state.groupids = ids;
        self.getHomeData(self.state.day, true, false, false);
        $('#group-container').slideToggle();
    }

    onGroupSelectAll(e){
        let self = this;
        var ids = [];

       var textSelect = Lang.str('app_home_AllGroups');
       $("#labelGroupSelect").text(textSelect);

        self.state.groupids = ids;
        self.getHomeData(self.state.day, true, false, false);

        $("[name = groupchb]:checkbox").attr("checked", false);

        $('#group-container').slideToggle();
    }

    componentWillMount() {

    }

    componentDidMount() {
        var that = this;
        
        require.ensure([], function () {
            require('static/css/reset.css');
            require('static/css/common.css');
            require('static/css/home.css');
        }.bind(this));

        this.getHomeData(0, true, true, true);
        
        //判断用户类型，管理员用户或者编辑用户，不用获取此内容
        if(Session.getRole() == CommonConstants.ROLE.SUPER
        || Session.getRole() == CommonConstants.ROLE.ADMIN){
            this.state.membersShowType = 0;            
        }
        else if(Session.getRole() == CommonConstants.ROLE.NORMAL){
            this.getAgentList(function (data) {
                that.state.membersShowType = 1;
                
                that.state.agentList = data;
                that.setState(that.state);
                
            });            
        }
        else{
            this.getEditorList(function (cont, txtStatus, xhr){                
                if(xhr.status==200){                    
                        that.state.membersShowType = 2;
                        
                        var data=xhr.responseJSON;
                        var tr="";
                        var index;
                        var specItem;
                        for(var i=0,len=data.length;i<len;i++){
                            if(data[i].role==9){
                                index=i;
                                specItem=data[i];
                                break;
                            }
                        }
                        
                        //管理员移除掉？？？
                        data.splice(index,1);
                        data.unshift(specItem);
                        
                        that.state.editorList = data;
                        that.setState(that.state);
                        
                        
                    }                    
            });            
        }
                       
       //

        var qrcode = Session.getOffQRCode();
        if (!qrcode || qrcode == "null") {
            this.state.qrcode = "api/v1/cs/qrcode/" + Session.getOid() + "?" + new Date().getMilliseconds();
        } else {
            this.state.qrcode = qrcode + "?" + new Date().getMilliseconds();
        }

        var groupName = Session.getGroupName();
        if (Session.getRole() == CommonConstants.ROLE.EDITOR) {
            this.state.groupName = "Editor";
        } else {
            if (!groupName || groupName == "null") {
                this.state.groupName = Lang.str('app_home_Default');
            } else {
                this.state.groupName = groupName;
            }
        }
    }

    // 时间格式化
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

    getGroupName(name) {
        if (!name) {
            return "No Name";
        }

        if (name.length > 16) {
            return name.substr(0, 12) + " ...";
        }

        return name;
    }

    onQrcodeMouseOver() {
        $('#home-qrcode').stop(true, false).slideDown(300);
    }

    onQrcodeMouseOut() {
        $('#home-qrcode').stop(true, false).slideUp(300);
    }
    
    onMembersMouseOver() {
        $('#home-members').stop(true, false).slideDown(300);
    }

    onMembersMouseOut() {
        $('#home-members').stop(true, false).slideUp(300);
    }

    onShowQrcodeDlDialog(){
        $('#home-qrcode').stop(true, false).slideUp(300);

        let self = this;
        self.state.showDlDialog = true;
        self.setState(self.state);
    }

    onQRDownload(url) {
        $('#home-qrcode').stop(true, false).slideUp(300);
        window.open (url);
        //setTimeout('document.execCommand("SaveAs")', 500);
    }

    onHideMenuClick(e){
        if (!this.checkZone(e, "group-category-div")) {
            $('#group-container').hide();
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

     handleDialog (evtype) {
                    if('x' === evtype) {
                        this.state.showDlDialog = false;
                    } else if('a' === evtype) {
                        this.state.showDlDialog = true;
                    }
                    this.setState(this.state);
                }

    render(){
        var currentDialog = "";
        var items = []
        var agentListDisplay = {};
        var groupDisplay = {};
        var statsDisplay = {};
        var subStatsDisplay = {};        

        var substats = []
        if (!this.state.substats) {
            subStatsDisplay = {display:'none'}
        } else {
            var aa = this.state.substats;
            for (var s in aa) {
                //substats.push(<h1>{aa[s]}</h1>)

                //var style = {width:"88px", height:"88px", borderRadius:"200px", borderColor:"#50c14e", borderStyle:"solid"};
                //var style2 = {height:"88px", lineHeight:"88px", display:"block", color:"#000", textAlign:"center"};
                //substats.push(<div style={style}><span style={style2}><h1>{aa[s]}</h1></span></div>)

                var color = {borderColor: "#50c14e"};
                if (s == "totalUserSubs") color = {borderColor:"#e0e0e0"};
                else if (s == "ytdNetUserSubs") color = {borderColor: "#56a6ed"};
                substats.push(<div className="home-follow-circle" style={color}>
                    <span className="home-follow-circle-span"><h1>{aa[s]}</h1></span></div>)
            }
        }

        if (this.state.showDlDialog) {
            currentDialog = <QrcodeDlDialog
            urlSrc={this.state.qrcode}
            downloadHandler={this.onQRDownload.bind(this)}
            dialogHandler={this.handleDialog.bind(this)} />;
        }

        // check if show group list button
        var groups = []
        if (!this.state.groupList || this.state.groupList.length == 0) {
            groupDisplay = {display:'none'}
        } else {
            var groupData = this.state.groupList;
            for (var i in groupData) {
                var groupName = this.getGroupName(groupData[i].name);
                groups.push(<li><label className="chb"><input name="groupchb" type="checkbox"  value={groupData[i].name} data-id={groupData[i].group_id} />{groupName}</label></li>);
            }
        }

        // check if show agent list
        var showCSList = true;
        if (this.state.csagentlist == null || this.state.csagentlist.length == 0) {
            showCSList = false;
        } else {
            for (var s in this.state.csagentlist) {
                if (s == "status" && this.state.csagentlist[s] == 207) {
                    showCSList = false;
                    break;
                }
            }
        }
        if (showCSList == false) {
            agentListDisplay = {display:'none'};
        } else {
            var index = 0;
            for (var i in this.state.csagentlist) {
                let d = this.state.csagentlist[i];
                if (d.avatar == null || d.avatar == "") {
                    d.avatar = require("static/images/common/head_sculpture.png")
                }

                var duration = this.getTimeStr(d.avgDurationConv);
                var firstRsp = this.getTimeStr(d.avgFirstRspTime);

                var onlineState = "offline";
                //本用户从session中取在线状态，因为存在刚登录时取到记录中的状态仍然是offline的情况，此处获取可保证在login做session.setstatus之后
                if (Session.getAid() == d.aid)
                {
                    if ( Session.getStatus() == "online")
                    {
                        onlineState = "online";
                    }
                }
                 else if (d.online)
                {
                    onlineState = "online";
                }

                index++;
                items.push(
                    <tr>
                        <td>{index}</td>
                        <td>
                            <img className="home-avatar-1" id ={onlineState} src={ImageThumbHelper.getSquareThumbUrlByDefaultSize(d.avatar)}/>
                            <i className={onlineState}></i>
                            <span>{d.name}</span>
                        </td>
                        <td>{d.convVolume}</td>
                        <td>{d.msgVolume}</td>
                        <td>{duration}</td>
                        <td>{firstRsp}</td>
                    </tr>
                );
            }
        }

        var st = [];
        var statusItems = []
        var statsData = this.state.statistics;
        if (!statsData) {
            statsDisplay = {display:'none'}
        } else {
            for (var s in statsData) {
                if (s == "avgDurationConv" || s == "avgFirstRspTime") {
                    var avgDur = this.getTimeStr(statsData[s]);
                    st.push(<h1><div style={{display:"inline"}}>{avgDur}</div> <span>min</span></h1>)
                //} else if (s == "avgFirstRspTime") {
                //    st.push(<h1><div style={{display:"inline"}}>{statsData[s]}</div> <span>sec</span></h1>)
                } else {
                    st.push(<h1>{statsData[s]}</h1>)
                }
            }
        }

        if (this.state.btnstatus == null) this.state.btnstatus = 0;
        var btnStatus = this.state.btnstatus;
        for (var i=0; i<4; i++) {
            var itemvalue = "";
            if (btnStatus == 0 && i == 0 || btnStatus == 1 && i == 1
                || btnStatus == 7 && i == 2 || btnStatus == 30 && i == 3) itemvalue = "active";
            statusItems.push(itemvalue);
        }
        
        var members = [];
        if(this.state.membersShowType == 1){
            var agentData = this.state.agentList;
            for(var i in agentData){
                if (agentData[i].avatar == null || agentData[i].avatar == "") {
                    agentData[i].avatar = require("static/images/common/head_sculpture.png")
                }
                                
                if(agentData[i].role == 9){
                    //超级管理员，管理员要排在最前，用unshift
                     members.unshift(<li className="item-super" >
                        <label className="item">
                            <img src={ImageThumbHelper.getSquareThumbUrlByDefaultSize(agentData[i].avatar)} width="28" height="28"/>
                            {agentData[i].name}
                            <a className="superMgrTag"></a>
                        </label>
                    </li>);
                }
                else if(agentData[i].group_id == Session.getGroupId()){
                    //同组客服
                    members.push(<li className="item-normal" >
                        <label className="item">
                            <img src={ImageThumbHelper.getSquareThumbUrlByDefaultSize(agentData[i].avatar)} width="28" height="28"/>
                            {agentData[i].name}
                        </label>
                    </li>);
                }                
            }
        }
        else if(this.state.membersShowType == 2){
            var editorData = this.state.editorList;
            for(var i in editorData){
                if (editorData[i].avatar == null || editorData[i].avatar == "") {
                    editorData[i].avatar = require("static/images/common/head_sculpture.png")
                }
                           
                if(editorData[i].role == 9){
                    //超级管理员，管理员要排在最前，用unshift
                    members.unshift(<li className="item-super" >
                        <label className="item">
                            <img src={ImageThumbHelper.getSquareThumbUrlByDefaultSize(editorData[i].avatar)} width="28" height="28"/>
                            {editorData[i].name}
                            <a className="superMgrTag"></a>
                        </label>
                    </li>);
                }
                else{
                    //普通编辑
                    members.push(<li className="item-normal">
                        <label className="item">
                            <img src={ImageThumbHelper.getSquareThumbUrlByDefaultSize(editorData[i].avatar)} width="28" height="28"/>
                            {editorData[i].name}
                        </label>
                    </li>);
                }                
            }
        }

        var agentName = Lang.str('app_home_Hello') + ", " + Session.getName();
        
        var divMembers =[];
        if(this.state.membersShowType != 0){
            divMembers.push(
                <div id="home-members" className="home-header-members">
                                <span className="members-note">Group Members</span>
                                <ul className="ul-members">
                                  {members}
                                </ul>
                            </div>
            );
        }
        return (
            <div id="main" onClick={this.onHideMenuClick.bind(this)}>
                <header id="home_header" className="home-his-header">
                    <h2>{agentName}</h2>
                    <div className="home-header-right">
                        <span className="home-group-icon"  onMouseEnter={this.onMembersMouseOver.bind(this)} onMouseLeave={this.onMembersMouseOut.bind(this)}><i></i>{this.state.groupName}
                            {divMembers}
                        </span>
                        <span/><span/><span/><span/>
                        <span onClick={this.onShowQrcodeDlDialog.bind(this)} onMouseEnter={this.onQrcodeMouseOver.bind(this)} onMouseLeave={this.onQrcodeMouseOut.bind(this)}
                              className="home-qrcode-icon"><i></i>{Session.getOffName()}
                            <div id="home-qrcode" className="home-header-qrcode">
                                <div class="home-header-qrcode-image">
                                    <img src={this.state.qrcode} width="140" height="140" onClick={this.onShowQrcodeDlDialog.bind(this)}/>
                                </div>
                                <div className="home-header-a">
                                    <a href="#" onClick={this.onShowQrcodeDlDialog.bind(this)}>{Lang.str('app_home_Download')}</a>
                                </div>
                            </div>
                        </span>
                    </div>

                </header>

                <section className="home-folow-info" style={subStatsDisplay}>
                    <div>
                        <p>{Lang.str('app_home_NewFollowersYesterday')}</p>
                        {substats[1]}
                    </div>
                    <div>
                        <p>{Lang.str('app_home_NetFollowersYesterday')}</p>
                        {substats[2]}
                    </div>
                    <div>
                        <p>{Lang.str('app_home_TotalFollowers')}</p>
                        {substats[0]}
                    </div>
                </section>

                <div style={statsDisplay}>
                    <section className="home-category">
                        <div className="btn-group">
                            <a id = "btntoday" className={statusItems[0]} onClick={this.handleOnClick.bind(this, 0)}>{Lang.str('app_home_Today')}</a>
                            <a id = "btnyesterday" className = {statusItems[1]} onClick={this.handleOnClick.bind(this, 1)}>{Lang.str('app_home_Yesterday')}</a>
                            <a id = "btn7day" className = {statusItems[2]} onClick={this.handleOnClick.bind(this, 7)}>{Lang.str('app_home_Past7Days')}</a>
                            <a id = "btn30day" className = {statusItems[3]} onClick={this.handleOnClick.bind(this, 30)}>{Lang.str('app_home_Past30Days')}</a>
                        </div>
                        <div id="group-category-div" className="group-category-dropdown" style={groupDisplay}>
                            <button id = "btnGroupSelect" onClick={this.onCategoryClick.bind(this)}>
                                <label id = "labelGroupSelect">{Lang.str('app_home_AllGroups')}</label>
                                <span className="caret"></span>
                            </button>
                            <div className="group-category" id="group-container">
                                <ul>
                                    <li className="selectAll"><a href="#" className="all" onClick={this.onGroupSelectAll.bind(this)}>{Lang.str('app_home_AllGroups')}</a></li>
                                    {groups}
                                </ul>
                                <button className="groupidSave" onClick={this.onCategorySelect.bind(this)}>{Lang.str('app_home_Save')}</button>
                            </div>
                        </div>
                    </section>

                    <section className="home-info">
                        <div>
                            <p>{Lang.str('app_home_ConversationVolume')}</p>
                            {st[0]}
                        </div>
                        <div>
                            <p>{Lang.str('app_home_MessageVolume')}</p>
                            {st[1]}
                        </div>
                    </section>

                    <section className="home-info home-info-b">
                        <div>
                            <p>{Lang.str('app_home_AverageDurationOfConversations')}</p>
                            {st[2]}
                        </div>
                        <div>
                            <p>{Lang.str('app_home_AverageFirstResponseTime')}</p>
                            {st[3]}
                        </div>
                    </section>
                </div>

                <div className="home-his-list-div" style={agentListDisplay}>
                    <table className="home-his-list" id="home_list" >
                        <thead>
                        <tr>
                            <td>#</td>
                            <td>{Lang.str('app_home_CustomerService')}</td>
                            <td>{Lang.str('app_home_ConversationVolume')}</td>
                            <td>{Lang.str('app_home_MessageVolume')}</td>
                            <td>{Lang.str('app_home_AverageDurationOfConversations')}</td>
                            <td>{Lang.str('app_home_AverageFirstResponseTime')}</td>
                        </tr>
                        </thead>
                        <tbody>
                        {items}
                        </tbody>
                    </table>
                </div>
            <ul>{currentDialog}</ul>
            </div>
        );
    }
}

export default Home;
