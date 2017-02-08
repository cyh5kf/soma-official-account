import React from 'react'
import Lang from "lang/Lang"
import $ from 'jquery'
import tools from 'utils/tools'
import editOperation from "app/setting/setEditorTeam/editOperation"



export class SetEditorTeam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorData:"",
            isFirstClick:true
        };
    }
    componentDidMount(){
        var that = this;
        var resetTag = 0;
        var getData=function(){
            $.ajax({
                url: '/api/v1/cs/agent/listeditor',
                type: 'GET',
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                async: false,
                success: function (cont, txtStatus, xhr) {
                    if(xhr.status!=200){
                        return false;
                    }
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
                    data.splice(index,1);
                    data.unshift(specItem);
                    
                    that.state.editorData = data;
                    that.setState(that.state);                        
                }
            })
        }
        getData();
        $(".addEditorDialogBg input[name='Register-Email']").attr({"autocomplete":"off"});
        $(".addEditorDialogBg input[name='password']").attr({"autocomplete":"off"});
        $(".addEditorDialogBg input[name='ConfirmPassword']").attr({"autocomplete":"off"});

        $(".addEditor").click(function(){
            var arr = that.state.editorData;

            if(arr.length <6){

                $(".jsaddEditorDialog input[name=Register-Email]").val("");
                $(".jsaddEditorDialog input[name=password]").val("");
                $(".jsaddEditorDialog input[name=ConfirmPassword]").val("");
                $(".jsaddEditorDialog input[name=name]").val("");
                $(".jsaddEditorDialog input[name=ID]").val("");
                $(".jsaddEditorDialog .jsInfoTip").html("");
                $(".jsaddEditorDialog .jsNameContent").html("");
                $(".jsaddEditorDialog .jsPasswordInfoTip").html("");
                $(".jsaddEditorDialog .jsPasswordContrast").html("");
                $(".jsaddEditorDialog  input[name=password]").css("border-color","#c8c8cd");
                $(".jsaddEditorDialog  input[name=ConfirmPassword]").css("border-color","#c8c8cd");
                $(".jsaddEditorDialog  input[name=name]").css("border-color","#c8c8cd");
                $(".jsaddEditorDialog input[name=Register-Email]").css("border-color","#c8c8cd");
                $(".jsaddEditorDialog").removeClass('hidden');
                $(".jsaddEditorDialog .infoError").addClass("hidden");
                $(".addEditor").addClass("btn-blue").removeClass("btnHover-gray");
            }else{

                $(".addEditor").removeClass("btn-blue").addClass("btnHover-gray");
                return false;
            }


        });


        $(".publicAccount").on('click','.addEditorDialogBg .close',function(){
            $(".editorTr").removeClass("editorTr");
            $(".removeTr").removeClass("removeTr");

            $(".addEditorDialogBg").addClass('hidden');
        });

        $(".addEditorDialogBg .jscancel").click(function(){
            $(".editorTr").removeClass("editorTr");
            $(".removeTr").removeClass("removeTr");

            $(".addEditorDialogBg").addClass('hidden');
        });

        var saveAndSend=function(args){
            var obj={};
            var pwdConfirm = $(".jsaddEditorDialog  input[name=ConfirmPassword]").val();
            var reg1 = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            obj.email = $(".jsaddEditorDialog  input[name=Register-Email]").val();
            obj.password = $(".jsaddEditorDialog  input[name=password]").val();
            var newName = $(".jsaddEditorDialog  input[name=name]").val();
            obj.name = newName.replace(/(^\s*|\s*$)/g,"");
            obj.csid = $(".jsaddEditorDialog  input[name=ID]").val();
            var url="/api/v1/cs/agent/editor";
            var type="POST";
            if(args){
        	var url="/api/v1/cs/agent/editor/"+args;
     		type="PUT"
            }

            if(obj.email==""){
                $(".jsaddEditorDialog .jsPasswordInfoTip").html("");
                $(".jsaddEditorDialog .jsPasswordContrast").html("");
                $(".jsaddEditorDialog .jsNameContent").html("");
                $(".jsaddEditorDialog .jsInfoTip").removeClass("hidden infoPass").addClass("infoError").html(Lang.str('app_setting_SetEditorTeam_SettingEmptyTip'));
                $(".jsaddEditorDialog  input[name=password]").css("border-color","#c8c8cd");
                $(".jsaddEditorDialog  input[name=ConfirmPassword]").css("border-color","#c8c8cd");
                $(".jsaddEditorDialog  input[name=name]").css("border-color","#c8c8cd");
                $(".jsaddEditorDialog input[name=Register-Email]").css("border-color","#de2222");
                return false;

            }else{

                if (!reg1.test(obj.email)) {
                    $(".jsaddEditorDialog .jsPasswordInfoTip").html("");
                    $(".jsaddEditorDialog .jsPasswordContrast").html("");
                    $(".jsaddEditorDialog .jsNameContent").html("");
                    $(".jsaddEditorDialog .jsInfoTip").removeClass("hidden infoPass").addClass("infoError");
                    $(".jsaddEditorDialog .jsInfoTip").html(Lang.str('app_setting_SetEditorTeam_SettingEamilCheck'));
                    $(".jsaddEditorDialog  input[name=password]").css("border-color","#c8c8cd");
                    $(".jsaddEditorDialog  input[name=ConfirmPassword]").css("border-color","#c8c8cd");
                    $(".jsaddEditorDialog  input[name=name]").css("border-color","#c8c8cd");
                    $(".jsaddEditorDialog input[name=Register-Email]").css("border-color","#de2222");
                    return false;

                }else{

                    $(".jsaddEditorDialog .jsInfoTip").removeClass("hidden infoError").addClass("infoPass").html("");
                    $(".jsaddEditorDialog  input[name=password]").css("border-color","#c8c8cd");
                    $(".jsaddEditorDialog  input[name=ConfirmPassword]").css("border-color","#c8c8cd");
                    $(".jsaddEditorDialog  input[name=name]").css("border-color","#c8c8cd");
                    $(".jsaddEditorDialog input[name=Register-Email]").css("border-color","#c8c8cd");

                }
            }


            if(obj.password==""){

                $(".jsaddEditorDialog .jsNameContent").html("");
                $(".jsaddEditorDialog .jsPasswordContrast").html("");
                $(".jsaddEditorDialog .jsPasswordInfoTip").html("");
                $(".jsaddEditorDialog .jsInfoTip").html("");
                $(".jsaddEditorDialog .jsPasswordInfoTip").removeClass("hidden infoPass").addClass("infoError").html(Lang.str('app_setting_SetEditorTeam_SettingEmptyTip'));
                $(".jsaddEditorDialog  input[name=password]").css("border-color","#de2222");
                $(".jsaddEditorDialog  input[name=ConfirmPassword]").css("border-color","#c8c8cd");
                $(".jsaddEditorDialog  input[name=name]").css("border-color","#c8c8cd");
                $(".jsaddEditorDialog input[name=Register-Email]").css("border-color","#c8c8cd");
                return false;
            }else{
                if(obj.password.length<6){

                    $(".jsaddEditorDialog .jsNameContent").html("");
                    $(".jsaddEditorDialog .jsPasswordContrast").html("");
                    $(".jsaddEditorDialog .jsPasswordInfoTip").html("");
                    $(".jsaddEditorDialog .jsInfoTip").html("");
                    $(".jsaddEditorDialog .jsPasswordInfoTip").removeClass("hidden infoPass").addClass("infoError").html(Lang.str('app_setting_SetEditorTeam_SettingPasswordLengthCheck'));
                    $(".jsaddEditorDialog  input[name=password]").css("border-color","#de2222");
                    $(".jsaddEditorDialog  input[name=ConfirmPassword]").css("border-color","#c8c8cd");
                    $(".jsaddEditorDialog  input[name=name]").css("border-color","#c8c8cd");
                    $(".jsaddEditorDialog input[name=Register-Email]").css("border-color","#c8c8cd");
                    return false;
                }else{
                    if(pwdConfirm==""){
                        $(".jsaddEditorDialog .jsNameContent").html("");
                        $(".jsaddEditorDialog .jsInfoTip").html("");
                        $(".jsaddEditorDialog .jsPasswordInfoTip").html("");
                        $(".jsaddEditorDialog .jsPasswordContrast").html("");
                        $(".jsaddEditorDialog .jsPasswordContrast").removeClass("hidden infoPass").addClass("infoError").html(Lang.str('app_setting_SetEditorTeam_SettingEmptyTip'));
                        $(".jsaddEditorDialog  input[name=password]").css("border-color","#c8c8cd");
                        $(".jsaddEditorDialog  input[name=ConfirmPassword]").css("border-color","#de2222");
                        $(".jsaddEditorDialog  input[name=name]").css("border-color","#c8c8cd");
                        $(".jsaddEditorDialog input[name=Register-Email]").css("border-color","#c8c8cd");
                        return false;
                    }else{

                        if(obj.password!==pwdConfirm){

                            $(".jsaddEditorDialog .jsNameContent").html("");
                            $(".jsaddEditorDialog .jsPasswordInfoTip").html("");
                            $(".jsaddEditorDialog .jsPasswordContrast").html("");
                            $(".jsaddEditorDialog .jsInfoTip").html("");
                            $(".jsaddEditorDialog .jsPasswordInfoTip").removeClass("hidden infoPass").addClass("infoError").html(Lang.str('app_setting_SetEditorTeam_SettingPasswordCheck'));
                            $(".jsaddEditorDialog  input[name=password]").css("border-color","#c8c8cd");
                            $(".jsaddEditorDialog  input[name=ConfirmPassword]").css("border-color","#de2222");
                            $(".jsaddEditorDialog  input[name=name]").css("border-color","#c8c8cd");
                            $(".jsaddEditorDialog input[name=Register-Email]").css("border-color","#c8c8cd");
                            return false;
                        }else{

                            $(".jsaddEditorDialog .jsPasswordInfoTip").addClass("infoPass").removeClass("infoError").html("");
                            $(".jsaddEditorDialog .jsPasswordContrast").addClass("infoPass").removeClass("infoError hidden").html("");
                            $(".jsaddEditorDialog  input[name=password]").css("border-color","#c8c8cd");
                            $(".jsaddEditorDialog  input[name=ConfirmPassword]").css("border-color","#c8c8cd");
                            $(".jsaddEditorDialog  input[name=name]").css("border-color","#c8c8cd");
                            $(".jsaddEditorDialog input[name=Register-Email]").css("border-color","#c8c8cd");
                        }
                    }

                }


            }

            if(pwdConfirm==""){
                $(".jsaddEditorDialog .jsNameContent").html("");
                $(".jsaddEditorDialog .jsPasswordInfoTip").html("");
                $(".jsaddEditorDialog .jsPasswordContrast").html("");
                $(".jsaddEditorDialog .jsInfoTip").html("");
                $(".jsaddEditorDialog .jsPasswordContrast").removeClass("hidden infoPass").addClass("infoError").html(Lang.str('app_setting_SetEditorTeam_SettingEmptyTip'));
                $(".jsaddEditorDialog  input[name=password]").css("border-color","#c8c8cd");
                $(".jsaddEditorDialog  input[name=ConfirmPassword]").css("border-color","#de2222");
                $(".jsaddEditorDialog  input[name=name]").css("border-color","#c8c8cd");
                $(".jsaddEditorDialog input[name=Register-Email]").css("border-color","#c8c8cd");
                return false;
            }else{
                if(pwdConfirm.length<6){

                    $(".jsaddEditorDialog .jsNameContent").html("");
                    $(".jsaddEditorDialog .jsPasswordInfoTip").html("");
                    $(".jsaddEditorDialog .jsPasswordContrast").html("");
                    $(".jsaddEditorDialog .jsInfoTip").html("");
                    $(".jsaddEditorDialog .jsPasswordContrast").removeClass("hidden infoPass").addClass("infoError").html(Lang.str('app_setting_SetEditorTeam_SettingPasswordLengthCheck'));
                    $(".jsaddEditorDialog  input[name=password]").css("border-color","#c8c8cd");
                    $(".jsaddEditorDialog  input[name=ConfirmPassword]").css("border-color","#de2222");
                    $(".jsaddEditorDialog  input[name=name]").css("border-color","#c8c8cd");
                    $(".jsaddEditorDialog input[name=Register-Email]").css("border-color","#c8c8cd");
                    return false;
                }else{

                    if(obj.password!==pwdConfirm){
                        $(".jsaddEditorDialog .jsNameContent").html("");
                        $(".jsaddEditorDialog .jsPasswordInfoTip").html("");
                        $(".jsaddEditorDialog .jsInfoTip").html("");
                        $(".jsaddEditorDialog .jsPasswordContrast").html("");
                        $(".jsaddEditorDialog .jsPasswordContrast").removeClass("hidden infoPass").addClass("infoError").html(Lang.str('app_setting_SetEditorTeam_SettingPasswordCheck'));
                        $(".jsaddEditorDialog  input[name=password]").css("border-color","#c8c8cd");
                        $(".jsaddEditorDialog  input[name=ConfirmPassword]").css("border-color","#de2222");
                        $(".jsaddEditorDialog  input[name=name]").css("border-color","#c8c8cd");
                        $(".jsaddEditorDialog input[name=Register-Email]").css("border-color","#c8c8cd");
                        return false;
                    }else{

                        $(".jsaddEditorDialog .jsPasswordInfoTip").addClass("infoPass").removeClass("infoError").html("");
                        $(".jsaddEditorDialog .jsPasswordContrast").addClass("infoPass").removeClass("infoError hidden").html("");
                        $(".jsaddEditorDialog  input[name=password]").css("border-color","#c8c8cd");
                        $(".jsaddEditorDialog  input[name=ConfirmPassword]").css("border-color","#c8c8cd");
                        $(".jsaddEditorDialog  input[name=name]").css("border-color","#c8c8cd");
                        $(".jsaddEditorDialog input[name=Register-Email]").css("border-color","#c8c8cd");
                    }
                }

            }

            if(obj.name==""){

                $(".jsaddEditorDialog .jsPasswordInfoTip").html("");
                $(".jsaddEditorDialog .jsPasswordContrast").html("");
                $(".jsaddEditorDialog .jsInfoTip").html("");
                $(".jsaddEditorDialog .jsNameContent").removeClass("hidden infoPass").addClass("infoError").html(Lang.str('app_setting_SetEditorTeam_SettingEmptyTip'));
                $(".jsaddEditorDialog  input[name=password]").css("border-color","#c8c8cd");
                $(".jsaddEditorDialog  input[name=ConfirmPassword]").css("border-color","#c8c8cd");
                $(".jsaddEditorDialog  input[name=name]").css("border-color","#de2222");
                $(".jsaddEditorDialog input[name=Register-Email]").css("border-color","#c8c8cd");
                return false;
            }else{

                $(".jsaddEditorDialog .jsNameContent").addClass("infoPass").removeClass("infoError").html("");
                $(".jsaddEditorDialog  input[name=password]").css("border-color","#c8c8cd");
                $(".jsaddEditorDialog  input[name=ConfirmPassword]").css("border-color","#c8c8cd");
                $(".jsaddEditorDialog  input[name=name]").css("border-color","#c8c8cd");
                $(".jsaddEditorDialog input[name=Register-Email]").css("border-color","#c8c8cd");
            }


            $.ajax({

                url: url,
                type: type,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data:JSON.stringify(obj),
                success: function (cont, txtStatus, xhr) {

                    if(xhr.status==200){                        
                        $.messageBox({message:Lang.str('app_setting_SetEditorTeam_EditorAdded'),level: "success"});
                        $(".jsaddEditorDialog").addClass('hidden');
                        $(".editorTr").removeClass("editorTr");                        
                        getData();
                    }
                    if(xhr.status==207){
                        $(".jsaddEditorDialog .jsPasswordInfoTip").html("");
                        $(".jsaddEditorDialog .jsPasswordContrast").html("");
                        $(".jsaddEditorDialog .jsInfoTip").html("");
                        $(".jsaddEditorDialog input[name=Register-Email]").css("border-color","#de2222");
                        $(".jsaddEditorDialog .jsNameContent").removeClass("hidden infoPass").addClass("infoError").html(Lang.str('app_setting_teamAndGroup_emailExists'));
                    }
                }
            });

        };

        $(".jsaddEditorDialog .jssave").click(function(){
            saveAndSend();

        });

            
        $(".publicAccount").on("click",".canHover",function(){
            if(!that.state.isFirstClick||$(this).hasClass("removeTr")
            || $(this).hasClass("btnDel")){
                return;
            }
            resetTag = 0;
            that.state.isFirstClick = false;
            var aid=$(this).closest("li").attr("data-aid");            
            $(this).closest("li").addClass("editorTr");
            $.ajax({
                type: "GET",
                url: "/api/v1/cs/agent/"+aid,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (cont, txtStatus, xhr) {
                    if(xhr.status==200){
                        $(".jseditorCustomerDialog .passwordSize").removeClass("hidden");
                        $(".jseditorCustomerDialog .passwordEdit").addClass("hidden")
                        $(".jseditorCustomerDialog .mustTag").addClass("hidden");
                        $(".jseditorCustomerDialog").removeClass('hidden');
                        $(".jseditorCustomerDialog .confirmPassword input").val("");
                        $(".jseditorCustomerDialog .confirmPassword").addClass("hidden");
                        $(".jseditorCustomerDialog .reset").removeClass("hidden");
                        $(".jseditorCustomerDialog input[name=password]").css("border-color","#c8c8cd");
                        $(".jseditorCustomerDialog input[name=ConfirmPassword]").css("border-color","#c8c8cd");
                        $(".jseditorCustomerDialog input[name=name]").css("border-color","#c8c8cd");
                        $(".jseditorCustomerDialog input[name=Register-Email]").css("border-color","#c8c8cd");

                        var data=xhr.responseJSON;
                        $("input[name=Register-Email]").val(data.email);
                        $("input[name=password]").val("********");
                        $("input[name=name]").val(data.name);
                        $("input[name=ID]").val(data.csid);
                        $(".jsInfoTip").html("");
                        $(".jsNameContent").html("");
                        $(".jsPasswordInfoTip").html("");
                        $(".jsPasswordContrast").html("");
                        that.state.isFirstClick = true;
                        getData();

                    }

                }
            });
            $(".jseditorCustomerDialog .passwordEdit").addClass("havenPassword").attr('disabled', 'disabled');
            return false;
        });        

        var saveAndSendEdit=function(args){
            var obj={};
            var pwdConfirm = $(".jseditorCustomerDialog input[name=ConfirmPassword]").val();
            var reg1 = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            obj.email = $(".jseditorCustomerDialog input[name=Register-Email]").val();
            if (!$(".jseditorCustomerDialog input.passwordEdit").hasClass("havenPassword")
            &&!$(".confirmPassword").hasClass("hidden")){
                obj.password = $(".jseditorCustomerDialog input[name=password]").val();
            }
            var newName = $(".jseditorCustomerDialog input[name=name]").val();
            obj.name = newName.replace(/(^\s*|\s*$)/g,"");
            obj.csid = $(".jseditorCustomerDialog input[name=ID]").val();

            if(obj.email==""){
                $(".jseditorCustomerDialog .jsPasswordContrast").html("");
                $(".jseditorCustomerDialog .jsPasswordInfoTip").html("");
                $(".jseditorCustomerDialog .jsNameContent").html("");
                $(".jseditorCustomerDialog .jsInfoTip").removeClass("hidden infoPass").addClass("infoError").html(Lang.str('app_setting_SetEditorTeam_SettingEmptyTip'));
                $(".jseditorCustomerDialog input[name=password]").css("border-color","#c8c8cd");
                $(".jseditorCustomerDialog input[name=ConfirmPassword]").css("border-color","#c8c8cd");
                $(".jseditorCustomerDialog input[name=name]").css("border-color","#c8c8cd");
                $(".jseditorCustomerDialog input[name=Register-Email]").css("border-color","#de2222");
                return false;

            }else{

                if (!reg1.test(obj.email)) {
                    $(".jseditorCustomerDialog .jsPasswordContrast").html("");
                    $(".jseditorCustomerDialog .jsPasswordInfoTip").html("");
                    $(".jseditorCustomerDialog .jsNameContent").html("");
                    $(".jseditorCustomerDialog .jsInfoTip").removeClass("hidden infoPass").addClass("infoError");
                    $(".jseditorCustomerDialog .jsInfoTip").html(Lang.str('app_setting_SetEditorTeam_SettingEamilCheck'));
                    $(".jseditorCustomerDialog input[name=password]").css("border-color","#c8c8cd");
                    $(".jseditorCustomerDialog input[name=ConfirmPassword]").css("border-color","#c8c8cd");
                    $(".jseditorCustomerDialog input[name=name]").css("border-color","#c8c8cd");
                    $(".jseditorCustomerDialog input[name=Register-Email]").css("border-color","#de2222");
                    return false;

                }else{

                    $(".jseditorCustomerDialog .jsInfoTip").removeClass("hidden infoError").addClass("infoPass").html("");
                    $(".jseditorCustomerDialog input[name=password]").css("border-color","#c8c8cd");
                    $(".jseditorCustomerDialog input[name=ConfirmPassword]").css("border-color","#c8c8cd");
                    $(".jseditorCustomerDialog input[name=name]").css("border-color","#c8c8cd");
                    $(".jseditorCustomerDialog input[name=Register-Email]").css("border-color","#c8c8cd");

                }
            }



            if(resetTag){

                if(obj.password==""){

                    $(".jseditorCustomerDialog .jsPasswordContrast").html("");
                    $(".jseditorCustomerDialog .jsPasswordInfoTip").html("");
                    $(".jseditorCustomerDialog .jsNameContent").html("");
                    $(".jseditorCustomerDialog .jsInfoTip").html("");
                    $(".jseditorCustomerDialog .jsPasswordInfoTip").removeClass("hidden infoPass").addClass("infoError").html(Lang.str('app_setting_SetEditorTeam_SettingEmptyTip'));
                    $(".jseditorCustomerDialog input[name=password]").css("border-color","#de2222");
                    $(".jseditorCustomerDialog input[name=ConfirmPassword]").css("border-color","#c8c8cd");
                    $(".jseditorCustomerDialog input[name=name]").css("border-color","#c8c8cd");
                    $(".jseditorCustomerDialog input[name=Register-Email]").css("border-color","#c8c8cd");
                    return false;
                }else{
                    if(obj.password.length<6){

                        $(".jseditorCustomerDialog .jsPasswordContrast").html("");
                        $(".jseditorCustomerDialog .jsPasswordInfoTip").html("");
                        $(".jseditorCustomerDialog .jsNameContent").html("");
                        $(".jseditorCustomerDialog .jsInfoTip").html("");
                        $(".jseditorCustomerDialog .jsPasswordInfoTip").removeClass("hidden infoPass").addClass("infoError").html(Lang.str('app_setting_SetEditorTeam_SettingPasswordLengthCheck'));
                        $(".jseditorCustomerDialog input[name=password]").css("border-color","#de2222");
                        $(".jseditorCustomerDialog input[name=ConfirmPassword]").css("border-color","#c8c8cd");
                        $(".jseditorCustomerDialog input[name=name]").css("border-color","#c8c8cd");
                        $(".jseditorCustomerDialog input[name=Register-Email]").css("border-color","#c8c8cd");
                        return false;
                    }else {
                        if(pwdConfirm == ""){
                            $(".jseditorCustomerDialog .jsPasswordContrast").html("");
                            $(".jseditorCustomerDialog .jsPasswordInfoTip").html("");
                            $(".jseditorCustomerDialog .jsNameContent").html("");
                            $(".jseditorCustomerDialog .jsInfoTip").html("");
                            $(".jseditorCustomerDialog .jsPasswordContrast").removeClass("hidden infoPass").addClass("infoError").html(Lang.str('app_setting_SetEditorTeam_SettingEmptyTip'));
                            $(".jseditorCustomerDialog input[name=password]").css("border-color","#c8c8cd");
                            $(".jseditorCustomerDialog input[name=ConfirmPassword]").css("border-color","#de2222");
                            $(".jseditorCustomerDialog input[name=name]").css("border-color","#c8c8cd");
                            $(".jseditorCustomerDialog input[name=Register-Email]").css("border-color","#c8c8cd");
                            return false;

                        }else{

                            if (obj.password !== pwdConfirm) {

                                $(".jseditorCustomerDialog .jsPasswordContrast").html("");
                                $(".jseditorCustomerDialog .jsPasswordInfoTip").html("");
                                $(".jseditorCustomerDialog .jsNameContent").html("");
                                $(".jseditorCustomerDialog .jsInfoTip").html("");
                                $(".jseditorCustomerDialog .jsPasswordInfoTip").removeClass("hidden infoPass").addClass("infoError").html(Lang.str('app_setting_SetEditorTeam_SettingPasswordCheck'));
                                $(".jseditorCustomerDialog input[name=password]").css("border-color","#de2222");
                                $(".jseditorCustomerDialog input[name=ConfirmPassword]").css("border-color","#c8c8cd");
                                $(".jseditorCustomerDialog input[name=name]").css("border-color","#c8c8cd");
                                $(".jseditorCustomerDialog input[name=Register-Email]").css("border-color","#c8c8cd");
                                return false;
                            } else {

                                $(".jseditorCustomerDialog .jsPasswordInfoTip").addClass("infoPass").removeClass("infoError").html("");
                                $(".jseditorCustomerDialog .jsPasswordContrast").addClass("infoPass").removeClass("infoError hidden").html("");
                                $(".jseditorCustomerDialog input[name=password]").css("border-color","#c8c8cd");
                                $(".jseditorCustomerDialog input[name=ConfirmPassword]").css("border-color","#c8c8cd");
                                $(".jseditorCustomerDialog input[name=name]").css("border-color","#c8c8cd");
                                $(".jseditorCustomerDialog input[name=Register-Email]").css("border-color","#c8c8cd");
                            }
                        }

                    }

                }

                if(pwdConfirm==""){

                    $(".jseditorCustomerDialog .jsPasswordInfoTip").html("");
                    $(".jseditorCustomerDialog .jsPasswordContrast").html("");
                    $(".jseditorCustomerDialog .jsNameContent").html("");
                    $(".jseditorCustomerDialog .jsInfoTip").html("");
                    $(".jseditorCustomerDialog .jsPasswordContrast").removeClass("hidden infoPass").addClass("infoError").html(Lang.str('app_setting_SetEditorTeam_SettingEmptyTip'));
                    $(".jseditorCustomerDialog input[name=password]").css("border-color","#c8c8cd");
                    $(".jseditorCustomerDialog input[name=ConfirmPassword]").css("border-color","#de2222");
                    $(".jseditorCustomerDialog input[name=name]").css("border-color","#c8c8cd");
                    $(".jseditorCustomerDialog input[name=Register-Email]").css("border-color","#c8c8cd");
                    return false;
                }else{
                    if(pwdConfirm.length<6){
                        $(".jseditorCustomerDialog .jsPasswordInfoTip").html("");
                        $(".jseditorCustomerDialog .jsPasswordContrast").html("");
                        $(".jseditorCustomerDialog .jsNameContent").html("");
                        $(".jseditorCustomerDialog .jsInfoTip").html("");
                        $(".jseditorCustomerDialog .jsPasswordContrast").removeClass("hidden infoPass").addClass("infoError").html(Lang.str('app_setting_SetEditorTeam_SettingPasswordLengthCheck'));
                        $(".jseditorCustomerDialog input[name=password]").css("border-color","#c8c8cd");
                        $(".jseditorCustomerDialog input[name=ConfirmPassword]").css("border-color","#de2222");
                        $(".jseditorCustomerDialog input[name=name]").css("border-color","#c8c8cd");
                        $(".jseditorCustomerDialog input[name=Register-Email]").css("border-color","#c8c8cd");
                        return false;
                    }else {
                        if (obj.password !== pwdConfirm) {

                            $(".jseditorCustomerDialog .jsPasswordInfoTip").html("");
                            $(".jseditorCustomerDialog .jsPasswordContrast").html("");
                            $(".jseditorCustomerDialog .jsNameContent").html("");
                            $(".jseditorCustomerDialog .jsInfoTip").html("");
                            $(".jseditorCustomerDialog .jsPasswordContrast").removeClass("hidden infoPass").addClass("infoError").html(Lang.str('app_setting_SetEditorTeam_SettingPasswordCheck'));
                            $(".jseditorCustomerDialog input[name=password]").css("border-color","#c8c8cd");
                            $(".jseditorCustomerDialog input[name=ConfirmPassword]").css("border-color","#de2222");
                            $(".jseditorCustomerDialog input[name=name]").css("border-color","#c8c8cd");
                            $(".jseditorCustomerDialog input[name=Register-Email]").css("border-color","#c8c8cd");
                            return false;
                        } else {
                            $(".jseditorCustomerDialog .jsPasswordInfoTip").addClass("infoPass").removeClass("infoError").html("");
                            $(".jseditorCustomerDialog .jsPasswordContrast").addClass("infoPass").removeClass("infoError hidden").html("");
                            $(".jseditorCustomerDialog input[name=password]").css("border-color","#c8c8cd");
                            $(".jseditorCustomerDialog input[name=ConfirmPassword]").css("border-color","#c8c8cd");
                            $(".jseditorCustomerDialog input[name=name]").css("border-color","#c8c8cd");
                            $(".jseditorCustomerDialog input[name=Register-Email]").css("border-color","#c8c8cd");
                        }
                    }
                }


            }

            if(obj.name==""){
                $(".jseditorCustomerDialog .jsPasswordContrast").html("");
                $(".jseditorCustomerDialog .jsPasswordInfoTip").html("");
                $(".jseditorCustomerDialog .jsInfoTip").html("");
                $(".jseditorCustomerDialog .jsNameContent").removeClass("hidden infoPass").addClass("infoError").html(Lang.str('app_setting_SetEditorTeam_SettingEmptyTip'));
                $(".jseditorCustomerDialog input[name=password]").css("border-color","#c8c8cd");
                $(".jseditorCustomerDialog input[name=ConfirmPassword]").css("border-color","#c8c8cd");
                $(".jseditorCustomerDialog input[name=name]").css("border-color","#de2222");
                $(".jseditorCustomerDialog input[name=Register-Email]").css("border-color","#c8c8cd");
                return false;
            }else{

                $(".jseditorCustomerDialog .jsNameContent").addClass("infoPass").removeClass("infoError").html("");
                $(".jseditorCustomerDialog input[name=password]").css("border-color","#c8c8cd");
                $(".jseditorCustomerDialog input[name=ConfirmPassword]").css("border-color","#c8c8cd");
                $(".jseditorCustomerDialog input[name=name]").css("border-color","#c8c8cd");
                $(".jseditorCustomerDialog input[name=Register-Email]").css("border-color","#c8c8cd");
            }



            $.ajax({

                url: "/api/v1/cs/agent/editor/"+args,
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data:JSON.stringify(obj),
                success: function (cont, txtStatus, xhr) {

                    if(xhr.status==200){
                        $.messageBox({message:Lang.str('app_setting_SetEditorTeam_ChangeSaved'),level: "success"});
                        $(".jseditorCustomerDialog").addClass('hidden');
                        $(".editorTr").removeClass("editorTr");                              
                        getData();
                    }
                    if(xhr.status==207){
                        $(".jseditorCustomerDialog input[name=Register-Email]").css("border-color","#de2222");
                        $(".jseditorCustomerDialog .jsNameContent").removeClass("hidden infoPass").addClass("infoError").html(Lang.str('app_setting_teamAndGroup_emailExists'));
                    }
                }
            });

        };

        $(".jseditorCustomerDialog .jssave").click(function(){
            var aid=$(".editorTr").attr("data-aid");
            saveAndSendEdit(aid);
        });



        $(".publicAccount").on("click",".btnDel",function(){
            $(this).closest("li").addClass("removeTr");
            $(".jsdeleteDialog").removeClass('hidden');

        });



        $(".jsdeleteDialog .jssave").click(function(){
            var aid=$(".removeTr").attr("data-aid");
            $.ajax({
                type: "DELETE",
                url: "/api/v1/cs/agent/"+aid,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (cont, txtStatus, xhr) {
                    if(xhr.status==200){
                        //$(".removeTr").remove();
                        $(".jsdeleteDialog").addClass('hidden');
                        $.messageBox({message:Lang.str('app_setting_SetEditorTeam_DeleteSuccessed'),level: "success"});                        
                        getData();
                    }
                }
            });
        });

        $(".jseditorCustomerDialog .reset").click(function(){
            resetTag = 1;
            $(".jseditorCustomerDialog .passwordSize").addClass("hidden");
            $(".jseditorCustomerDialog .passwordEdit").removeClass("havenPassword").removeClass("hidden").removeAttr("disabled");
            $(".jseditorCustomerDialog .mustTag").removeClass("hidden");
            $(".jseditorCustomerDialog .passwordEdit").val("");
            $(".jseditorCustomerDialog .confirmPassword").removeClass("hidden");
            $(".jseditorCustomerDialog .reset").addClass("hidden");

            return resetTag;
        });

        $(".jsaddEditorDialog").bind("keyup",function(){

            if(event.keyCode === 13) {
                saveAndSend();
            }
        });

        $(".jseditorCustomerDialog").bind("keyup",function(){

            if(event.keyCode === 13) {
                var aid=$(".editorTr").attr("data-aid");
                saveAndSendEdit(aid);
            }
        });

    }

    changeToPassword(e){
        if (e.target.type==='text'){
            $(e.target).attr({"type":"password"});
        }
    }
    
    handleChange(event) {        
        var targetName = event.target.name;
        var targetValue = event.target.value;
        if (targetName == 'name') {
            /*
            if (targetValue.length <= 25) {                
                $(event.target).val(targetValue.replace(/(^\s*|\s*$)/g,""));                
            }
            */
        } else if (targetName == 'ID') {
            if (targetValue.length <= 8) {
                $(event.target).val(targetValue.replace(/\s/g,""));
            }
        }else if (targetName == 'password') {                
                $(event.target).val(targetValue.replace(/\s/g,""));

        }else if (targetName == 'ConfirmPassword') {                
                $(event.target).val(targetValue.replace(/\s/g,""));
        }
    }

    render() {
        
        var editors = [];
        var data = this.state.editorData;        
        $.each(data,function(i,d){
                        if(d.csid==null){

                            d.csid="";
                        }

                        if(d.avatar==null||d.avatar==""){

                            d.avatar=require('static/images/settings/icon_portrait.png');
                        }
           
                        var showId = (d.csid != null && d.csid != "");
                        var idInfo = "ID" + " " + d.csid;

                        if(d.role==9){                        
                            d.role=require('static/images/settings/icon_admin.png');
                            if(showId){
                                editors.push(<li data-aid={d.aid}>
                                             <img src={d.avatar} alt="portrait" className="portrait"/>
                                             <span className = "editorInfo withId">
                                                <span className="nameLenSet">{d.name}</span>
                                                <span>{d.email}</span>
                                                <span>{idInfo}</span>
                                             </span>
                                             <a className="superMgrTag"></a>
                                         </li>
                                );
                            }
                            else{
                                editors.push(<li data-aid={d.aid}>
                                             <img src={d.avatar} alt="portrait" className="portrait"/>
                                             <span className = "editorInfo">
                                                <span className="nameLenSet">{d.name}</span>
                                                <span>{d.email}</span>
                                             </span>
                                             <a className="superMgrTag"></a>
                                         </li>
                                );
                            }
                        }
                        else{                            
                            if(showId){
                                editors.push(<li className="canHover" data-aid={d.aid}>
                                             <img src={d.avatar} alt="portrait" className="portrait"/>
                                             <span className = "editorInfo withId">
                                                <span className="nameLenSet">{d.name}</span>
                                                <span>{d.email}</span>
                                                <span>{idInfo}</span>                                            
                                             </span>
                                             <a className="itemBtn btnEdit"></a>
                                             <a className="itemBtn btnDel"></a>
                                         </li>
                                );
                            }
                            else{
                                editors.push(<li className="canHover" data-aid={d.aid}>
                                             <img src={d.avatar} alt="portrait" className="portrait"/>
                                             <span className = "editorInfo">
                                                <span className="nameLenSet">{d.name}</span>
                                                <span>{d.email}</span>
                                                <a className="itemBtn btnEdit"></a>
                                                <a className="itemBtn btnDel"></a>
                                             </span>
                                             <a className="itemBtn btnEdit"></a>
                                             <a className="itemBtn btnDel"></a>
                                         </li>
                                );
                            }                                      
                        }

                    });
                    
        var btnEditClass="";
        if(data.length>= 6){
            btnEditClass = "btn btnHover-gray addEditor";
        }
        else{
            btnEditClass = "btn btn-blue addEditor";
        }             

        return(
            <div className="publicAccount">
                <div className="editorTeamHead clearfix">
                    <h3>{Lang.str('app_setting_SetEditorTeam_EditorSettings')}</h3>
                    <p className="fleft">{Lang.str('app_setting_SetEditorTeam_SettingDescription')}</p>                    
                </div>

                <div className="editorTeamBody">
                    <button className={btnEditClass}>{Lang.str('app_setting_SetEditorTeam_SettingAddEditor')}</button>
                    <ul>
                       {editors}
                    </ul>
                </div>

                <div  id="tag_dialog_bg"  className="addEditorDialogBg  jsaddEditorDialog hidden">
                    <div className="addEditorDialog">
                        <header>
                            <h3>{Lang.str('app_setting_SetEditorTeam_SettingAddEditor')}</h3>
                            <a className="close"></a>
                        </header>

                        <form className="lineDivision" name="addEditor" method="post">
                            <ul className="info">
                                <li>
                                    <span className="tit">{Lang.str('app_setting_SetEditorTeam_SettingRegisteredEmail')}</span>
                                    <span className="input">
                                    <input type="text" name="Register-Email" maxLength="64" />
                                    <em>*</em>
                                    </span>
                                </li>
                                <li>
                                    <span className="tit">{Lang.str('app_setting_SetEditorTeam_SettingPassword')}</span>
                                    <span className="input">
                                    <input type="text" name="password" maxLength="16" onFocus={this.changeToPassword.bind(this)} onChange={this.handleChange.bind(this)}/>
                                    <em>*</em>
                                    </span>
                                </li>
                                <li>
                                    <span className="tit">{Lang.str('app_setting_SetEditorTeam_SettingConfirmPassword')}</span>
                                    <span className="input">
                                    <input type="text" name="ConfirmPassword" maxLength="16" onFocus={this.changeToPassword.bind(this)} onChange={this.handleChange.bind(this)}/>
                                    <em>*</em>
                                    </span>
                                </li>
                                <li>
                                    <span className="tit">{Lang.str('app_setting_SetEditorTeam_SettingName')}</span>
                                    <span className="input">
                                        <input type="text" name="name" maxLength="25" onChange={this.handleChange.bind(this)}/>
                                    <em>*</em>
                                    </span>
                                </li>
                                <li>
                                    <span className="tit">{Lang.str('app_setting_SetEditorTeam_SettingID')}</span>
                                    <span className="input">
                                    <input type="text" name="ID" maxLength="8" onChange={this.handleChange.bind(this)}/>
                                    </span>
                                </li>
                            </ul>
                        </form>
                        <div className="tipAll">
                            <i className="infoError jsInfoTip hidden"></i>
                            <i className="jsPasswordInfoTip hidden"></i>
                            <i className="jsPasswordContrast hidden"></i>
                            <i className="jsNameContent hidden"></i>
                        </div>
                        <div className="btn-container">
                            <button className="jssave">{Lang.str('app_setting_teamAndGroup_Save')}</button>
                            <button className="jscancel">{Lang.str('app_setting_teamAndGroup_Cancel')}</button>
                        </div>
                    </div>
                </div>

                <div id="tag_dialog_bg" className="addEditorDialogBg  editorCustomerDialog jseditorCustomerDialog hidden ">
                    <div className="addEditorDialog">
                        <header>
                            <h3>{Lang.str('app_setting_SetEditorTeam_ModifyDlgTitle')}</h3>
                            <a className="close"></a>
                        </header>

                        <form className="lineDivision" name="addEditor" method="post">
                            <ul className="info">
                                <li>
                                    <span className="tit">{Lang.str('app_setting_SetEditorTeam_SettingRegisteredEmail')}</span>
                                    <span className="input">
                                    <input type="text" name="Register-Email" maxLength="64" />
                                    <em>*</em>
                                    </span>
                                </li>
                                <li>
                                    <span className="tit">{Lang.str('app_setting_SetEditorTeam_SettingPassword')}</span>
                                    <span className="input">
                                    <input type="text" name="password" className="havenPassword passwordEdit hidden" maxLength="16" onFocus={this.changeToPassword.bind(this)} onChange={this.handleChange.bind(this)}/>
                                    <input type="password" className="havenPassword passwordSize" autocomplete="off" disabled="disabled" value="********" />
                                    <em className="mustTag hidden">*</em>
                                    </span>
                                </li>
                                <li className="confirmPassword hidden">
                                    <span className="tit">{Lang.str('app_setting_SetEditorTeam_SettingConfirmPassword')}</span>
                                    <span className="input">
                                    <input type="text" name="ConfirmPassword" maxLength="16" onFocus={this.changeToPassword.bind(this)} onChange={this.handleChange.bind(this)}/>
                                    <em>*</em>
                                    </span>
                                </li>
                                <li>
                                    <span className="reset">{Lang.str('app_setting_SetEditorTeam_SettingReset')}</span>
                                </li>
                                <li>
                                    <span className="tit">{Lang.str('app_setting_SetEditorTeam_SettingName')}</span>
                                    <span className="input">
                                        <input type="text" name="name" maxLength="25" onChange={this.handleChange.bind(this)}/>
                                    <em>*</em>
                                    </span>
                                </li>
                                <li>
                                    <span className="tit">{Lang.str('app_setting_SetEditorTeam_SettingID')}</span>
                                    <span className="input">
                                    <input type="text" name="ID" maxLength="8" onChange={this.handleChange.bind(this)}/>
                                    </span>
                                </li>
                            </ul>
                        </form>
                        <div className="tipAll">
                            <i className="infoError jsInfoTip hidden"></i>
                            <i className="jsPasswordInfoTip hidden"></i>
                            <i className="jsPasswordContrast hidden"></i>
                            <i className="jsNameContent hidden"></i>
                        </div>
                        <div className="btn-container">
                            <button className="jssave">{Lang.str('app_setting_teamAndGroup_Save')}</button>
                            <button className="jscancel">{Lang.str('app_setting_teamAndGroup_Cancel')}</button>
                        </div>
                    </div>
                </div>

                <div  id="tag_dialog_bg"  className="addEditorDialogBg  setEditorDelete  jsdeleteDialog hidden">
                    <div className="addEditorDialog">
                        <header>
                            <h3>{Lang.str('app_setting_SetEditorTeam_DeleteTitle')}</h3>
                            <a className="close"></a>
                        </header>

                        <p className="lineDivision">{Lang.str('app_setting_SetEditorTeam_SureDelEditor')}</p>
                        <div className="btn-container">
                            <button className="jssave ml85">{Lang.str('app_setting_SetEditorTeam_Confirm')}</button>
                            <button className="jscancel">{Lang.str('app_setting_SetEditorTeam_Cancel')}</button>
                        </div>
                    </div>
                </div>

            </div>



        );
    }
}


export default SetEditorTeam;