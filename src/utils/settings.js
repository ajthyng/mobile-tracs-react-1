/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const DEFAULT_SETTINGS = {
	global_disable: false,
	blacklist: []
};

export default class Settings {
	/**
	 * The constructor for settings is expecting a list of siteIDs, types, and a blacklist if one exists. It should merge these three sets of data into one to ensure the local and remote settings get updated.
	 * @param settings The settings object fetched from Dispatch
	 */
	constructor(settings = DEFAULT_SETTINGS) {
		this.global_disable = settings.global_disable;
		this.blacklist = settings.blacklist;
	}

	getSettings() {
		return {
			global_disable: this.global_disable,
			blacklist: this.blacklist
		};
	}

	globalDisable(bool) {
		this.global_disable = typeof(bool) === 'boolean' ? bool : false;
	}

	setSite(id, enabled) {
		if (enabled === true) {
			this._enableForSite(id);
		} else {
			this._disableForSite(id);
		}
	}

	/**
	 * Enable means turn on notifications, so delete the item from sites
	 * @param id The site id that should be removed from the filter
	 */
	_enableForSite(id) {
		this.blacklist = this.blacklist.filter(entry => {
			if (entry.hasOwnProperty("other_keys")) {
				if (entry["other_keys"].hasOwnProperty("site_id")) {
					return id !== entry["other_keys"]["site_id"]
				}
			}
			return true;
		});
	}

	/**
	 * Disable means turn off notifications, so add to the sites array
	 * @param id The site id that should be added to the filter
	 */
	_disableForSite(id) {
		const entry = {
			keys: {},
			other_keys: {
				site_id: id
			}
		};
		this.blacklist.push(entry);
		this.blacklist = [...new Set(this.blacklist)];
	}

	setType(type, enabled) {
		if (enabled === true) {
			this._enableType(type);
		} else {
			this._disableType(type);
		}
	}

	_enableType(type) {
		this.blacklist = this.blacklist.filter(entry => {
			if (entry.hasOwnProperty("keys")) {
				if (entry["keys"].hasOwnProperty("object_type")) {
					return type !== entry["keys"]["object_type"]
				}
			}
			return true;
		});
	}

	_disableType(type) {
		const entry = {
			keys: {
				object_type: type
			},
			other_keys: {}
		};
		this.blacklist.push(entry);
		this.blacklist = [...new Set(this.blacklist)];
	}

	setTypeAndSite(type, id, enabled) {
		if (enabled === true) {
			this._enableTypeAndSite(type, id);
		} else {
			this._disableTypeAndSite(type, id);
		}
	}

	_enableTypeAndSite(type, id) {
		this.blacklist = this.blacklist.filter(entry => {
			if (entry.hasOwnProperty("keys") && entry.hasOwnProperty("other_keys")) {
				if (entry["keys"].hasOwnProperty("object_type") && entry["other_keys"].hasOwnProperty("site_id")) {
					return type !== entry["keys"]["object_type"] && id !== entry["other_keys"]["site_id"];
				}
			}
		});
	}

	_disableTypeAndSite(type, id) {
		const entry = {
			keys: {
				object_type: type
			},
			other_keys: {
				site_id: id
			}
		};

		this.blacklist.push(entry);
		this.blacklist = [...new Set(this.blacklist)];
	}
}