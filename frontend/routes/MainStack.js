import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from './../pages/Login';
import Home from "./../pages/Home";
import Chats from "./../pages/Chats";

const Stack = createNativeStackNavigator();

const MainStack = () => {

    const optionsHeader = (title) => {
        return {
            title: title,
            headerStyle: {
                backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        };
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>

                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={optionsHeader('Inicio de Sesión')}
                />

                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={optionsHeader('Nuevos Leads')}
                />

                <Stack.Screen
                    name="Chats"
                    component={Chats}
                    options={optionsHeader('Leads Activos')}
                />

            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default MainStack;