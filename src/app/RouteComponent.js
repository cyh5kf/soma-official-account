import React from 'react'
import Auth from 'app/Auth'

export class RouteComponent extends React.Component{
    static willTransitionTo(transition){
        if(!Auth.loggedIn()){
            transition.redirect('/login', {}, {'nextPath' : transition.path});
        }
    }
}

export default RouteComponent;