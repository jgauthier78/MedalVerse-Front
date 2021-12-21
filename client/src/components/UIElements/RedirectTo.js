import React, { Component } from "react";
import { Navigate } from "react-router-dom";


// the component is used to redirect and clean the destination
class RedirectTo extends Component {

    state = {
        where: null
    }


    UNSAFE_componentWillMount() {

        // When we mount, we read the redirection and ask the parent to clean
        // so we don't end in an infinite loop
        this.setState({ where: this.props.to })
        this.props.resetNavigateTo()
    }

    render() {
        return (<Navigate to={this.state.where} />)
    }
}

export default RedirectTo