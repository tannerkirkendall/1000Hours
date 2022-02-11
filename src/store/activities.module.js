import DataService from '../services/data.service';
import { parseISO, format, isToday, endOfToday, differenceInDays, isThisWeek, startOfToday, 
    isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday, isSunday, startOfWeek, 
    addDays, endOfWeek, isWithinInterval } from 'date-fns'

const initialState = {
    activities: [],
    totals: {}
}

function isLastWeek(date){
    var today = Date.now();
    var sow = addDays(startOfWeek(today, { weekStartsOn: 1 }), -7)
    var eow = endOfWeek(sow, { weekStartsOn: 1 });
    // return {sow: sow, eow:eow, is: isWithinInterval(new Date(2022, 1, 7), {start:sow, end:eow})};
    return isWithinInterval(date, {start:sow, end:eow});
}

function minutesToHours(data){
    if (data!= null && data > 0){
        return Number.parseFloat(data/60).toFixed(2);
    }else {
        return 0;
    }
}

function hoursToMinutes(data){
    const words = String(data).split('.');
    const hours = words[0]*60;
    const m1 = parseInt(words[1]);
    var multiplier = m1.toString().length == 1 ? .1 : .01;
    var m2 = Math.floor((((m1*multiplier)/100)*60).toFixed(2) * 100)
    return getHHMM(hours+m2);
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
            var dailyTimeNeededOrgMin = 165;
            var outsideMinutesYTDNeeded = Math.round(dailyTimeNeededOrgMin * daysYTD);
            var daysLeftInYear = differenceInDays(new Date(2022, 11, 31), startOfToday())
            
            getters.all.forEach(e => {
                totalYear += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0;
                if (isToday(e.startTimeISO)) totalToday += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0;
                if (isThisWeek(e.startTimeISO, { weekStartsOn: 1 })) totalWeek += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0;
            });

            var minutesBehind =  totalYear - outsideMinutesYTDNeeded
            var dailyTimeNeededAdjMin =  ((165 * daysLeftInYear) - minutesBehind)/daysLeftInYear;
    
            return {
                totalTime: getHHMM(totalYear),
                totalTimeLeft: getHHMM((1000*60) - totalYear),
                totalPercentDone: Number.parseFloat((totalYear/((1000*60)))*100).toFixed(2),
                totalTimeToday: getHHMM(totalToday),
                timeTodayPercent: Math.floor((totalToday/dailyTimeNeededAdjMin)*100),
                weekTodayPercent: Math.floor((totalWeek/(dailyTimeNeededAdjMin*7))*100),
                totalWeek: getHHMM(totalWeek),
                totalWeekNeeded: getHHMM(dailyTimeNeededAdjMin * 7),
                dailyTimeNeededAdj: getHHMM(dailyTimeNeededAdjMin),
                avgPerDay: getHHMM(totalYear/daysYTD),
                timeNeeded: getHHMM(minutesBehind)
            }
        },

        hoursPerDayThisWeek(state, getters) {
            var monday = 0;
            var tuesday = 0;
            var wednesday = 0;
            var thursday = 0;
            var friday = 0;
            var saturday = 0;
            var sunday = 0;
            var thisWeekTotal = 0;

            var lastmonday = 0;
            var lasttuesday = 0;
            var lastwednesday = 0;
            var lastthursday = 0;
            var lastfriday = 0;
            var lastsaturday = 0;
            var lastsunday = 0;
            var lastWeekTotal = 0;

            getters.all.forEach(e => {
                if (isThisWeek(e.startTimeISO, { weekStartsOn: 1 }))
                {
                    thisWeekTotal += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0;
                    if (isMonday(e.startTimeISO)) monday += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0
                    if (isTuesday(e.startTimeISO)) tuesday += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0
                    if (isWednesday(e.startTimeISO)) wednesday += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0
                    if (isThursday(e.startTimeISO)) thursday += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0
                    if (isFriday(e.startTimeISO)) friday += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0
                    if (isSaturday(e.startTimeISO)) saturday += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0
                    if (isSunday(e.startTimeISO)) sunday += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0
                }
                if (isLastWeek(e.startTimeISO))
                {
                    lastWeekTotal += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0;
                    if (isMonday(e.startTimeISO)) lastmonday += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0
                    if (isTuesday(e.startTimeISO)) lasttuesday += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0
                    if (isWednesday(e.startTimeISO)) lastwednesday += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0
                    if (isThursday(e.startTimeISO)) lastthursday += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0
                    if (isFriday(e.startTimeISO)) lastfriday += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0
                    if (isSaturday(e.startTimeISO)) lastsaturday += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0
                    if (isSunday(e.startTimeISO)) lastsunday += e.totalElapsedMinutes > 0 ? e.totalElapsedMinutes : 0
                }
            });

            var data = {
                
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                datasets: [
                  {
                    label: 'This Week (' + getHHMM(thisWeekTotal) + ')',
                    backgroundColor: '#6200ee',
                    data: [minutesToHours(monday), minutesToHours(tuesday), minutesToHours(wednesday), minutesToHours(thursday), 
                        minutesToHours(friday), minutesToHours(saturday), minutesToHours(sunday)]
                  },
                  {
                    label: 'Last Week (' + getHHMM(lastWeekTotal) + ')',
                    backgroundColor: '#B4DF96',
                    data: [minutesToHours(lastmonday), minutesToHours(lasttuesday), minutesToHours(lastwednesday), minutesToHours(lastthursday), 
                        minutesToHours(lastfriday), minutesToHours(lastsaturday), minutesToHours(lastsunday)]
                  }
                ]
              }

            return {
                data: data,
                options: {
                    responsive: true,
                    title: {
                      display: false,
                      text: 'Hours Per Day'
                    },
                    tooltips: {
                      enabled: true,
                      callbacks: {
                        label: ((tooltipItems) => {
                          return hoursToMinutes(tooltipItems.yLabel)
                        })
                      }
                    }
                }
            };
        }
    }
};