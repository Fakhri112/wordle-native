import { useEffect, useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import HowToPlay from "../components/HowToPlay";
import { storage } from "../lib/statisticData";
import Statistics from "@/components/Statistics";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./index";
import { useIsFocused } from "@react-navigation/native";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const Home = ({ route, navigation }: Props) => {
	const { setColorScheme } = useColorScheme();
	const [openHowToPlay, SetOpenHowToPlay] = useState(false);
	const [openStatistic, SetOpenStatistic] = useState(false);
	const isFocused = useIsFocused();

	useEffect(() => {
		let getSavedColorScheme = storage.getString("color.scheme") as
			| "dark"
			| "light";
		setColorScheme(getSavedColorScheme);
		if (!storage.getString("user.statistic"))
			storage.set("user.statistic", "[]");
	}, [isFocused]);

	return (
		<View className="flex-1 justify-center items-center  dark:bg-neutral-900">
			<Statistics
				status="home"
				visible={openStatistic}
				transparent={true}
				dismiss={() => SetOpenStatistic(false)}
			/>
			<Text className="text-5xl font-semibold dark:text-slate-100">Wordle</Text>
			<Text className="text-lg text-center dark:text-slate-100">
				Guess the hidden 5-word in 6 tries.
			</Text>

			<TouchableOpacity
				onPress={() => {
					navigation.navigate("Game");
				}}
				className="bg-black border rounded-lg p-2 mt-5 dark:bg-neutral-700">
				<Text className="text-xl text-white mx-10">Play</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => SetOpenHowToPlay(true)}
				className="border rounded-lg p-2 mt-5  dark:border-slate-200">
				<Text className="text-xl  dark:text-slate-100">How to Play</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => SetOpenStatistic(true)}
				className="border rounded-lg py-2 px-5 mt-5  dark:border-slate-200">
				<Text className="text-xl  dark:text-slate-100">Statistics</Text>
			</TouchableOpacity>
			<HowToPlay
				visible={openHowToPlay}
				transparent={true}
				dismiss={() => SetOpenHowToPlay(false)}
			/>
		</View>
	);
};

export default Home;
