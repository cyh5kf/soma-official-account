import React from 'react'

export class GeoMessage extends React.Component{
    constructor(props) {
        super(props);
    };

    render(){
        let location = this.props.geoMessage.lat + "," +this.props.geoMessage.lngt;
        let imageSrcUrl = "https://maps.googleapis.com/maps/api/staticmap?center="+location +"&size=60x60&zoom=13&markers=color:red|size:small|"+location;

        let descriptionItem = null;
        let href = "https://maps.google.com/?q="+location;
        if(this.props.geoMessage.poiname){
            let nameArray = this.props.geoMessage.poiname.split(",");
            let title = nameArray[0]?nameArray[0]:"";
            if(title.length > 16){
                title = title.substr(0,13)+"...";
            }
            let detail = nameArray[1]?nameArray[1]:"";
            if(title.length > 32){
                title = title.substr(0,29)+"...";
            }
            descriptionItem = <div className="geo-description" >
                <div className="geo-description-title">{title}</div>
                <div className="geo-description-detail">{detail}</div>
            </div>;
        }

        return <a className="geo-box" href={href} target="_blank">
            <img src={imageSrcUrl} width="60" height="60"/>
            {descriptionItem}
        </a> ;
    }
}

export default GeoMessage;
