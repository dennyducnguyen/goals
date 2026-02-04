
import { Head } from '@inertiajs/react';
import MarkdownRenderer from '@/Components/MarkdownRenderer';

export default function SharedDocument({ document }) {
    if (!document) return <div className="p-10 text-center">Document not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-6 sm:pt-0">
            <Head title={document.title} />

            <div className="w-full sm:max-w-3xl mt-6 px-6 py-8 bg-white shadow-md overflow-hidden sm:rounded-lg">
                <div className="mb-6 border-b pb-4">
                    <h1 className="text-3xl font-bold text-gray-900">{document.title}</h1>
                    <span className="inline-block mt-2 px-3 py-1 text-sm font-semibold text-gray-700 bg-gray-100 rounded-full">
                        {document.type}
                    </span>
                </div>

                <div className="prose max-w-none text-gray-800">
                    <MarkdownRenderer content={document.content} />
                </div>
            </div>

            <footer className="py-8 text-center text-sm text-gray-500">
                Shared via Goals App
            </footer>
        </div>
    );
}
