import DataService from '../services/data.service';
import { parseISO, format } from 'date-fns'

const initialState = {
    activities: []
}

export const activity = {
    namespaced: true,
    state: initialState,
    actions: {
        init({commit}){
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
            state.activities = ret.data;
        }
    },
    getters: {
        all: (state) => {
            return state.activities.map(x => {
                return {
                    _id: x._id,
                    startTime: format(parseISO(x.startTime), "MM/dd/yyyy' 'hh:mmaaa"),
                    endTime: x.endTime == null ? "": format(parseISO(x.endTime), "MM/dd/yyyy' 'hh:mmaaa"),
                    totalElapsedMinutes: x.totalElapsedMinutes,
                    elapsedHours: x.elapsedHours,
                    elapsedMinutes: x.elapsedMinutes     
                }
            })
        },

        totalMinutes: (state, getters) => {
            var totalMin = 0;
            getters.all.forEach((x) => {
                totalMin += x.totalElapsedMinutes > 0 ? parseInt(x.totalElapsedMinutes) : 0
            });
            return totalMin
            
        }
    }
};