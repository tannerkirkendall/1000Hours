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

function niceData(x){
    return {
        _id: x._id,
        startTime: format(parseISO(x.startTime), "MM/dd/yyyy' 'h:mm a"),
        endTime: x?.endTime == null ? "": format(parseISO(x.endTime), "MM/dd/yyyy' 'h:mm a"),
        totalElapsedMinutes: x.totalElapsedMinutes,
        elapsedHours: x.elapsedHours,
        elapsedMinutes: x.elapsedMinutes,
        elapsedFormat: x?.endTime == null ? "" : padTime(x.elapsedHours)+ ":" + padTime(x.elapsedMinutes)
    };
}

function allNiceData(data){
    return data.map(x => {
        return niceData(x);
    })
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
        },
        postActivity({ commit }, data){
            var d = '';
            return DataService.postActivity(data).then(
                ret => {
                    d = ret;
                    Promise.resolve(ret);

                    return DataService.getActivity(d.data._id).then(
                        ret2 => {
                            commit('updateActivity', ret2)
                            return Promise.resolve(ret2);
                        }
                    );
                }
            );
        },
        patchActivity({ commit }, patch){
            return DataService.patchActivity(patch.id, patch.data).then(
                ret => {
                    Promise.resolve(ret);
                    return DataService.getActivity(patch.id).then(
                        ret2 => {
                            commit('editActivity', ret2)
                            return Promise.resolve(ret2);
                        }
                    );
                }
            );
        },
        deleteActivity({commit}, id){
            return DataService.deleteActivity(id).then(
                ret => {
                    commit('deleteActivity', id)
                    return Promise.resolve(ret);
                }
            )
        }
    },
    mutations: {
        getActivities(state, ret){
            state.activities = allNiceData(ret.data);
        },
        updateActivity(state, ret){
            state.activities.push(niceData(ret.data));
            state.activities.sort(function compare(a, b) {
                var dateA = new Date(a.startTime);
                var dateB = new Date(b.startTime);
                return dateB - dateA;
              });
        },
        editActivity(state, ret){
            var nice = niceData(ret.data);
            var s = state.activities.findIndex(x => x._id === nice._id);
            state.activities[s] = nice;
        },
        deleteActivity(state, id){
            var s = state.activities.findIndex(x => x._id === id);
            if (s > -1) {
                state.activities.splice(s, 1);
              }
            
        }

    },
    getters: {
        all: (state) => {
            return state.activities;
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