import React from 'react'
import RouteComponent from 'app/RouteComponent'
import tools from 'utils/tools'
import Lang from "lang/Lang"
import $ from "jquery"
import TextMessage from "app/chat/components/TextMessage.react"


export class Artical extends RouteComponent{

    constructor(props){
        super(props);
        this.emptyImage = require('static/images/broadcast/defaultImg.png');
    }

    componentWillMount(){
        require.ensure([], function() {
            require('static/css/common.css');
            require('static/css/reset.css');

            require('static/css/broadcastOrignal.css');
        }.bind(this));
    }


    componentDidMount(){
        var self = this;
        $.loadding();
        $(function() {
            //获取页面list
            var getMainList=function(page){
                if(mypower){
                    return false;
                }
                mypower=true;
                $.ajax({
                    url: "api/v1/official/article/list?page="+page,
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (cont, txtStatus, xhr) {
                        mypower=false;
                        var articleCon =$(".articleCon .childCon"),
                            imgWordsList="";
                        if(xhr.status!=200){
                            return false;
                        }
                        var data=xhr.responseJSON;
                        if (!data){
                            return false;
                        }
                        if(data.length==0){
                            $(".getMore").addClass("hidden");
                            if (page===0){
                                articleCon.html('');
                                $(".content").addClass("hidden");
                                $(".noData").removeClass("hidden");
                            }
                            $.loaded();
                            return false;
                        }
                        $(".noData").addClass("hidden");
                        $(".content").removeClass("hidden");
                        if(data.length<10){
                            //当没有内容的时候隐藏view more按钮
                            $(".getMore").addClass("hidden");
                        }else if(data.length==10){
                            if(data.length+$(".imgWordsList").length==allMessageNum){
                                //当前条数是10,加上已经请求回来的等于总条数,表示已经全部请求回来了,隐藏view more按钮
                                $(".getMore").addClass("hidden");
                            }else{
                                //当有内容的时候显示view more按钮
                                $(".getMore").removeClass("hidden");
                            }
                        }else{
                            //当有内容的时候显示view more按钮
                            $(".getMore").removeClass("hidden");
                        }

                        $.each(data,function(i,d){
                            var li="";
                            //获得文章的信息
                            if(d.content.length==0){
                                return false;
                            }
                            var times = new Date(d.message.updated).format();
                            $.each(d.content,function(ii,dd){
                                var isDel="",
                                    isDisabled="",
                                    drafting="",
                                    imgWord="",
                                    delTxt=Lang.str("app_broadcast_deactivate"),
                                    titleOrContent="",
                                    imgsrc=dd.cover_link,
                                    onlyWordLeftCon="",showUser='',showAllUser='',sn="";
                                var disTime = ii===0?times:'';
                                var user = ii===0?Lang.str("app_article_sentto_all"):'';
                                if(!(imgsrc&&imgsrc!=='null')){
                                    imgsrc= self.emptyImage;
                                }
                                if(d.message.state==0){//0为草稿状态,1为已发送
                                    drafting="drafting";
                                    delTxt=Lang.str("app_article_delete");
                                }else{
                                    drafting="noDrafting";
                                    if(d.message.type==1){//0=文本消息、1=图文消息
                                        delTxt=Lang.str("app_broadcast_deactivate");
                                        if(dd.expired){//false=未过期、true=已过期
                                            delTxt=Lang.str("app_broadcast_deactivated");
                                        }
                                    }
                                }
                                if(dd.sn){
                                    sn=dd.sn;
                                }
                                if(d.message.type==1){//0=文本消息、1=图文消息
                                    imgWord="imgWord";
                                    var host=location.host;
                                    titleOrContent="<a class='getOutPage' href='http://"+host+"/contentservice/getpage?cid="+dd.content_id+"&sn="+sn+"' target='_blank'>"+dd.title+'</a>';
                                    showAllUser = '<span class="showEditor">'+user+'</span>';
                                }else{
                                    imgWord="onlyWord";
                                    //titleOrContent=dd.content;
                                    //把后台传过来的字符转换成图片
                                    titleOrContent=TextMessage.getTextMessageContent(dd.content);
                                    imgsrc=require('static/images/broadcast/txtpic.jpg');
                                    onlyWordLeftCon="onlyWordLeftCon";
                                    showUser = '<span class="show_user">'+user+'</span>';
                                }
                                if(dd.expired){//false=未过期、true=已过期
                                    isDel="deleted";

                                    isDisabled="isdisabled";
                                }
                                if(d.message.state==0 && ii==0){//草稿状态第一个下面显示编辑,删除功能
                                    drafting="drafting draftingFirst";
                                }else if(d.message.state==0 && ii!=0){
                                    drafting="drafting";
                                }

                                li+='<li msg_id="'+dd.msg_id+'" content_id="'+dd.content_id+'" class="'+drafting+' '+imgWord+' '+isDel+'">'
                                    //+'<img src="'+imgsrc+'" alt="" />'
                                    +'<div class="img" style="background: url('+self.resetImagePath(imgsrc,100,100)+') no-repeat 0 0"></div>'
                                    +'<h3 class="clearfix">'
                                    +'<span class="leftCon summary"><span class="doing">['+Lang.str("app_article_draft")+']</span>'+titleOrContent+'</span>'
                                    +'<span class="date">'+disTime+'</span>'+showUser
                                    +' <span class="funBtn">'
                                    +'<a class="del '+isDisabled+'" href="javascript:;">'+delTxt+'</a>'
                                    +'<a class="editor" href="/ArticalEditor?msg_id='+dd.msg_id+'">'+Lang.str("app_article_edit")+'</a>'
                                    +'</span>'
                                    +'</h3>'
                                    +'<p class="clearfix">'
                                    +'<span class="leftCon '+onlyWordLeftCon+'">'
                                    +'<em>'+Lang.str("app_article_visits")+' '+dd.visits+'</em>'
                                    +'<em class="good">'+dd.likes+'</em>'
                                    +'<em class="ding">'+dd.forwards+'</em>'
                                    +'</span>'+showAllUser
                                    +'</p>'
                                    +'<div class="deleteBox">'
                                    +'<div class="shadow"></div>'
                                    +'<div class="hasDelete"></div>'
                                    +'</div>'
                                    +'</li>';

                            })
                            //获得每条消息的信息
                            imgWordsList+='<div class="imgWordsList" msg_id="'+d.message.msg_id+'"><ul>'+li+'</ul></div>';

                        })
                        //如果第一次点击searchit,需要清空articleCon的getMainlist内容再append随后的内容
                        if(page==0){
                            articleCon.empty().append(imgWordsList);
                        }else{
                            articleCon.append(imgWordsList);
                        }
                        $.loaded();
                    },
                    error:function(){
                        mypower=false;
                        $.loaded();
                    }
                });
            }
            //点击searchit获取页面list
            var getSearchList=function(page,query){
                if(mypower){
                    return false;
                }
                mypower=true;
                $.ajax({
                    url: "/api/v1/official/article/search?page="+page,
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data:JSON.stringify({"query":query}),
                    success: function (cont, txtStatus, xhr) {
                        mypower=false;
                        var articleCon =$(".articleCon .childCon"),
                            imgWordsList="";
                        if(xhr.status!=200){
                            return false;
                        }
                        var data=xhr.responseJSON;
                        if (!data){
                            return false;
                        }
                        if(data.length==0){
                            $(".getMore").addClass("hidden");
                            if (page===0){
                                //当没有内容的时候隐藏view more按钮
                                articleCon.html('');
                                $(".content").addClass("hidden");
                                $(".noData").removeClass("hidden");
                            }
                            $.loaded();
                            return false;
                        }
                        $(".noData").addClass("hidden");
                        $(".content").removeClass("hidden");
                        if(data.length<10){
                            //当没有内容的时候隐藏view more按钮
                            $(".getMore").addClass("hidden");
                        }else if(data.length==10){
                            if(data.length+$(".imgWordsList").length==allMessageNum){
                                //当前条数是10,加上已经请求回来的等于总条数,表示已经全部请求回来了,隐藏view more按钮
                                $(".getMore").addClass("hidden");
                            }else{
                                //当有内容的时候显示view more按钮
                                $(".getMore").removeClass("hidden");
                            }
                        }else{
                            //当有内容的时候显示view more按钮
                            $(".getMore").removeClass("hidden");
                        }


                        $.each(data,function(i,d){
                            var li="";
                            //获得文章的信息
                            if(d.content.length==0){
                                return false;
                            }
                            var times = new Date(d.message.updated).format();
                            $.each(d.content,function(ii,dd){
                                var isDel="",
                                    isDisabled="",
                                    drafting="",
                                    imgWord="",
                                    delTxt=Lang.str("app_broadcast_deactivate"),
                                    titleOrContent="",
                                    imgsrc=dd.cover_link,
                                    onlyWordLeftCon="",showUser='',showAllUser='';
                                var disTime = ii===0?times:'';
                                var user = ii===0?Lang.str("app_article_sentto_all"):'';
                                if(!(imgsrc&&imgsrc!=='null')){
                                    imgsrc= self.emptyImage;
                                }
                                if(d.message.state==0){//0为草稿状态,1为已发送
                                    drafting="drafting";
                                    delTxt=Lang.str("app_article_delete");
                                }else{
                                    drafting="noDrafting";
                                    if(d.message.type==1){//0=文本消息、1=图文消息
                                        delTxt=Lang.str("app_broadcast_deactivate");
                                        if(dd.expired){//false=未过期、true=已过期
                                            delTxt=Lang.str("app_broadcast_deactivated");
                                        }
                                    }
                                }
                                if(d.message.type==1){//0=文本消息、1=图文消息
                                    imgWord="imgWord";
                                    var host=location.host;
                                    titleOrContent="<a class='getOutPage' href='http://"+host+"/contentservice/getpage?cid="+dd.content_id+"' target='_blank'>"+dd.title+'</a>';
                                    showAllUser = '<span class="showEditor">'+user+'</span>';
                                }else{
                                    imgWord="onlyWord";
                                    //titleOrContent=dd.content;
                                    //把后台传过来的字符转换成图片
                                    titleOrContent=TextMessage.getTextMessageContent(dd.content);
                                    imgsrc=require('static/images/broadcast/txtpic.jpg');
                                    onlyWordLeftCon="onlyWordLeftCon";
                                    showUser = '<span class="show_user">'+user+'</span>';
                                }
                                if(dd.expired){//false=未过期、true=已过期
                                    isDel="deleted";

                                    isDisabled="isdisabled";
                                }
                                if(d.message.state==0 && ii==0){//草稿状态第一个下面显示编辑,删除功能
                                    drafting="drafting draftingFirst";
                                }else if(d.message.state==0 && ii!=0){
                                    drafting="drafting";
                                }

                                li+='<li msg_id="'+dd.msg_id+'" content_id="'+dd.content_id+'" class="'+drafting+' '+imgWord+' '+isDel+'">'
                                        //+'<img src="'+imgsrc+'" alt="" />'
                                    +'<div class="img" style="background: url('+self.resetImagePath(imgsrc,100,100)+') no-repeat 0 0"></div>'
                                    +'<h3 class="clearfix">'
                                    +'<span class="leftCon summary"><span class="doing">['+Lang.str("app_article_draft")+']</span>'+titleOrContent+'</span>'
                                    +'<span class="date">'+disTime+'</span>'+showUser
                                    +' <span class="funBtn">'
                                    +'<a class="del '+isDisabled+'" href="javascript:;">'+delTxt+'</a>'
                                    +'<a class="editor" href="/ArticalEditor?msg_id='+dd.msg_id+'">'+Lang.str("app_article_edit")+'</a>'
                                    +'</span>'
                                    +'</h3>'
                                    +'<p class="clearfix">'
                                    +'<span class="leftCon '+onlyWordLeftCon+'">'
                                    +'<em>'+Lang.str("app_article_visits")+' '+dd.visits+'</em>'
                                    +'<em class="good">'+dd.likes+'</em>'
                                    +'<em class="ding">'+dd.forwards+'</em>'
                                    +'</span>'+showAllUser
                                    +'</p>'
                                    +'<div class="deleteBox">'
                                    +'<div class="shadow"></div>'
                                    +'<div class="hasDelete"></div>'
                                    +'</div>'
                                    +'</li>';

                            });
                            //获得每条消息的信息
                            imgWordsList+='<div class="imgWordsList" msg_id="'+d.message.msg_id+'"><ul>'+li+'</ul></div>';

                        })
                        //如果第一次点击searchit,需要清空articleCon的getMainlist内容再append随后的内容
                        if(page==0){
                            articleCon.empty().append(imgWordsList);
                        }else{
                            articleCon.append(imgWordsList);
                        }
                        $.loaded();
                    },
                    error:function(){
                        mypower=false;
                        $.loaded();
                    }
                });
            }
            //默认请求第1页的列表
            var page=0,
                searchPage=0,
                mypower=false,
                getMainListType=true;

            $(".articleCon").on("click",".getMore",function(){
                if(getMainListType){
                    page++;
                    getMainList(page);
                }else{
                    searchPage++;
                    var query=$(".searchInput").val();
                    getSearchList(searchPage,query);
                }
            })
            //searchit点击获取search的页面
            $(".searchit").click(function(){
                $.loadding();
                var query=$(".searchInput").val();
                $(".articleCon>.childCon").html('');
                $(".getMore").addClass("hidden");
                $(".noData").addClass("hidden");
                if(query.length==0){
                    //初始化
                    page=0,
                    searchPage=0,
                    mypower=false,
                    getMainListType=true;

                    getMainList(0);
                    getAllMessageNum(function (cont, txtStatus, xhr) {
                        if(xhr.status!=200){
                            return false;
                        }
                        var data=xhr.responseJSON;
                        $(".titleHead .hasStyle").text(Lang.str('app_article_inTotal',data.messageCount));
                        allMessageNum=data.messageCount;
                        //平时需要得到总条数之后在获取mainlist,点击或者回车search的时候不需要
                        getMainList(page);
                    });
                    return false;
                }
                getMainListType=false;
                searchPage=0;

                getAllMessageNum(function (cont, txtStatus, xhr) {
                    if(xhr.status!=200){
                        return false;
                    }
                    var data=xhr.responseJSON;
                    $(".titleHead .hasStyle").text(Lang.str('app_article_inTotal',data.messageCount));
                    allMessageNum=data.messageCount;
                    //平时需要得到总条数之后在获取mainlist,点击或者回车search的时候不需要
                    //getMainList(page);
                    //获得总条数之后在请求数据可以判断返回条数等于10的情况
                    getSearchList(searchPage,query);
                });
            })
            //输入框回车获取search的页面
            $(".searchInput").keyup(function(event){
                if(event.keyCode ==13){
                    $.loadding();
                    $(".articleCon>.childCon").html('');
                    $(".getMore").addClass("hidden");
                    $(".noData").addClass("hidden");
                    var query=$(".searchInput").val();
                    if(query.length==0){
                        //初始化
                        page=0,
                        searchPage=0,
                        mypower=false,
                        getMainListType=true;
                        getMainList(0);
                        getAllMessageNum(function (cont, txtStatus, xhr) {
                            if(xhr.status!=200){
                                return false;
                            }
                            var data=xhr.responseJSON;
                            $(".titleHead .hasStyle").text(Lang.str('app_article_inTotal',data.messageCount));
                            allMessageNum=data.messageCount;
                            //平时需要得到总条数之后在获取mainlist,点击或者回车search的时候不需要
                            getMainList(page);
                        });
                        return false;
                    }
                    getMainListType=false;
                    searchPage=0;
                    getAllMessageNum(function (cont, txtStatus, xhr) {
                        if(xhr.status!=200){
                            return false;
                        }
                        var data=xhr.responseJSON;
                        $(".titleHead .hasStyle").text(Lang.str('app_article_inTotal',data.messageCount));
                        allMessageNum=data.messageCount;
                        //平时需要得到总条数之后在获取mainlist,点击或者回车search的时候不需要
                        //getMainList(page);
                        //获得总条数之后在请求数据可以判断返回条数等于10的情况
                        getSearchList(searchPage,query);
                    });
                }
            });

            //请求所有消息的个数
            var allMessageNum;
            var getAllMessageNum=function(callback) {
                var searchText = $(".searchInput").val();
                var keyEncode = encodeURIComponent(encodeURIComponent(searchText));
                var url = "/api/v1/official/article/messagecount";
                if (keyEncode){
                    url += "?query="+keyEncode;
                }
                $.ajax({
                    url: url,
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: callback
                })
            }
            getAllMessageNum(function (cont, txtStatus, xhr) {
                if(xhr.status!=200){
                    return false;
                }
                var data=xhr.responseJSON;
                $(".titleHead .hasStyle").text(Lang.str('app_article_inTotal',data.messageCount));
                allMessageNum=data.messageCount;
                //平时需要得到总条数之后在获取mainlist,点击或者回车search的时候不需要
                getMainList(page);
            });


            //close
            $(".dialogHead .close").click(function(){
                //取消应该删除的项
                $(".shadeDelete").removeClass("shadeDelete");
                $(".deletedLi").removeClass("deletedLi");

                $(".broadcastDialog").addClass("hidden");
            })

            // deleteDialog ok click
            $(".deleteDialog .btnBox .ok").click(function(){
                var msg_id = $(".shadeDelete").attr("msg_id");
                $(".shadeDelete").remove();
                $.ajax({
                    url: "/api/v1/official/article/message/"+msg_id,
                    type: "DELETE",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (cont, txtStatus, xhr) {
                        if (xhr.status != 200) {
                            return false;
                        }else{
                            allMessageNum--;
                            $(".titleHead .hasStyle").text(Lang.str('app_article_inTotal',allMessageNum));
                        }
                    }
                })
                $(".deleteDialog").addClass("hidden");
            })
            // deactivateDialog ok click
            $(".deactivateDialog .btnBox .ok").click(function(){
                var content_id = $(".deletedLi").attr("content_id");
                $(".deletedLi").addClass("deleted").find(".del").addClass("isdisabled").text(Lang.str("app_broadcast_deactivated"));
                $.ajax({
                    url: "/api/v1/official/article/content/"+content_id,
                    type: "DELETE",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (cont, txtStatus, xhr) {
                        if(xhr.status!=200){
                            return false;
                        }
                    }
                })
                $(".deactivateDialog").addClass("hidden");
            })
            // cancel click
            $(".dialogfoot .btnBox .cancel").click(function(){
                //取消应该删除的项
                $(".shadeDelete").removeClass("shadeDelete");
                $(".deletedLi").removeClass("deletedLi");

                $(".broadcastDialog").addClass("hidden");
            })


            //del edit click

            $(".articleCon").on("click","a",function(){
                if($(this).hasClass("isdisabled")){
                    return false;
                }else if($(this).hasClass("del")){
                    var li=$(this).closest("li"),
                        id=li.attr("id"),
                        drafting=false;
                    if(li.hasClass("drafting")){
                        drafting=true;
                        $(".deleteDialog").removeClass("hidden");
                        li.closest(".imgWordsList").addClass("shadeDelete");

                    }else{
                        $(".deactivateDialog").removeClass("hidden");
                        li.addClass("deletedLi").siblings("li").removeClass("deletedLi").closest(".imgWordsList").siblings(".imgWordsList").find("li").removeClass("deletedLi");
                    }

                }
            })






            //show article or img content
            $(".conHandle ul li a").click(function(){
                /*if($(this).hasClass("picBtn")){
                 $(".articleHead").addClass("hidden");
                 $(".picHead").removeClass("hidden");

                 $(".articleSearch").addClass("hidden");
                 $(".picSearch").removeClass("hidden");

                 $(".articleCon").addClass("hidden");
                 $(".picCon").removeClass("hidden");
                 }else{
                 $(".articleHead").removeClass("hidden");
                 $(".picHead").addClass("hidden");

                 $(".articleSearch").removeClass("hidden");
                 $(".picSearch").addClass("hidden");

                 $(".articleCon").removeClass("hidden");
                 $(".picCon").addClass("hidden");
                 }
                 $(this).closest("li").addClass("on").siblings("li").removeClass("on");*/
            })

        })
    }

    resetImagePath(url,width,height){
        if (url&&/(.png|.jpg|.jpeg|.bmp|.gif)$/.test(url)){
            var index = url.lastIndexOf(".");
            var startUrl = url.substring(0,index);
            url = url.replace(startUrl, startUrl+'_'+width+'x'+height);
        }
        return url;
    }

    render(){
        return (
        <div>
            <div id="" className="articlePic">
                <h2 className="articleHead titleHead">{Lang.str("app_article_articleList")}<span className="hasStyle"></span></h2>
                <h2 className="picHead titleHead hidden">Image List<span className="hasStyle"></span></h2>
                <div className="conHandle clearfix">
                    <ul>
                        <li className="on"><a className="articleBtn" href="javascript:;">{Lang.str("app_article_articleText")}</a></li>
                        <li><a className="picBtn disabled hidden" href="javascript:;">{Lang.str("app_article_image")}</a></li>
                    </ul>
                    <div className="searchBox articleSearch">
                        <a className="searchit" href="javascript:;"></a>
                        <input className="searchInput" placeholder={Lang.str("app_broadcast_searchInput_placeholder")} type="text" />
                    </div>
                    <div className="searchBox picSearch hidden">
                        <a className="searchit" href="javascript:;"></a>
                        <input className="searchInput" placeholder={Lang.str("app_article_search")} type="text" />
                    </div>
                </div>
                <div className="content">
                    <div className="articleCon">
                        <div className="childCon"></div>
                        <a className="getMore hidden" href="javascript:;">{Lang.str("app_broadcast_viewMore")}</a>
                    </div>

                    <div className="picCon hidden">
                        <ul>
                            <li></li>
                        </ul>
                    </div>
                </div>
                <div className="noData hidden">
                    {Lang.str("app_article_noQueryResult")}
                </div>
            </div>
            <div className="broadcastDialog deleteDialog dialogShadow hidden">
                <div className="dialogWrap">
                    <div className="dialogHead">
                        <h2>{Lang.str("app_article_delete")}</h2>
                        <a className="close" href="javascript:;"></a>
                    </div>
                    <div className="dialogContent">
                        <p className="msg">{Lang.str("app_broadcast_deleteArticleMsg")}</p>
                    </div>
                    <div className="dialogfoot">
                        <div className="clearfix btnBox">
                            <a className="ok active" href="javascript:;">{Lang.str("app_article_confirm")}</a>
                            <a className="cancel" href="javascript:;">{Lang.str("app_article_cancel")}</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="broadcastDialog deactivateDialog dialogShadow hidden">
                <div className="dialogWrap">
                    <div className="dialogHead">
                        <h2>{Lang.str("app_broadcast_deactivate")}</h2>
                        <a className="close" href="javascript:;"></a>
                    </div>
                    <div className="dialogContent">
                        <p className="msg">{Lang.str("app_broadcast_deactivateArticleMsg")}</p>
                    </div>
                    <div className="dialogfoot">
                        <div className="clearfix btnBox">
                            <a className="ok active" href="javascript:;">{Lang.str("app_article_confirm")}</a>
                            <a className="cancel" href="javascript:;">{Lang.str("app_article_cancel")}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default Artical;
