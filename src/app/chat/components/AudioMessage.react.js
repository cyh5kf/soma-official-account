import React from 'react'
import AudioTime from 'app/chat/components/AudioTime.react'
import classNames from 'classnames/bind';


export class AudioMessage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {"playing":false}
    };


    componentDidMount(){
        let that = this;
        var audioElement = React.findDOMNode(this.refs.audioObject);
        audioElement.addEventListener('loadedmetadata', function(){
            that.state.duration = Math.floor(this.duration);
            that.setState(this.state)
        });


    }

    componentWillUnmount(){
    }

    playAudio(){
        let that = this;
        var audioElement = React.findDOMNode(this.refs.audioObject);
        audioElement.addEventListener("playing", function() {
            that.state.playing = true;
            that.setState(that.state)
        }, true);

        audioElement.addEventListener("ended", function() {
            that.state.playing = false;
            that.setState(that.state)
        }, true);


        audioElement.play();

    }


    render(){
        let audioSrc = this.props.audioObj.fileurl.replace(/amr$/,"ogg")
        let duration = Math.floor((this.props.audioObj.playduration+500)/1000);
        let soundLength = 50;
        if(duration > 60){
            soundLength = 300;
        }else if(duration>10){
            soundLength = Math.floor(duration/60*300);
        }


        return (<div className="sound-box"  style={{"width":soundLength+"px"}} onClick={this.playAudio.bind(this)} >
            <span className={classNames({'sound-play': true,
                            'show-sound':!this.state.playing,"playing-sound":this.state.playing})} />
            <AudioTime duration={duration}></AudioTime>
            <audio ref="audioObject"  src={audioSrc}  preload="auto" >
                <p>Your browser does not support the audio element</p>
            </audio>
        </div>)
    }


}

export default AudioMessage;