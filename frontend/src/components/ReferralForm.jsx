import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCandidate, clearError } from "../store/slices/candidatesSlice";

const ReferralForm = ({ onClose }) => {
    const dispatch = useDispatch();
    const { error } = useSelector((state) => state.candidates);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        jobTitle: "",
        resume: null,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "resume") {
            setFormData((prev) => ({ ...prev, resume: files[0] || null }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
        // Clear global error
        if (error) {
            dispatch(clearError());
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = "Email is invalid";
        if (!formData.phone.trim()) newErrors.phone = "Phone is required";
        else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone))
            newErrors.phone = "Phone number is invalid";
        if (!formData.jobTitle.trim())
            newErrors.jobTitle = "Job title is required";

        if (formData.resume && formData.resume.type !== "application/pdf") {
            newErrors.resume = "Only PDF files are allowed";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await dispatch(addCandidate(formData)).unwrap();
            setFormData({
                name: "",
                email: "",
                phone: "",
                jobTitle: "",
                resume: null,
            });
            setErrors({});
            onClose?.();
        } catch (error) {
            console.error("Failed to submit candidate:", error);
            // Error is now handled in the Redux state
        } finally {
            setIsSubmitting(false);
        }
    };

    const getErrorMessage = () => {
        if (error) {
            return typeof error === "string"
                ? error
                : "Failed to submit candidate";
        }
        return null;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                >
                    Candidate Name *
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                >
                    Email *
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
            </div>

            <div>
                <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                >
                    Phone Number *
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g., +1 (555) 123-4567"
                    className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
            </div>

            <div>
                <label
                    htmlFor="jobTitle"
                    className="block text-sm font-medium text-gray-700"
                >
                    Job Title *
                </label>
                <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.jobTitle ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.jobTitle && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.jobTitle}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="resume"
                    className="block text-sm font-medium text-gray-700"
                >
                    Resume (PDF only, max 5MB)
                </label>
                <input
                    type="file"
                    id="resume"
                    name="resume"
                    accept=".pdf"
                    onChange={handleChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {errors.resume && (
                    <p className="mt-1 text-sm text-red-600">{errors.resume}</p>
                )}
            </div>

            {getErrorMessage() && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <span className="text-red-400">⚠️</span>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                Error
                            </h3>
                            <p className="text-sm text-red-700 mt-1">
                                {getErrorMessage()}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isSubmitting ? "Submitting..." : "Refer Candidate"}
                </button>
            </div>
        </form>
    );
};

export default ReferralForm;
