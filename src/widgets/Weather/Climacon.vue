<template>
	<component class="climacon" :style="climaconStyle" :is="climaconIcon" />
</template>


<script>
import IconCloud from '@/assets/icons/climacons/Cloud.svg'
import IconCloudFog from '@/assets/icons/climacons/Cloud-Fog.svg'
import IconCloudHail from '@/assets/icons/climacons/Cloud-Hail.svg'
import IconCloudMoon from '@/assets/icons/climacons/Cloud-Moon.svg'
import IconCloudRain from '@/assets/icons/climacons/Cloud-Rain.svg'
import IconCloudSnow from '@/assets/icons/climacons/Cloud-Snow.svg'
import IconCloudSun from '@/assets/icons/climacons/Cloud-Sun.svg'
import IconMoon from '@/assets/icons/climacons/Moon.svg'
import IconSun from '@/assets/icons/climacons/Sun.svg'
import IconWind from '@/assets/icons/climacons/Wind.svg'

/*
	clear-day		: 'sun				
	clear-night		: 'moon		
	rain			: 'cloud-rain	
	snow			: 'cloud-snow	
	sleet			: 'cloud-hail	
	wind			: 'wind	
	fog				: 'cloud-fog
	cloudy			: 'cloud	
	partly-cloudy-day: 'cloud-sun		(default during day)		
	partly-cloudy-night: 'cloud-moon	(default during night)
*/

const iconComponentMap = {
	'clear-day': IconSun,
	'clear-night': IconMoon,
	'rain': IconCloudRain,
	'snow': IconCloudSnow,
	'sleet': IconCloudHail,
	'wind': IconWind,
	'fog': IconCloudFog,
	'cloudy': IconCloud,
	'partly-cloudy-day': IconCloudSun,
	'partly-cloudy-night': IconCloudMoon
}

export default {
	props: {
		icon: {
			type: String,
			required: true
		},
		size: {
			type: String,
			default: '3em'
		}
	},
	computed: {
		climaconIcon() {
			if (Object.keys(iconComponentMap).includes(this.icon)) {
				return iconComponentMap[this.icon];
			} else {
				console.warn(`Icon with name "${this.icon}" has no svg component mapping.`);
				return iconComponentMap['partly-cloudy-day'];
			}
		},
		climaconStyle() {
			return {
				width: this.size,
				height: this.size
			}
		}
	}
}
</script>

<style>
.climacon {
	color: inherit;
	fill: currentColor;
}

.climacon path {
	transform: scale(1.5) translate(-22.5%, -10%);
}

path.rain, path.fog, path.sleet, path.rain, path.snow {
	transform: scale(1.5) translate(-22.5%, -20%);
}

path.cloudy, path.clear-day, path.wind {
	transform: scale(1.5) translate(-22.5%, -15%);
}

path.clear-night {
	transform: scale(1.75) translate(-27.5%, -20%);
}
</style>
