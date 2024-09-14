import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./home";
import Game from "./game";

export type RootStackParamList = {
	Home: undefined;
	Game: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
export default function index() {
	return (
		<NavigationContainer independent={true}>
			<Stack.Navigator
				initialRouteName="Home"
				screenOptions={{ headerShown: false }}>
				<Stack.Screen name="Home" component={Home} />
				<Stack.Screen name="Game" component={Game} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
