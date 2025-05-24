import axios from 'axios';
import { WGER_API_URL, WGER_API_VERSION, WGER_API_EXERCISE_INFO_PATH, WGER_API_LANGUAGE_ENGLISH } from '../Constants';
import { WORKOUT_API_URL } from '../Constants';
import { getToken } from './Auth';

export async function getAllExercises() {
    const response = await axios.get(`${WGER_API_URL}${WGER_API_VERSION}/${WGER_API_EXERCISE_INFO_PATH}?language=${WGER_API_LANGUAGE_ENGLISH}&limit=1000`);
    if (response.status === 200) {
        return response.data.results.map((exercise) => {
            const translation = (exercise.translations || []).find((t) => t.language === WGER_API_LANGUAGE_ENGLISH);
            return {
                id: exercise.id,
                name: translation?.name || 'Unnamed',
                categoryID: exercise.category.id,
            }
        });
    }
    else {
        throw new Error(response.statusText);
    }
}

export async function getAllExerciseCategories() {
    const response = await axios.get(`${WGER_API_URL}${WGER_API_VERSION}/exercisecategory`);
    if (response.status === 200) {
        return response.data.results;
    }
    else {
        throw new Error(response.statusText);
    }
}

function getAuthHeaders() {
    const token = getToken();
    if (!token) {
        throw new Error('You must be logged in.');
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
        throw new Error('User ID not found.');
    }

    return {
        userId,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
}

export async function addWorkout(workout) {

    const { userId, headers } = getAuthHeaders();
    return axios.post(`${WORKOUT_API_URL}/users/${userId}/workouts`, workout, {
        headers: headers
    });
}

export async function getAllWorkouts(filters) {
    const { userId, headers } = getAuthHeaders();

    const { startDate, endDate, exercise, exerciseCategory } = filters;

    const params = {}
    if (startDate) {
        params.startDate = startDate;
    }
    if (endDate) {
        params.endDate = endDate;
    }
    if (exercise) {
        params.exerciseId = exercise.id;
    }
    if (exerciseCategory) {
        params.exerciseCatId = exerciseCategory.id;
    }

    return axios.get(`${WORKOUT_API_URL}/users/${userId}/workouts`, {
        headers: headers, params: params
    });
}

export async function getWorkoutsForMonth(year, month) {
    const { userId, headers } = getAuthHeaders();

    const params = {
        year: year,
        month: month
    }
    return axios.get(`${WORKOUT_API_URL}/users/${userId}/workouts/dates`, {
        headers: headers, params: params
    });
}
