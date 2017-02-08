import React from 'react'
import SystemAutoReplyApiUtil from 'app/setting/systemAutoReply/SystemAutoReplyApiUtil'
import Lang from "lang/Lang"

export class TeamSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {csSetting: {
            company_name: '',
            service_type: ''
        }};
    }

    componentDidMount() {
        var initcb = function (csSetting, txtStatus, xhr) {
            if (xhr.status == 200) {
                this.setState({csSetting: csSetting});
            }
        };
        SystemAutoReplyApiUtil.getInitialSetting(initcb.bind(this));
    }

    render() {
        var registerDateString = '';
        if (this.state.csSetting.created != undefined || this.state.csSetting.created != null) {
            registerDateString = new Date(this.state.csSetting.created).toLocaleDateString();
        }
        return (
            <div className="teamSettings">
                <h3 className="team">{Lang.str('app_setting_teamAndGroup_TeamSetting')}</h3>
                <span>{Lang.str('app_setting_teamAndGroup_RegisteredIn')} {registerDateString}</span>
                <hr width="100%" color="#ccc" size="1"/>
                <ul>
                    <li>
                        <em>{Lang.str('app_setting_teamAndGroup_TeamCompanyName')}</em>
                        <span>{this.state.csSetting.company_name}</span>
                    </li>
                    <li>
                        <em>{Lang.str('app_setting_teamAndGroup_ServiceType')}</em>
                        <span>{this.state.csSetting.service_type}</span>
                    </li>
                </ul>
            </div>
        );
    }
}

export default TeamSetting;