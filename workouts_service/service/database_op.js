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