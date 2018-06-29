export default {
	components: {
		settings: "Instellingen",
		general: "Algemeen",
		widgets: "Widgets",
		weather: "Weer",
		wallpaper: "Achtergrond",
		quote: "Quote",
		news: "Nieuws",
		topSites: "Meest bezochte sites",
		topPages: "Meest bezochte sites",
		clock: "Klok",
		calendar: "Agenda"
	},
	settings: {
		name: "Naam",
		language: "Taal",
		timeFormat: {
			title: "Tijdsnotatie",
			'12': "12 uur",
			'24': "24 uur"
		},
		fontSize: {
			title: "Textgrootte",
			default: "Standaard",
			custom: "Aangepast"
		},
		showGreeting: "Welkomsttekst weergeven",
		showDate: "Datum weergeven",
		activeWidgets: "Actieve widgets",
		presetLayouts: {
			title: "Kies een voorinstelling",
			note: "Let op: voorinstellingen zijn nog in beta; het is mogelijk dat de grootten van de widgets nog aangepast moeten worden.",
			standard: "Standaard",
			basic: "Simpel",
			minimal: "Minimalistisch",
			quote: "Quote",
			news: "Nieuws"
		},
		changeWidgetDisplay: "Layout aanpassen",
		useCustomLocation: {
			title: "Gebruik aangepaste locatie",
			disabled: "Nee, gebruik browser locatie",
			enabled: "Ja: "
		},
		units: {
			title: "Eenheden",
			metric: "Metrisch",
			imperial: "Imperiaal"
		},
		wallpaperCollection: "Achtergrond collectie",
		newWallpaper: {
			title: "Nieuwe achtergrond elk:",
			always: "Nieuw tabblad",
			hourlyOne: "Uur",
			hourlyFour: "4 uur",
			daily: "Dag",
			never: "Nooit"
		},
		quoteCategory: {
			title: "Quote categorie",
			motivinspirational: "Inspirerend",
			movies: "Film",
			famous: "Beroemdheden"
		},
		newsInterval: "Tijd tussen nieuwsberichten",
		topSitesAmount: "Hoeveel websites",
		topSitesColumns: "Kolommen",
		resetSettings: "Herstel standaardinstellingen",
		save: "Opslaan"
	},
	clock: {
		messages: ['Goedemorgen', 'Hallo', 'Goedenavond', 'Goedenacht'],
		saveHint: "Druk op [enter] om op te slaan"
	},
	wallpaperDetails: {
		photoBy: "Foto door ",
		on: " op ",
		photoFrom: "Foto van ",
		loadError: "Probleem met laden. Standaardafbeelding wordt weergegeven."
	},
	dates: {
		today: "Vandaag",
		tomorrow: "Morgen"
	}
}