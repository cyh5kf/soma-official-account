import React from 'react'
import {TagColorCenter} from 'utils/TagColorCenter'
import Lang from "lang/Lang"
import $ from 'jquery'

export class AddUserTag extends React.Component {
    constructor(props) {
        super(props);
        if(props.tag != null) {
            this.state = {name: props.tag.name, color: props.tag.color};
        } else {
            this.state = {name: "", color: 1};
        }
        this.state.opacity = 0.5;
    }

    componentDidMount() {
        this.timer = setInterval(function () {
            var opacity = this.state.opacity;
            opacity += 0.1;
            if (opacity > 1.0) {
                opacity = 1.0;
                clearInterval(this.timer);
            }
            this.setState({opacity : opacity});
        }.bind(this), 50);
    }
    componentDidUnmount() {
        clearInterval(this.timer);
    }

    onClose() {
        this.props.dialogHandler('x');
    }

    onSave() {
        if((this.state.name === "") || (this.state.color < 0)) {
            $(".tagNameIuput").addClass("warning");
            return;
        }
        if(this.props.tag != null) {
            var tag = this.props.tag;
            //if((this.state.name === tag.name) && (this.state.color === tag.color)) {
            //    return;
            //}
            console.log("modity tag:"+tag.tag_id+" to, color:" + this.state.color + ", name:" + this.state.name);
            this.props.eventHandler('m', tag.tag_id, this.state.name, this.state.color);
        } else {
            console.log("add new tag, color:" + this.state.color + ", name:" + this.state.name);
            this.props.eventHandler('a', 0, this.state.name, this.state.color);
        }
    }

    getInputName(event) {
        this.state.name = event.target.value;
        this.forceUpdate();
    }
    getInputColor(color) {
        this.state.color = color;
        this.forceUpdate();
    }
    handleInputKeyPress(event) {
        this.state.code = 0;
        this.state.message = "";
        this.forceUpdate();
        if(event.keyCode === 13) {
            this.onSave(event);
        }
    }

    render() {
        var colorTags = [];
        var allColors = TagColorCenter.getColorArray();
        for(var idx in allColors) {
            var color = allColors[idx];
            var style = {background:'#'+color.val};
            var className = "";
            if(this.state.color === color.id) {
                className = "active";
            }
            colorTags.push(
                <li><a className = {className} href="#"
                       onClick={this.getInputColor.bind(this, color.id)}
                       style={style}>
                </a></li>
            );

        }
        var inputText = "";
        if(this.props.tag != null) {
            inputText = <input type="text"
                               className="tagNameIuput"
                   value={this.state.name} maxLength="25"
                   onChange={this.getInputName.bind(this)}
                   onKeyDown={this.handleInputKeyPress.bind(this)}/>
        } else {
            inputText = <input type="text"
                               className="tagNameIuput"
                   placeholder={Lang.str('app_setting_userTag_Tag')} maxLength="25"
                   onChange={this.getInputName.bind(this)}
                   onKeyDown={this.handleInputKeyPress.bind(this)}/>
        }
        return (
            <div id="tag_dialog_bg" style={{opacity:this.state.opacity}}>
                <div id="tag_dialog">
                    <header>
                        <h3>{Lang.str('app_setting_userTag_UserTag')}</h3>
                        <a className="close" onClick={this.onClose.bind(this)}></a>
                    </header>

                    <div className="color-list">
                        <ul id="color_container" ref="color_container">
                            {colorTags}
                        </ul>
                        <ul>{inputText}</ul>

                        <div className="btn-container">
                            <button onClick={this.onSave.bind(this)}>{Lang.str('app_setting_userTag_Save')}</button>
                            <button onClick={this.onClose.bind(this)}>{Lang.str('app_setting_userTag_Cancel')}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
