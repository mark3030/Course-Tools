import { observer } from 'mobx-react';
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Courseware from "./pages/Courseware";
import CoursewareTest from "./pages/Courseware/test";
import Module from "./pages/Module";

export const RouterSwitch = observer(() => {
    return (
        <Switch>
            <Route component={Courseware} path="/online"/>
            <Route component={Module} path="/module"/>
            <Route component={CoursewareTest} path="/test"/>
            <Redirect to="/online" />
        </Switch>
    );
});