import React from 'react';
import {Text, View } from 'react-native';
import {Redirect, Route, Switch} from 'react-router-native';
import AppBar from './src/components/AppBar';
import HomeScreen from './src/components/HomeScreen';
import UserTable from './src/components/TableComponent';

const Main = () => {
    return (
        <View style={{flex: 1}}>
            <AppBar />
            <Switch>
                
                <Route path="/home" exact>
                    <HomeScreen />
                </Route>
                <Route path="/profile" exact>
                    <UserTable /> 
                </Route>

                <Redirect to="/" />
            </Switch>
        </View>
    )
}

export default Main