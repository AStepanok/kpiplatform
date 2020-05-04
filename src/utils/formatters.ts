export const formatDate = (date: Date) => {
	const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
	const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth();
	const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();

	return `${day}.${month}.${date.getFullYear()} ${hour}`;
};
