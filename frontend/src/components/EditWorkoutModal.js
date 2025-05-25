import { useState, useEffect } from "react";

function EditWorkoutModal({ isOpen, onClose, onSave, workout }) {
    const [formData, setFormData] = useState(workout || {});

    useEffect(() => {
        setFormData(workout);
    }, [workout]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (!isOpen || !formData) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-xl w-96 shadow-lg">
                <h2 className="text-xl text-white font-bold mb-4">Edit Workout</h2>
                <div className="grid grid-cols-1 gap-4 mb-6">
                    <div className="flex flex-col">
                        <label htmlFor="repetitions" className="text-white mb-2">Repetitions</label>
                        <input
                            type="number"
                            name="repetitions"
                            id="repetitions"
                            value={formData.repetitions || ""}
                            onChange={handleChange}
                             className="w-full p-2 rounded bg-gray-700 text-white"
                            placeholder="Reps"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="sets" className="text-white mb-2">Sets</label>
                        <input
                            type="number"
                            name="sets"
                            id="sets"
                            value={formData.sets || ""}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            placeholder="Sets"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="weight" className="text-white mb-2">Weight (kg)</label>
                        <input
                            type="number"
                            name="weight"
                            id="weight"
                            value={formData.weight || ""}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            placeholder="Weight"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-6 gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 text-white">Cancel</button>
                    <button onClick={() => onSave(formData)} className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 text-white">Save</button>
                </div>
            </div>
        </div>
    );
};

export default EditWorkoutModal;
