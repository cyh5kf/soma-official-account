import React from 'react'

import linkifyStr from "linkifyjs/string"
import emoji from "js-emoji"





export class TextMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {duration: ""}
    };

    static getTextMessageContent(messageContent){
        var options = {
            target: '_blank',
        };
        emoji.img_sets['apple']['sheet'] = 'https://d51wm8y7a2ot9.cloudfront.net/official-account/emoji/img/sheet_apple_32.png';
        emoji.use_sheet = true;
        emoji.replace_mode = "css";
        emoji.init_env();
        return emoji.replace_unified(linkifyStr(messageContent,options));
    }

    render() {
        return (
                <div className="text" dangerouslySetInnerHTML={{__html: TextMessage.getTextMessageContent(this.props.message.content)}}></div>
            );
    }

}

export default TextMessage;
