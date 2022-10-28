import { observer } from 'mobx-react';
import React from "react";
import { Route, Switch } from "react-router-dom";
// import Module from "./pages/Module";
import Courseware from "./pages/Courseware";

export const RouterSwitch = observer(() => {
    return (
        <Switch>
            {/* <Route component={Module} path="/"/> */}
            <Route component={Courseware} path="/"/>
            {/* <Redirect to="/" /> */}
        </Switch>
    );
});