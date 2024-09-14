import React, { memo } from "react";
import { View, Text } from "react-native";

interface IBarChart {
	percentage: number;
	totalAttempts: number;
}

const BarChart: React.FC<IBarChart> = ({ percentage, totalAttempts }) => {
	return (
		<View className="self-start mt-2 w-[92%] mt-1">
			<View className="flex-row gap-x-2">
				<Text className="text-xl ms-2 dark:text-slate-100">1</Text>
				<View
					style={{
						minWidth: 27,
						width: `${percentage}%`,
					}}
					className={`bg-slate-500 items-end px-2`}>
					<Text className="text-xl font-bold text-white">{totalAttempts}</Text>
				</View>
			</View>
		</View>
	);
};

export default memo(BarChart);
