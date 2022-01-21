import DataService from '../services/data.service';
import { parseISO, format, isToday, endOfToday, differenceInDays, isThisWeek, startOfToday } from 'date-fns'

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
    const adder = minutes < 0 ? "-" : ""
    return adder + padTime(Math.floor(Math.abs(minutes)/60))+ ":" + padTime(Math.round(Math.abs(minutes)%60));
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
            var totalYear = 0;
            var totalToday = 0;
            var totalWeek = 0;
            var daysYTD = differenceInDays(endOfToday(), new Date(2022, 0, 0))
            var outsideMinutesYTDNeeded = Math.round((1000*60)/daysYTD);
            var dailyTimeNeededOrgMin = (1000*60)/365;

            getters.all.forEach(e => {
                totalYear += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0;
                if (isToday(e.startTimeISO)) totalToday += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0;
                if (isThisWeek(e.startTimeISO, 1)) totalWeek += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0;
            });

            var minutesBehind =  totalYear - outsideMinutesYTDNeeded
            var daysLeftInYear = differenceInDays(new Date(2022, 11, 31), startOfToday())
            var dailyTimeNeededAdjMin = (((1000*60)-outsideMinutesYTDNeeded) + minutesBehind)/daysLeftInYear
    
            return {
                totalTime: getHHMM(totalYear),
                totalTimeLeft: getHHMM((1000*60) - totalYear),
                totalPercentDone: Number.parseFloat((totalYear/((1000*60) - totalYear))*100).toFixed(2),
                totalTimeToday: getHHMM(totalToday),
                totalWeek: getHHMM(totalWeek),
                dailyTimeNeededOrg: getHHMM(dailyTimeNeededOrgMin),
                avgPerDay: getHHMM(totalYear/daysYTD),
                timeNeeded: getHHMM(minutesBehind),
                dailyTimeNeededAdj: getHHMM(dailyTimeNeededAdjMin)
            }
        }
    }
};