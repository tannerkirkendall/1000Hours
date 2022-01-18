import DataService from '../services/data.service';
import { parseISO, format } from 'date-fns'

const initialState = {
    activities: []
}

function padTime(data){
    if (data != null && data <= 9 ){
        return "0" + data;
    }
    else return data;
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
                    startTime: format(parseISO(x.startTime), "MM/dd/yyyy' 'h:mm a"),
                    endTime: x.endTime == null ? "": format(parseISO(x.endTime), "MM/dd/yyyy' 'h:mm a"),
                    totalElapsedMinutes: x.totalElapsedMinutes,
                    elapsedHours: x.elapsedHours,
                    elapsedMinutes: x.elapsedMinutes,
                    elapsedFormat: x.endTime == null ? "" : padTime(x.elapsedHours)+ ":" + padTime(x.elapsedMinutes)
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