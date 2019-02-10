export default function EnableWidgetStore({
	namespace,
	register,
	persist
}) {
	return {
		data() {
			return {
				$_destroyStoreWatcher: null
			}
		},
		beforeCreate() {
			register(this.$store);
			this.$_destroyStoreWatcher = persist(this.$store);
			this.$store.dispatch(`${namespace}/init`);
		},
		beforeDestroy() {
			const unwatch = this.$_destroyStoreWatcher;
			if (unwatch && typeof unwatch === 'function') {
				console.log("Destroying watcher for ", namespace);
				this.$_destroyStoreWatcher();
			}
		}
	}
}