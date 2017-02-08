import React from 'react'
import $ from 'jquery'
import Lang from "lang/Lang"
import tools from 'utils/tools'
import {PersonalInfoUtil} from 'app/setting/personalInfomation/PersonalInfoUtil'

export class AccountInformation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount(){         
        var getData=function(){                   
    
            $.ajax({
                url: '/api/v1/official/account',
                type: 'GET',
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                async: true,
                success: function (cont, txtStatus, xhr) {
                    if(xhr.status!=200){
                        return false;
                    }
                    var data=xhr.responseJSON;
                    var li="";
                        if(data.company_name==null){data.company_name=""};
                        if(data.official_type==0){
                            data.official_type="Enterprise Account";
                        }
                        else{
                            data.official_type="";
                        }

                    var imgsrc=data.avatar||"";
                    imgsrc=imgsrc.replace(/_60x60/g,"");
                    var imgsrcStart=imgsrc.slice(0,imgsrc.length-4);
                    var imgsrcEnd4=imgsrc.slice(imgsrc.length-4);
                    imgsrc=imgsrcStart+"_60x60"+imgsrcEnd4;

                       li+= '<li class="dstable logoWrap" id="settingLogo"><em class="publicAccountLogoTitle">'+ Lang.str('app_setting_AccountInfo_Title_Logo') +'</em> <img src="'+imgsrc+'" alt="logo" class="publicAccountLogo"/>'
                       
                       +'<div class="changePhoto"><label style={{color: "#007aff"}}><input class="hide" id="input-changePhoto" ref="uploadAvatar" type="file" accept="image/png,image/gif,image/jpg"/><a class="btn-change-avatar">'
                       +Lang.str("app_setting_AccountInfo_Edit_ChangePoto")+'</a></label><a class="changePhoto"><i class="format">'+Lang.str("app_setting_AccountInfo_Edit_PotoFormat")+'</i><em class="photoSize">'+Lang.str("app_setting_AccountInfo_Edit_PotoSize")+'</em></a></div>'                
                       
                       + '<div class="progressShow hidden"><span class="percentage"></span><div class="progressBar"><div class="passedProgress"></div></div><div class="mask"></div></div></li>'
                              +'  <li class="dstable qacodeWrap"><em class="publicAccountLogoQacodeTitle">' + Lang.str('app_setting_AccountInfo_Title_QR') + '</em> <img id="qrcode" src="/api/v1/cs/qrcode?' + new Date().getMilliseconds() + '" alt="qacode" class="qacode"/></li>'
                              +'  <li><em>' + Lang.str('app_setting_AccountInfo_Title_Name') +'</em> <span>'+data.name+'</span></li>'
                              +'  <li><em>' + Lang.str('app_setting_AccountInfo_Title_AccountCategory') + '</em> <span>'+data.official_type+'</span></li>'
                              +'  <li class="dstable mb16"><em class="introductionContentTitle">' + Lang.str('app_setting_AccountInfo_Title_Intro') + '</em><span class="introductionContentWrap"></span><textarea disabled="disabled"  class="introductionContent" name="introductionContent" maxLength="300"></textarea></li>'
                              +'  <li><em>' + Lang.str('app_setting_AccountInfo_Title_OrgName') + '</em> <span>'+data.company_name+'</span></li>'
                              +'  <li class="h29"><em>' + Lang.str('app_setting_AccountInfo_Title_ServiceCategory') + '</em><input disabled="disabled" class="serviceTypeContent" name="serviceType" maxLength="20"/></li>'


                    $(".accInfoBody ul").html(li);
                    $(".introductionContentWrap").css("display","inline-block");
                    $(".introductionContentWrap").text(data.description);
                    $("textarea.introductionContent").val(data.description);
                    $("textarea.introductionContent").css("display","none");
                    $("input[name=serviceType]").val(data.service_type);
                    $("input[name=serviceType]").attr("placeholder", "");
                    $(".accInfoJsEdit").click(function(){
                       $("textarea.introductionContent").css("display","inline");
                       $(".introductionContentWrap").css("display","none");
                       $("textarea.introductionContent").addClass('borderDisplay').removeAttr("disabled");
                       $("input[name=serviceType]").addClass('borderDisplay').removeAttr("disabled");
                       $("input[name=serviceType]").attr("placeholder", "e.g.Media");//fcj.lang
                       $(".changePhoto").css("display","inline-block");
                       $(".accinfoTip").removeClass("hidden");
                       $(".accInfoOperation").removeClass("hidden");
                       $(".accInfoJsEdit").css("display","none");


                    });
                    
                    $("#input-changePhoto").change(function(){
                        let fileToLoad = event.target.files[0];
                        var fileSize = fileToLoad.size;
                        var fileReader = new FileReader();        
                        fileReader.onload = function(fileLoadedEvent)
                        {            
                            let content = fileLoadedEvent.target.result;
                            var xhr = new XMLHttpRequest();
                            var uploadStart = function(){
                                if(fileSize > 5242880){ //如果图片大于5M则弹窗提示
                                    $.messageBox({message:Lang.str('app_setting_personalInformation_PhotoSizeErrorTip'),level: "error"});
                                    $("input.photoSelect").val("");
                                    return false;
                                }else {                   
                                    var successfulCallBack = function (e) {
                                        if (e.target.status != 200) {
                                            $.messageBox({message:Lang.str('app_setting_personalInformation_UploadAvatarFailed'),level: "error"});
                                        } else {                                                       
                                            var resp = eval("(" + e.target.responseText + ")");
                                            var newUrl = resp.data.url;                                                        

                                            //指定上传图片的缩略图
                                            if (newUrl.length > 0) {
                                                newUrl=newUrl.replace(/_60x60/g,"");
                                                var imgsrcStart=newUrl.slice(0,newUrl.length-4);
                                                var imgsrcEnd4=newUrl.slice(newUrl.length-4);
                                                newUrl=imgsrcStart+"_60x60"+imgsrcEnd4;

                                                $(".publicAccountLogo").attr("src", newUrl);

                                            }

                                        }                      
                                        $(".progressShow").addClass("hidden");                        
                                        $(".progressShow .passedProgress").css("width","0");
                                    }
                                    xhr.addEventListener("load", successfulCallBack, false); // 处理上传完成
                                }
                            }

                            xhr.addEventListener("loadstart", uploadStart, false); // 处理上传完成

                            var failCallBack = function(){
                            }

                            xhr.addEventListener("error", failCallBack, false); // 处理上传失败
                            xhr.addEventListener("abort", failCallBack, false); // 处理取消上传
                            var formData = new FormData();
                            formData.append('file', fileToLoad);            
                            xhr.upload.onprogress = function(evt) {
                                if(fileSize>5242880){
                                    return false;
                                } else {                    
                                    var loaded = evt.loaded;
                                    var tot = evt.total;
                                    var per = Math.floor(100 * loaded / tot); //已经上传的百分比                                        
                                                        
                                    $(".progressShow").removeClass("hidden");                    
                                    $(".progressShow .passedProgress").css("width",per+"%");
                                    $(".progressShow .percentage").text(per+"%");
                                    
                                }
                            };
                            xhr.open('post', '/upload/file5/upload/official.json?type=avatar');
                            xhr.send(formData);
                        };
                        fileReader.readAsDataURL(fileToLoad);
                    });

                }
            })
        }
        getData();
                
                
        $(".jsaccInfoSubmit").click(function(){
            var obj={};
            obj.description = $("textarea.introductionContent").val();
            obj.service_type = $("input[name=serviceType]").val();
            obj.avatar = $(".publicAccountLogo").attr("src").replace(/_60x60/g,"");
            $.ajax({
                url: '/api/v1/official/account',
                type: 'PUT',
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                data:JSON.stringify(obj),
                async: true,
                success: function (cont, txtStatus, xhr) {
                    $("#qrcode").attr("src", "/api/v1/cs/qrcode?" + new Date().getMilliseconds());
                    $.messageBox({message:Lang.str('app_setting_AccountInfo_Edit_Submitted'),level: "success"});

                }
            });
            $(".introductionContentWrap").text(obj.description);
            $(".introductionContentWrap").css("display","inline-block");
            $("textarea.introductionContent").removeClass('borderDisplay').attr("disabled","disabled");
            $("textarea.introductionContent").css("display","none");
            $("input[name=serviceType]").removeClass('borderDisplay').attr("disabled","disabled");
            $("input[name=serviceType]").attr("placeholder", "");//非编辑状态不展示placeholder
            $(".changePhoto").css("display","none");
            $(".accinfoTip").addClass("hidden");
            $(".accInfoOperation").addClass("hidden");
            $(".accInfoJsEdit").css("display","inline-block");
        });


        $(".jsaccInfoCancel").click(function(){

            getData();
            $("textarea.introductionContent").removeClass('borderDisplay').attr("disabled","disabled");
            $("input[name=serviceType]").removeClass('borderDisplay').attr("disabled","disabled");
            $("input[name=serviceType]").attr("placeholder", "");//非编辑状态不展示placeholder
            $(".changePhoto").css("display","none");
            $(".accinfoTip").addClass("hidden");
            $(".accInfoOperation").addClass("hidden");
            $(".accInfoJsEdit").css("display","inline-block");
        });
               
    }


    render() {
        return (
            <div className="publicAccount pl40">
                <div className="accInfoHead clearfix">
                    <h3>{Lang.str('app_setting_AccountInfo_Title_Detail')}</h3>                    
                    <a className="accInfoJsEdit">{Lang.str('app_setting_AccountInfo_Edit')}</a>
                    <i className="accInfoTitleNote">{Lang.str('app_setting_AccountInfo_Title')}</i>
                </div>
                <div className="accInfoBody">
                    <ul>

                    </ul>
                </div>
                <p className="accinfoTip hidden">{Lang.str('app_setting_AccountInfo_Edit_EffectiveTime')}</p>
                <div className="accInfoOperation hidden">
                    <button className="accInfoSubmit jsaccInfoSubmit">{Lang.str('app_setting_AccountInfo_Edit_Submit')}</button>
                    <button className="accInfoCancel jsaccInfoCancel">{Lang.str('app_setting_AccountInfo_Edit_Cancel')}</button>
                </div>
            </div>
        );
    }
}

export default AccountInformation;