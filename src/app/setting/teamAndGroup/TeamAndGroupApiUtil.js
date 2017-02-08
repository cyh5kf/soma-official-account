import $ from "jquery"
import Session from 'app/Session'

export class TeamAndGroupApiUtil {

    static getInitialTeamAndGroup(successHandler) {
        $.ajax({
            url: '/api/v1/cs/group',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            success: successHandler
        });
    }

    static createNewGroup(name, successHandler) {
        var reqdata = {name: name, oid: Session.getOid()};
        $.ajax({
            url: '/api/v1/cs/group',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(reqdata),
            async: true,
            success: successHandler
        });
    }

    static updateGroupInfo(gid, name, successHandler) {
        var reqdata = {group_id: gid, name: name, oid: Session.getOid()};
        $.ajax({
            url: '/api/v1/cs/group/' + gid,
            type: 'PUT',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(reqdata),
            async: true,
            success: successHandler
        });
    }

    static getGroupInfo(gid, successHandler) {
        $.ajax({
            url: '/api/v1/cs/group/' + gid,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            success: successHandler
        });
    }

    static deleteCsGroup(gid, successHandler) {
        $.ajax({
            url: '/api/v1/cs/group/' + gid,
            type: 'DELETE',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            success: successHandler
        });
    }

    static createNewAgent(reqdata, successHandler) {
        $.ajax({
            url: '/api/v1/cs/agent',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(reqdata),
            async: true,
            success: successHandler
        });
    }

    static updateAgentInfo(reqdata, successHandler) {
        $.ajax({
            url: '/api/v1/cs/agent',
            type: 'PUT',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(reqdata),
            async: true,
            success: successHandler
        });
    }

    static getAgentInfo(aid, successHandler) {
        $.ajax({
            url: '/api/v1/cs/agent/' + aid,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            success: successHandler
        });
    }

    static deleteCsAgent(aid, successHandler) {
        $.ajax({
            url: '/api/v1/cs/agent/' + aid,
            type: 'DELETE',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            success: successHandler
        });
    }

    static getGroupAgents(group_id, successHandler) {
        $.ajax({
            url: '/api/v1/cs/agent/getgroupagentlist/' + group_id,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            success: successHandler
        });
    }

    static countservice(successHandler) {
        $.ajax({
            url: '/api/v1/cs/agent/countservice',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            success: successHandler
        });
    }

}

export default TeamAndGroupApiUtil;