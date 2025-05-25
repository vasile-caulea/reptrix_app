
const isValidDate = (d) => !isNaN(new Date(d));

export function getValidatedQuery(query) {
    const { startDate, endDate, exerciseCatId, exerciseId } = query;

    // Validate and parse the query parameters
    const result = {};

    if (!startDate && endDate) {
        throw new Error('End date provided without start date');
    }

    if (exerciseCatId && exerciseId) {
        throw new Error('Both exercise category ID and exercise ID provided');
    }

    if (startDate) {
        if (isValidDate(startDate)) {
            result.startDate = new Date(startDate);
        } else {
            throw new Error('Invalid start date');
        }
    }

    if (endDate) {
        if (isValidDate(endDate)) {
            result.endDate = new Date(endDate);
        } else {
            throw new Error('Invalid end date');
        }
    }

    if (exerciseCatId) {
        result.exerciseCatId = parseInt(exerciseCatId, 10);
    }

    if (exerciseId) {
        result.exerciseId = parseInt(exerciseId, 10);
    }
    return result;
}

export function validateWorkoutData(workoutData) {
    const { date, exerciseId, categoryId, repetitions, sets, weight } = workoutData;

    if (!date || !exerciseId || !categoryId || !repetitions || !sets || !weight) {
        throw new Error('Invalid workout data');
    }

    if (!isValidDate(date)) {
        throw new Error('Invalid date');
    }

    return {
        date: new Date(date),
        exerciseId: parseInt(exerciseId, 10),
        categoryId: parseInt(categoryId, 10),
        repetitions: parseInt(repetitions, 10),
        sets: parseInt(sets, 10),
        weight: parseFloat(weight),
    };
}

export function handleDatabaseError(error, res) {

    if (/^P10(0[0-9]|1[0-7])$/.test(error.code)) {
        console.log('Database access/setup error:', error);
    }

    return res.status(500).json({ message: 'Internal server error' });
}

export function validateUpdateWorkoutData(workoutData) {

    const { repetitions, sets, weight } = workoutData;
    if (!repetitions && !sets && !weight) {
        throw new Error('At least one field (repetitions, sets, weight) must be provided for update');
    }

    const validatedData = {};
    if (repetitions !== undefined) {
        validatedData.repetitions = parseInt(repetitions, 10);
    }
    if (sets !== undefined) {
        validatedData.sets = parseInt(sets, 10);
    }
    if (weight !== undefined) {
        validatedData.weight = parseFloat(weight);
    }
    return validatedData;
}
