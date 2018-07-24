import {initialState} from "../../src/reducers/settings";
import {settingsActions} from '../../src/constants/actions';
import {settingsReducer} from "../../src/reducers/settings";

const settings = settingsActions;

it('should handle Request_Settings action', () => {

	const action = {
		type: settings.REQUEST_SETTINGS,
		isFetching: true,
		isLoaded: false,
		errorMessage: ""

	};
	expect(settingsReducer(initialState, action)).toEqual({
		...initialState,
		isFetching: true,
		isLoaded: false,
		errorMessage: "",

	});


});


it('should handle Settings_Success action', () => {
	const action = {

		type: settings.SETTINGS_SUCCESS,
		userSettings: {},
		isFetching: false,
		isLoaded: true,

	};
	expect(settingsReducer(initialState, action)).toEqual({

		...initialState,
		userSettings: action.userSettings,
		isFetching: false,
		isLoaded: true,


	});


});

it('should handle Settings_Failure action', () => {

		const action = {

			type: settings.SETTINGS_FAILURE,
			isFetching: false,
			isLoaded: false,
			userSettings: initialState.userSettings,
			errorMessage: "",

		};

		expect(settingsReducer(initialState, action)).toEqual({

			...initialState,
			userSettings: action.userSettings,
			isFetching: false,
			isLoaded: false,

			errorMessage: action.errorMessage,


		});
	}
);

it('should handle Request_Save_Settings action', () => {

	const action = {
		type: settings.REQUEST_SAVE_SETTINGS,
		isSaving: true,
		isSaved: false,
		errorMessage: initialState.errorMessage
	};

	expect(settingsReducer(initialState, action)).toEqual({

		...initialState,
		isSaving: true,
		isSaved: false,
		errorMessage: action.errorMessage


	});


});


it('should handle Save_Settings_Success', () => {
	const action = {
		type: settings.SAVE_SETTINGS_SUCCESS,
		userSettings: {},
		isSaving: false,
		isSaved: true,
	};

	expect(settingsReducer(initialState, action)).toEqual({

		...initialState,
		userSettings: action.userSettings,
		isSaving: false,
		isSaved: true

	});

});


it('should handle Save_Settings_Failure', () => {
	const action = {
		type: settings.SAVE_SETTINGS_FAILURE,

		isSaving: false,
		isSaved: false,
		errorMessage: ""
	};

	expect(settingsReducer(initialState, action)).toEqual({

		...initialState,
		isSaving: false,
		isSaved: false,
		errorMessage: action.errorMessage

	});

});



