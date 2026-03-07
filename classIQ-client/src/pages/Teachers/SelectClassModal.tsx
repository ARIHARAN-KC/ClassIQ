import React, { useEffect, useState } from "react";
import { getClasses } from "../../api/classes";
import CreateAssignmentModal from "./CreateAssignmentModal";

interface ClassType {
    _id: string;
    title: string;
    description: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelectClass: (classId: string) => void;
}

const SelectClassModal: React.FC<Props> = ({
    isOpen,
    onClose,
    onSelectClass,
}) => {

    const [classes, setClasses] = useState<ClassType[]>([]);
    const [openCreateAssignment, setOpenCreateAssignment] = useState(false);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await getClasses();
                setClasses(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };

        if (isOpen) fetchClasses();
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

            <div className="bg-white rounded-xl p-6 w-full max-w-lg">

                <h2 className="text-lg font-semibold mb-4">Select Class</h2>

                <div className="space-y-3">

                    {classes.map((cls) => (
                        <div
                            key={cls._id}
                            className="border rounded-lg p-3 flex justify-between items-center"
                        >

                            <div>
                                <p className="font-medium">{cls.title}</p>
                                <p className="text-sm text-gray-500">
                                    {cls.description}
                                </p>
                            </div>

                            <button
                                onClick={() => onSelectClass(cls._id)}
                                className="bg-green-600 text-white px-3 py-1 rounded"
                            >
                                Create
                            </button>

                        </div>
                    ))}

                </div>

                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="text-gray-600"
                    >
                        Close
                    </button>
                </div>

            </div>

        </div>


    );
};

export default SelectClassModal;