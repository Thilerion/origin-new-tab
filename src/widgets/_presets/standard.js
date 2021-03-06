import { ALIGN } from '@/constants';

export default [
	{
		name: "Clock",
		x: 8,
		y: 7,
		width: 26,
		height: 6,
		alignX: ALIGN.center,
		alignY: ALIGN.center
	},
	{
		name: "WallpaperDetails",
		x: 1,
		y: 19,
		width: 11,
		height: 2,
		alignX: ALIGN.start,
		alignY: ALIGN.end
	},
	{
		name: "News",
		x: 9,
		y: 1,
		width: 24,
		height: 1,
		alignX: ALIGN.center,
		alignY: ALIGN.center
	},
	{
		name: "Weather",
		x: 34,
		y: 1,
		width: 7,
		height: 2,
		alignX: ALIGN.end,
		alignY: ALIGN.start
	},
	{
		name: "Quote",
		x: 12,
		width: 18,
		y: 3,
		height: 2,
		alignX: ALIGN.center,
		alignY: ALIGN.center
	},
	{
		name: "QuickLinks",
		x: 9,
		width: 24,
		y: 17,
		height: 4,
		alignX: ALIGN.center,
		alignY: ALIGN.end
	}
];