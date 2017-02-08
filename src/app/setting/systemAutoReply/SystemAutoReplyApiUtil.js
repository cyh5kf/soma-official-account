import $ from "jquery"

export class SystemAutoReplyApiUtil {

    static getInitialSetting(successHandler) {
        $.ajax({
            url: '/api/v1/cs/setting',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            success: successHandler
        });
    }

    static updateOnOff(fieldOnOff, checked, successHandler) {
        var flag = checked ? 1 : 0;
        var reqdata = {fieldOnOff: fieldOnOff, flag: flag};
        $.ajax({
            url: '/api/v1/cs/setting/onoff',
            type: 'PUT',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(reqdata),
            async: true,
            success: successHandler
        });
    }

    static updateReplyMsg(fieldMsg, content, successHandler) {
        var reqdata = {fieldMsg: fieldMsg, content: content};
        $.ajax({
            url: '/api/v1/cs/setting/replymsg',
            type: 'PUT',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(reqdata),
            async: true,
            success: successHandler
        });
    }

    static updateCompanyName(companyName, successHandler) {
        var reqdata = {company_name: companyName};
        $.ajax({
            url: '/api/v1/cs/setting/companyname',
            type: 'PUT',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(reqdata),
            async: true,
            success: successHandler
        });
    }

    static updateServiceType(serviceType, successHandler) {
        var reqdata = {service_type: serviceType};
        $.ajax({
            url: '/api/v1/cs/setting/servicetype',
            type: 'PUT',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(reqdata),
            async: true,
            success: successHandler
        });
    }

    static updateNoResponseDuration(duration, successHandler) {
        var reqdata = {noResponseDuration: duration};
        $.ajax({
            url: '/api/v1/cs/setting/noresponseduration',
            type: 'PUT',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(reqdata),
            async: true,
            success: successHandler
        });
    }
}

export default SystemAutoReplyApiUtil;