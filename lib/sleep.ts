const sleep = (milliseconds: number) => {
	return new Promise<void>((resolve) => {
		const intervalId = setInterval(() => {
			clearInterval(intervalId); // Clear the interval after the specified time
			resolve(); // Resolve the promise after the specified time
		}, milliseconds);
	});
};

export { sleep };
