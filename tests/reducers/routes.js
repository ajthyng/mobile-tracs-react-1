import {initialState, routesReducer} from "../../src/reducers/routes";
import {routingActions} from '../../src/constants/actions';

const routes = routingActions;

it("should handle Navigate action", () => {
	const action = {
		type: routes.CURRENT_SCENE
	}
})