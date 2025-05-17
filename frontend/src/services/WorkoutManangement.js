import axios from 'axios';
import { WGER_API_URL, WGER_API_VERSION, WGER_API_EXERCISE_INFO_PATH, WGER_API_LANGUAGE_ENGLISH } from '../Constants';
import { WORKOUT_API_URL, WORKOUT_API_PATH } from '../Constants';
import { getToken } from './Auth';

export async function getAllExercises() {
    const response = await axios.get(`${WGER_API_URL}${WGER_API_VERSION}/${WGER_API_EXERCISE_INFO_PATH}?language=${WGER_API_LANGUAGE_ENGLISH}&limit=1000`);
    if (response.status === 200) {
        return response.data.results.map((exercise) => {
            const translation = (exercise.translations || []).find((t) => t.language === WGER_API_LANGUAGE_ENGLISH);
            return {
                id: exercise.id,
                name: translation?.name || 'Unnamed'
            }
        });
    }
    else {
        throw new Error(response.statusText);
    }
}

export async function addWorkout(workout) {

    const token = getToken();
    if (!token) {
        throw new Error('You must be logged in to add a workout.');
    }
    return axios.post(`${WORKOUT_API_URL}${WORKOUT_API_PATH}`, workout,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

