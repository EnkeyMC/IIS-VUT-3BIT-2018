import React from "react";
import BugInfo from "../components/BugInfo";
import DefaultLayout from "./layouts/DefaultLayout";
import {Route, Switch, withRouter} from "react-router";
import {connect} from "react-redux";
import {getSeverities} from "../actions/severities";
import Observable from "../utils/Observable";
import {RestrictedRoute, RestrictedView, ROLE_PROGRAMMER} from "../components/RoleRestriction";
import BugCreate from "../components/BugCreate";
import SideList, {NewItemBtn, SideListFilter, SideListFilterItem, SideListHeader} from "../components/SideList";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {UncontrolledTooltip} from "reactstrap";
import BugEdit from "../components/BugEdit";
import {F_ALL, F_VULNERABILITIES, getBugsFiltered} from "../actions/bugs";
import {Spinner, StateRenderer} from "../utils";
import * as qs from "query-string";


export default class BugView extends React.Component {
    constructor(props) {
        super(props);

        this.pathObservable = new Observable(this.props.location.search, () => {
            this.updateBugs();
        });
        this.pathObservable.triggerOnChanged();
    }

    componentDidMount() {
        this.props.getSeverities();
    }

    componentDidUpdate() {
        this.pathObservable.update(this.props.location.search);
    }

    updateBugs() {
        const search = this.props.location.search;
        const filter = qs.parse(search).filter;

        this.props.getBugsFiltered(filter);
    }

    render () {
        let defaultId = null;
        const data = this.props.bugs.data;
        if (data && data.length > 0)
            defaultId = data[0].id;

        const pathname = this.props.match.path;
        const search = this.props.location.search;
        let filter = qs.parse(search).filter;

        if (this.props.severities.data !== null && (filter !== F_ALL || filter !== F_VULNERABILITIES)) {
            const severity = this.props.severities.data.filter(i => String(i.level) === String(filter));
            if (severity.length !== 1) {
                filter = undefined;
            } else {
                filter = severity[0].name;
            }
        }
        return (
            <DefaultLayout>
                <SideList list={this.props.bugs} noItems="No bugs found" itemTag={Bug}>
                    <SideListHeader
                        title="Bug list"
                        filter={
                            <StateRenderer state={this.props.severities} renderCondition={this.props.severities.data !== null}
                                renderLoading={() => {return (
                                    <span className="text-muted ml-4">
                                        <Spinner/>
                                    </span>
                                )}}
                            >
                                {props => {return (
                                    <SideListFilter
                                        value={{value: filter}}
                                        defaultValue={{value: F_ALL}}
                                    >
                                        <SideListFilterItem
                                            linkTo={{pathname: pathname, search: qs.stringify({filter: F_ALL})}}
                                            value={F_ALL} />
                                        {props.data.map(sev => <SideListFilterItem
                                            linkTo={{pathname: pathname, search: qs.stringify({filter: sev.level})}}
                                            value={sev.level} label={sev.name} key={sev.level} />)}
                                        <SideListFilterItem
                                            linkTo={{pathname: pathname, search: qs.stringify({filter: F_VULNERABILITIES})}}
                                            value={F_VULNERABILITIES} />
                                    </SideListFilter>
                                )}}
                            </StateRenderer>
                        }
                        newBtn={
                            <RestrictedView minRole={ROLE_PROGRAMMER}>
                                <NewItemBtn linkTo={this.props.match.path+'/create'+search}>
                                    Create New Bug
                                </NewItemBtn>
                            </RestrictedView>
                        }
                    />
                </SideList>
                <Switch>
                    <RestrictedRoute minRole={ROLE_PROGRAMMER} path={this.props.match.path+'/create'} component={BugCreate} />
                    <RestrictedRoute minRole={ROLE_PROGRAMMER} path={this.props.match.path+'/:id/edit'} component={BugEdit} />
                    <Route path={this.props.match.path+'/:id(\\d+)?'} render={(props) => <BugInfo defaultId={defaultId} {...props} />} />
                </Switch>
            </DefaultLayout>
        )
    }
}

BugView = connect(
    state => {
        return {
            bugs: state.bugView.bugs,
            severities: state.severities
        }
    },
    dispatch => {
        return {
            getBugsFiltered: (filter) => dispatch(getBugsFiltered(filter)),
            getSeverities: () => dispatch(getSeverities())
        }
    }
)(withRouter(BugView));

const Bug = withRouter((props) => {
    const bug = props.item;
    const search = props.location.search;
    return (
        <NavLink to={{pathname: props.match.path+'/'+bug.id, search: search}}
                 activeClassName="selected"
                 className="list-group-item list-group-item-action flex-column align-items-start"
                 style={bug.severity ?
                     {borderLeft: '5px solid '+bug.severity.color}
                     :
                     {borderLeft: '5px solid transparent'}}
        >
            <div className="d-flex w-100 justify-content-between">
                <h6 className="pb-1 ticket-list-title">
                    {
                        bug.vulnerability ?
                            <>
                                <FontAwesomeIcon icon="exclamation-circle" id={"bug-"+bug.id} className="mr-1 text-danger" />
                                <UncontrolledTooltip placement="top" target={"bug-"+bug.id}>
                                    Vulnerability
                                </UncontrolledTooltip>
                            </>
                            :
                            null
                    }
                    #{bug.id} - {bug.title}
                </h6>
            </div>
            <small className="float-left">{bug.author}</small>
            <small className="float-right">{bug.created}</small>
        </NavLink>
    );
});