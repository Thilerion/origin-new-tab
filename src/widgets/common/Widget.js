const defaultDisplayConfig = {
	minWidth: 2,
	maxWidth: null,
	minHeight: 1,
	maxHeight: null,
	initialWidth: 9,
	initialHeight: 3,
	canResize: true,
	canMove: true
}

class Widget {
	constructor({
		name,
		value,
		gridComponents = {},
		wallpaperComponents = {},
		settings = {},
		displayConfig = {},
		settingsComponent,
		localeMessages
	} = {}) {
		this.name = name;
		// TODO: should probably be named 'id' or 'key'
		this.value = value;

		this.gridComponents = gridComponents;
		this.displayConfig = { ...defaultDisplayConfig, ...displayConfig };
		
		this.wallpaperComponents = wallpaperComponents;
				
		this.settingsComponent = settingsComponent;
		this.settings = settings;
		
		this.localeMessages = localeMessages;
	}

	get localeNamePath() {
		return `${this.value}.settingName`;
	}
}

export default Widget;