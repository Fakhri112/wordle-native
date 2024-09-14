import React, { memo } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";

interface IToaster {
	msg: string;
}

const Toaster: React.FC<IToaster> = ({ msg }) => {
	return (
		<>
			{msg && (
				<Animated.View
					entering={FadeInUp}
					exiting={FadeOutUp}
					style={{
						...styles.modalContent,
					}}
					className="items-center self-center absolute z-10">
					<Text className="bg-neutral-800 dark:bg-slate-300 text-slate-200 dark:text-neutral-800 text-2xl px-4 py-2 rounded-md font-bold tracking-wider">
						{msg}
					</Text>
				</Animated.View>
			)}
		</>
	);
};
const styles = StyleSheet.create({
	modalContent: {
		marginVertical: "15%",
	},
});

export default memo(Toaster);
