import WidgetNews from './WidgetNews.vue';

export const gridComponents = {
	WidgetNews
};

export const wallpaperComponents = {};

export const settings = {
	slideInterval: {
		name: 'slideInterval',
		getDefault: () => 6000 // 6 sec per item
	}
}

export const displayConfig = {
	WidgetNews: {
		minWidth: 5,
		maxWidth: null,
		minHeight: 1,
		maxHeight: 5,
		canResize: true,
		canMove: true
	}
}