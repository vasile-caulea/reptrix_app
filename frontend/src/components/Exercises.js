import { useState, useEffect } from "react";
import ExerciseSelector from "./ExerciseSelector";
import { getExerciseById } from "../services/WorkoutManagement";
import MediaCarousel from "./MediaCarousel";
import parse from 'html-react-parser';

function Exercises() {
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [equipment, setEquipment] = useState([]);
    const [exerciseCategory, setExerciseCategory] = useState("");
    const [muscleGroups, setMuscleGroups] = useState([]);
    const [secondaryMuscleGroups, setSecondaryMuscleGroups] = useState([]);
    const [description, setDescription] = useState("");

    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const handleSelectExercise = async (exercise) => {
        if (!exercise) {
            setSelectedExercise(null);
            setImages([]);
            setEquipment([]);
            setExerciseCategory("");
            setMuscleGroups([]);
            setSecondaryMuscleGroups([]);
            return;
        }
        const exerciseDetails = await getExerciseById(exercise.id);
        console.log("Selected exercise details:", exerciseDetails);
        setImages(exerciseDetails.images?.map(img => img.image) || []);
        setVideos(exerciseDetails.videos?.map(v => v.video) || []);
        setEquipment(exerciseDetails.equipment?.map(equip => equip.name) || []);
        setExerciseCategory(exerciseDetails.category?.name || "");
        setMuscleGroups(exerciseDetails.muscles?.map(muscle => (muscle.name || muscle.name_en)) || []);
        setSecondaryMuscleGroups(exerciseDetails.muscles_secondary?.map(muscle => (muscle.name || muscle.name_en)) || []);

        const translation = exerciseDetails.translations?.find(t => t.language === 2);
        setDescription(translation?.description || "");
        setSelectedExercise(exercise);
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <h1 className="text-xl font-bold text-white mb-4">Search Exercises</h1>

            <ExerciseSelector onSelectExercise={handleSelectExercise} />

            {selectedExercise && (
                <div className="mt-6 bg-gray-800 border border-gray-700 rounded p-6 text-white space-y-6">
                    <h2 className="text-3xl font-bold text-center">{selectedExercise.name}</h2>

                    {(images.length > 0 || videos.length > 0) && (
                        <div className="flex justify-center">
                            <div className="w-full max-w-xl">
                                <MediaCarousel images={images} videos={videos} />
                            </div>
                        </div>
                    )}

                    {description && (
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Description:</h3>
                            <div className="text-gray-300 leading-relaxed text-justify space-y-2">
                                {parse(description)}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {exerciseCategory && (
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Category:</h3>
                                <p className="text-gray-300">{exerciseCategory}</p>
                            </div>
                        )}

                        {equipment.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Equipment:</h3>
                                <ul className="list-disc list-inside text-gray-300">
                                    {equipment.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {muscleGroups.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Muscle Groups:</h3>
                                <ul className="list-disc list-inside text-gray-300">
                                    {muscleGroups.map((muscle, index) => (
                                        <li key={index}>{muscle}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {secondaryMuscleGroups.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Secondary Muscles:</h3>
                                <ul className="list-disc list-inside text-gray-300">
                                    {secondaryMuscleGroups.map((muscle, index) => (
                                        <li key={index}>{muscle}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

            )}
        </div>
    );
}

export default Exercises;
