import DataService from '../services/data.service';
import { parseISO, format, isToday, endOfToday, differenceInDays } from 'date-fns'

const initialState = {
    activities: [],
    totals: {}
}

function padTime(data){
    if (data != null && data <= 9 ){
        return "0" + data;
    }
    else return data;
}

function getHHMM(minutes){
    return padTime(Math.floor(minutes/60))+ ":" + padTime(Math.round(minutes%60));
}

function niceData(x){
    return {
        _id: x._id,
        startTimeISO: parseISO(x.startTime),
        endTimeISO: parseISO(x.endTime),
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
                    )
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
                    Promise.resolve(ret);
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

        totals: (state, getters) => {
            var total = 0;
            var totalToday = 0;
            var daysYTD = differenceInDays(endOfToday(), new Date(2022, 0, 0))
            var outsideMinutesYTDNeeded = Math.round((1000*60)/daysYTD);
            var minutesPerDayYear = (1000*60)/365;


            getters.all.forEach(e => {
                total += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0;
                if (isToday(e.startTimeISO)) totalToday += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0;
            });
    
            var minutesNeeded = outsideMinutesYTDNeeded - total

            const x = {
                totalElapsedMinutes : total,
                totalTodayAllMinutes: totalToday,

                
                outsideMinutesYTDNeeded: outsideMinutesYTDNeeded,
                HHMMNeeded: getHHMM(minutesNeeded)
           
            }

            return {
                totalTime: getHHMM(x.totalElapsedMinutes),
                totalTimeToday: getHHMM(totalToday),
                hhmmToDateOrignal: getHHMM(minutesPerDayYear),
                avgPerDay: getHHMM(total/daysYTD),
                data: x
            }
        }
    }
};