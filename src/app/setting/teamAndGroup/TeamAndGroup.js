import React from 'react'
import tools from 'utils/tools'
import TeamSetting from 'app/setting/teamAndGroup/TeamSetting'
import GroupSetting from 'app/setting/teamAndGroup/GroupSetting'
import TeamAndGroupApiUtil from 'app/setting/teamAndGroup/TeamAndGroupApiUtil'

export class TeamAndGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <article className="group_detail">
                {/*<TeamSetting/>*/}
                <GroupSetting/>
            </article>
        );
    }
}

export default TeamAndGroup;