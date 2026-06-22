import { useState, useRef } from 'react';
import { useForm, router } from '@inertiajs/react';
import { DocumentIcon, ArrowDownTrayIcon, TrashIcon, LinkIcon, GlobeAltIcon, LockClosedIcon } from '@heroicons/react/24/outline';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function ProjectFilesTab({ project }) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // Form cho multi upload
    const { data, setData, post, processing, errors, reset } = useForm({
        files: [],
    });

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFilesSelect(e.dataTransfer.files);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFilesSelect(e.target.files);
        }
    };

    const handleFilesSelect = (selectedFiles) => {
        const filesArray = Array.from(selectedFiles);
        
        // Upload immediately
        router.post(route('projects.files.store', project.id), { files: filesArray }, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset('files');
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        });
    };

    const togglePublic = (file) => {
        router.post(route('files.toggle-public', file.id), {}, { preserveScroll: true });
    };

    const deleteFile = (file) => {
        if (confirm('Are you sure you want to delete this file?')) {
            router.delete(route('files.destroy', file.id), { preserveScroll: true });
        }
    };

    const copyLink = (file, isPublic = false) => {
        const link = isPublic 
            ? route('files.public.show', file.public_token)
            : route('files.show', file.id);
            
        navigator.clipboard.writeText(link).then(() => {
            alert('Link copied to clipboard!');
        });
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    return (
        <div className="space-y-6">
            {/* Drag & Drop Area */}
            <div
                className={classNames(
                    'mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10 transition-colors',
                    isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-900/25 bg-white',
                    processing ? 'opacity-50 pointer-events-none' : ''
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="text-center">
                    <DocumentIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                        <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500 bg-transparent"
                        >
                            <span>Upload files</span>
                            <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                multiple
                                className="sr-only"
                                ref={fileInputRef}
                                onChange={handleFileInput}
                            />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">Any file up to 50MB</p>
                    {processing && <p className="text-sm font-medium text-indigo-600 mt-2">Uploading...</p>}
                    {errors.files && <p className="text-sm text-red-600 mt-2">{errors.files}</p>}
                </div>
            </div>

            {/* File List */}
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                        File Name
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Size
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Uploaded By
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Date
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                        Status
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {project.files && project.files.length > 0 ? (
                                    project.files.map((file) => (
                                        <tr key={file.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                <a href={route('files.show', file.id)} className="text-indigo-600 hover:text-indigo-900 flex items-center gap-2">
                                                    <DocumentIcon className="h-5 w-5 text-gray-400" />
                                                    {file.file_name}
                                                </a>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatBytes(file.file_size)}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{file.user?.name}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {new Date(file.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                                                <button
                                                    onClick={() => togglePublic(file)}
                                                    className={classNames(
                                                        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                                                        file.is_public ? "bg-green-50 text-green-700 ring-green-600/20" : "bg-gray-50 text-gray-600 ring-gray-500/10"
                                                    )}
                                                    title="Click to toggle public/private"
                                                >
                                                    {file.is_public ? <GlobeAltIcon className="w-3 h-3 mr-1" /> : <LockClosedIcon className="w-3 h-3 mr-1" />}
                                                    {file.is_public ? 'Public' : 'Private'}
                                                </button>
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => copyLink(file, file.is_public)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                        title="Copy Link"
                                                    >
                                                        <LinkIcon className="h-5 w-5" />
                                                    </button>
                                                    <a
                                                        href={route('files.download', file.id)}
                                                        className="text-indigo-400 hover:text-indigo-600"
                                                        title="Download"
                                                    >
                                                        <ArrowDownTrayIcon className="h-5 w-5" />
                                                    </a>
                                                    <button
                                                        onClick={() => deleteFile(file)}
                                                        className="text-red-400 hover:text-red-600"
                                                        title="Delete"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-8 text-center text-sm text-gray-500">
                                            No files uploaded yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
