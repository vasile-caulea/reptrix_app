import { prismaC } from "../prisma.js";


export async function getWorkouts(userId, query) {

    const { startDate, endDate, exerciseCatId, exerciseId } = query;

    const filters = {
        userID: userId,
    }

    if (exerciseCatId) {
        filters.categoryID = exerciseCatId;
    }

    if (exerciseId) {
        filters.exerciseID = exerciseId;
    }

    if (startDate && endDate) {
        filters.date = { gte: startDate, lte: endDate };
    } else {
        if (startDate) {
            filters.date = startDate;
        }
    }

    return prismaC.workout.findMany({
        where: filters,
    });
}

export async function getWorkoutDates(userId, query) {
    const startDate = new Date(query.year, query.month - 1, 1);
    const endDate = new Date(query.year, query.month, 0);

    const filters = {
        userID: userId,
        date: {
            gte: startDate,
            lte: endDate,
        },
    }

    return prismaC.workout.findMany({
        where: filters,
        distinct: ['date'],
        select: {
            date: true,
        },
    });
}


export async function createWorkout(userId, workoutData) {
    const { date, exerciseId, categoryId, repetitions, sets, weight } = workoutData;

    return prismaC.workout.create({
        data: {
            userID: userId,
            date: date,
            exerciseID: exerciseId,
            categoryID: categoryId,
            repetitions: repetitions,
            sets: sets,
            weight: weight,
        },
    });
}

export async function updateWorkout(userId, workoutId, updatedData) {
    const { repetitions, sets, weight } = updatedData;
    const dataToUpdate = {};
    if (repetitions !== undefined) dataToUpdate.repetitions = repetitions;
    if (sets !== undefined) dataToUpdate.sets = sets;
    if (weight !== undefined) dataToUpdate.weight = weight;

    return prismaC.workout.update({
        where: {
            id: workoutId,
            userID: userId,
        },
        data: dataToUpdate,
    });
}

export async function deleteWorkout(userId, workoutId) {
    return prismaC.workout.delete({
        where: {
            id: workoutId,
            userID: userId,
        },
    });
}
