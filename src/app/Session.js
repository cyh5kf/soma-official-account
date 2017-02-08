import React from 'react'

export class Session {
    static getLogined() {
        return localStorage.logined === "true";
        //return true;
    }

    static setLogined(logined) {
        localStorage.logined = logined;
    }

    static getAid() {
        return localStorage.aid;
    }

    static setAid(aid) {
        localStorage.aid = aid;
    }

    static getOid() {
        return localStorage.oid;
    }

    static setOid(oid) {
        localStorage.oid = oid;
    }

    static getOffName() {
        return localStorage.offName;
    }

    static setOffName(name) {
        localStorage.offName = name;
    }

    static getOffQRCode() {
        return localStorage.offQRCode;
    }

    static setOffQRCode(offQRCode) {
        localStorage.offQRCode = offQRCode;
    }

    static getAvatar() {
        return localStorage.avatar;
    }

    static setAvatar(avatar) {
        localStorage.avatar = avatar;
    }

    static getGroupId() {
        return localStorage.groupId;
    }

    static setGroupId(groupId) {
        localStorage.groupId = groupId;
    }

    static getGroupName() {
        return localStorage.groupName;
    }

    static setGroupName(groupName) {
        localStorage.groupName = groupName;
    }

    static getEmail() {
        return localStorage.email;
    }

    static setEmail(email) {
        localStorage.email = email;
    }

    static getName() {
        return localStorage.name;
    }

    static setName(name) {
        localStorage.name = name;
    }

    static getCsId() {
        return localStorage.csId;
    }

    static setCsId(csId) {
        localStorage.csId = csId;
    }

    static getToken() {
        return localStorage.token;
    }

    static setToken(token) {
        localStorage.token = token;
    }

    static getRole() {
        return localStorage.role;
    }

    static setRole(role) {
        localStorage.role = role;
    }

    static getStatus() {
        return localStorage.onlinestatus;
    }
    static setStatus(status) {
        localStorage.onlinestatus = status;
    }

    static getLang() {
        return localStorage.lang;
    }
    static setLang(lang) {
        localStorage.lang = lang;
    }
}

export default Session;
