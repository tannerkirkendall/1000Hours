import DataService from '../services/data.service';
const initialState = {
    activities: []
}

export const activity = {
    namespaced: true,
    state: initialState,
    actions: {
        getActivities({commit}){
            return DataService.getActivities().then(
                ret => {
                    commit('getActivities', ret)
                    return Promise.resolve(ret);
                }
            )
        }
    },
    mutations: {
        getActivities(state, ret){
            state.activities = ret.data.activties;
        }
    },
    getters: {
        all: (state) => {
            return state.activities;
        }
    }
};