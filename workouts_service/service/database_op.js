import { PrismaClient } from "../generated/prisma/index.js";

const prismaC = new PrismaClient();


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
