import React from 'react'
import Lang from "lang/Lang"

export class ConversationRules extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <article id="setting_detail" class="content">
                <label className="chb">
                    <input name="" type="checkbox" value="" checked />
                    {Lang.str('app_setting_conversationRules_ServiceRequestTransfer')}
                </label>
                <p className="des">{Lang.str('app_setting_conversationRules_ServiceRequestTransferDesc')}</p>

                <span className="text">{Lang.str('app_setting_conversationRules_ServiceRequestTransferDelay_1')} <input type="number" /> {Lang.str('app_setting_conversationRules_ServiceRequestTransferDelay_2')}</span>
            </article>
        );
    }
}

export default ConversationRules;