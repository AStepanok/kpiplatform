export const formatDate = (date: Date) => {
	const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
	const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth();
	const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();

	return `${day}.${month}.${date.getFullYear()} ${hour}`;
};

export const formatSchemaToDay = (schema: {
	timestamp: string;
	value: number
}[]) => {
	const timestampsAverage: any = {};
	console.log(schema);
	schema.forEach(row => {
		const day = row.timestamp.split(' ')[0];
		if (timestampsAverage[day]) {
			timestampsAverage[day] += row.value;
		} else {
			timestampsAverage[day] = row.value;
		}
	});

	const result = Object.keys(timestampsAverage).reduce((formattedSchema, timestamp) => {
		return [ ...formattedSchema, { timestamp: timestamp, value: timestampsAverage[timestamp] / 24 }];
	}, []);

	return result;
};
