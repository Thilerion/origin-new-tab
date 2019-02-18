import { ALIGN } from '@/constants';

export default [
	{
		name: "WidgetClock",
		x: 8,
		y: 7,
		width: 26,
		height: 6,
		alignX: ALIGN.center,
		alignY: ALIGN.center
	},
	{
		name: "WidgetUnsplashDetails",
		x: 1,
		y: 19,
		width: 11,
		height: 2,
		alignX: ALIGN.start,
		alignY: ALIGN.end
	},
	{
		name: "WidgetNews",
		x: 9,
		y: 1,
		width: 24,
		height: 1,
		alignX: ALIGN.center,
		alignY: ALIGN.center
	},
	{
		name: "WidgetWeather",
		x: 34,
		y: 1,
		width: 7,
		height: 2,
		alignX: ALIGN.end,
		alignY: ALIGN.start
	},
	{
		name: "WidgetQuote",
		x: 12,
		width: 18,
		y: 3,
		height: 2,
		alignX: ALIGN.center,
		alignY: ALIGN.center
	}
];