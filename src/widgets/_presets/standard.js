import { ALIGN } from '@/constants';

export default [
	{
		name: "WidgetClock",
		x: 12,
		width: 18,
		y: 6,
		height: 6,
		alignX: ALIGN.center,
		alignY: ALIGN.center
	},
	{
		name: "WidgetNews",
		x: 12,
		width: 18,
		y: 1,
		height: 2,
		alignX: ALIGN.stretch,
		alignY: ALIGN.start
	},
	{
		name: "WidgetUnsplashDetails",
		x: 1,
		width: 12,
		y: 18,
		height: 3,
		alignX: ALIGN.start,
		alignY: ALIGN.end
	}
];