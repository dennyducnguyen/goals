import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { DocumentIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function Show({ auth, file, isPublicView }) {

    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    const downloadUrl = isPublicView
        ? route('files.public.download', file.public_token)
        : route('files.download', file.id);

    const PageContent = () => (
        <div className="py-12">
            <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 text-center">
                        <DocumentIcon className="mx-auto h-24 w-24 text-indigo-500 mb-6" />
                        
                        <h2 className="text-2xl font-bold mb-2 break-all">{file.file_name}</h2>
                        
                        <div className="text-gray-500 mb-8 flex flex-col gap-1 items-center">
                            <p><strong>Project:</strong> {file.project?.title}</p>
                            <p><strong>Size:</strong> {formatBytes(file.file_size)}</p>
                            <p><strong>Type:</strong> {file.file_type || 'Unknown'}</p>
                            <p><strong>Uploaded by:</strong> {file.user?.name} on {new Date(file.created_at).toLocaleString()}</p>
                        </div>

                        <a
                            href={downloadUrl}
                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            Download File
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );

    // Render logic for public vs internal
    if (isPublicView) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Head title={file.file_name} />
                {/* Header đơn giản cho Public */}
                <div className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-xl font-bold text-gray-800">File Shared from IM GROUP</h1>
                    </div>
                </div>
                <PageContent />
            </div>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">File Details</h2>}
        >
            <Head title={file.file_name} />
            <PageContent />
        </AuthenticatedLayout>
    );
}
