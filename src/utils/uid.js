export const createUID = (name = 'uid') => {
	const d = Date.now();
	const rnd = Math.random();
	const str = (Number(d) + rnd).toString(32).replace('.', '').slice(2);
	console.log({ d, rnd, str });
	return `${name.toLowerCase().replace('widget', '')}-${str}`;
}