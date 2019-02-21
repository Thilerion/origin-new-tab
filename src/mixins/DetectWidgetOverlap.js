export default {
	data() {
		return {

		}
	},
	computed: {

	},
	methods: {
		initDetectWidgetOverlap(idx, uid) {
			if (this.selectedWidget === idx && this.editing) {
				this.detectWidgetOverlap(uid);
			}
		},
		doesOverlap(w1, w2) {
			const { left, right, top, bottom } = w1;
			const { x: wLeft, y: wTop } = w2;
			const wRight = wLeft + w2.width;
			const wBottom = wTop + w2.height;

			const xOverlap = !(
				wRight <= left || wLeft >= right
			);
			const yOverlap = !(
				wBottom <= top || wTop >= bottom
			);
			return xOverlap && yOverlap;
		},
		detectWidgetOverlap(uid) {
			const widgets = this.sortedGridWidgets;
			const idx = widgets.findIndex(w => w.uid === uid);

			const { x: left, y: top, width, height } = widgets[idx];
			const curWidget = {
				left,
				top,
				right: left + width,
				bottom: top + height
			};


			let highestOverlap = null;

			for (let i = idx + 1; i < widgets.length; i++) {
				if (this.doesOverlap(curWidget, widgets[i])) {
					highestOverlap = i;
				}
			}

			if (highestOverlap) {
				console.log({ name: widgets[idx].name, idx });
				console.log({ name: widgets[highestOverlap].name, idx: highestOverlap });
				// console.log("Element should be moved above ", highestOverlap);
				const to = highestOverlap;
				this.$store.commit('editWidgetOrder', { uid, to: to });
			}
		}
	}
}