const LOADED = 'LOADED';
const LOADING = 'LOADING';
const ERROR = 'ERROR';
const JOIN_MISSION = 'JOIN_MISSION';
const LEAVE_MISSION = 'LEAVE_MISSION';
const URL = 'https://api.spacexdata.com/v3/missions'


const loadingAction = () => ({
    type: LOADING,
})

const errorAction = (error) => ({
    type: ERROR,
    payload: error
})
const loadMissionAction = (data) => ({
    type: LOADED,
    payload: data
})

const joinMissionAction = (id) => ({
    type: JOIN_MISSION,
    payload: id
})

const leaveMissionAction = (id) => ({
    type: LEAVE_MISSION,
    payload: id
})


const initialState = {
  missions: [],
  loading: false,
  error: null

};

export const fetchMissionData = () => (dispatch) => {
    dispatch(loadingAction());
    fetch(URL)
    .then((response) => response.json())
    .then((data) => {
        
        const missionData = [];
        data.forEach((mission) => {  
            missionData.push({
                mission_id: mission.mission_id,
                mission_name:mission.mission_name,
                description: mission.description,
                mission_status: false
            });
        });
        dispatch(loadMissionAction(missionData));
      })
      .catch((error) => {
        dispatch(errorAction(error.message));
      });
  };

  export const joinMission = (id) => {
      return joinMissionAction(id);
  }

  export const leaveMission = (id) => {
    return leaveMissionAction(id);
  }


const missionReducer = (state = initialState, action) => {

    switch(action.type){
        case LOADING:
            return {
                ...state,
                loading: true,
            }
        case ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        
        case LOADED:
            return {
                ...state,
                loading: false,
                missions: action.payload
            }
        
        case JOIN_MISSION:
           const newState = state.missions.map(mission => {
               
                if (mission.mission_id === action.payload) {
                    return {
                        ...mission,
                        mission_status: true
                    };
                };
                return mission;
            });

            return {
                ...state, 
                missions: newState
            };
        
        case LEAVE_MISSION:
            const missionState = state.missions.map(mission => {
               
                if (mission.mission_id === action.payload) {
                    return {
                        ...mission,
                        mission_status: false
                    };
                };
                return mission;
            });

            return {
                ...state, 
                missions: missionState
            };


        default:
            return state
    }

}


export default missionReducer