import React from 'react'
import Lang from "lang/Lang"
import tools from 'utils/tools'


class DispatchSettingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    selectChange(dType) {
        this.props.onSelChange(dType);
    }

    isRoundRobin() {
        return (this.props.dispatchType === 1);
    }
    isLoadBalance() {
        return (this.props.dispatchType === 2);
    }

    render() {
        var lbChecked = this.isLoadBalance();
        var rbChecked = this.isRoundRobin();

        return (
            <article id="setting_detail" className="content">
                <h3 className="title message-title">{Lang.str('app_setting_messageDistribution_DistributionPrinciple')}</h3>

                <label className="chb">
                    <input type="radio" name="dispatchType" ref="rbRadio" checked={rbChecked}
                           onChange={this.selectChange.bind(this, 1)}
                    />
                    {Lang.str('app_setting_messageDistribution_EqualDistribution')}
                </label>
                <p className="des">{Lang.str('app_setting_messageDistribution_EqualDistributionDesc')}</p>

                <label className="chb">
                    <input type="radio" name="dispatchType" ref="lbRadio" checked={lbChecked}
                           onChange={this.selectChange.bind(this, 2)}
                    />
                    {Lang.str('app_setting_messageDistribution_LoadBalanceDistribution')}
                </label>
                <p className="des">{Lang.str('app_setting_messageDistribution_LoadBalanceDistributionDesc')}</p>
            </article>
        );
    }
}

export class MessageDistribution extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getDistributeType(cbsuccess) {
        $.ajax({
            url: '/api/v1/cs/setting/msgdispatch',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            xhrFields: {
                withCredentials: true
            },
            async: true,
            success: cbsuccess
        });
    }

    setDistributeType(dtype, cbsuccess) {
        var strJson = {
            "type" : dtype
        }
        $.ajax({
            url: '/api/v1/cs/setting/msgdispatch',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(strJson),
            xhrFields: {
                withCredentials: true
            },
            async: true,
            success: cbsuccess
        });
    }

    componentDidMount() {
        var dtype = 0;
        // ajax call from server
        var cbsuccess = function(cont, txtStatus, xhr) {
            console.log("getDistribute return:"+JSON.stringify(cont)+", status:"+xhr.status);
            if(200 === xhr.status) {
                var jsonRet = eval(cont);
                dtype = jsonRet.type;
                this.setState({dispatchType: dtype});
            }
        }
        this.getDistributeType(cbsuccess.bind(this));
    }

    onSelectChange(dType) {
        var self = this;
        // ajax set to server
        var cbsuccess = function(cont, txtStatus, xhr) {
            console.log("setDistribute return status:"+xhr.status+", msg:"+JSON.stringify(cont));
            if(200 === xhr.status) {
                this.setState({dispatchType: dType});
                $.messageBox({"message":Lang.str('app_setting_messageDistribution_ChangeSaved'),"level":"success"});
            }
        }
        this.setDistributeType(dType, cbsuccess.bind(this));

    }

    render() {
        return (
            <DispatchSettingPage
                dispatchType={this.state.dispatchType}
                onSelChange={this.onSelectChange.bind(this)}
            />
        );
    }
}

export default MessageDistribution;
