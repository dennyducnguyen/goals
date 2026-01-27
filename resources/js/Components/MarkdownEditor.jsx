import { useRef, useState } from 'react';

export default function MarkdownEditor({ value, onChange, className, placeholder, rows = 3 }) {
    const textareaRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const handlePaste = async (e) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                e.preventDefault();
                const file = items[i].getAsFile();
                await handleUpload(file);
                return;
            }
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleUpload(file);
        }
    };

    const handleUpload = async (file) => {
        if (!file) return;

        setIsUploading(true);
        const loadingPlaceholder = `![Uploading ${file.name}...]`;

        // Insert placeholder at cursor position
        const textarea = textareaRef.current;
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        const currentValue = textarea.value;

        const newValueWithPlaceholder =
            currentValue.substring(0, startPos) +
            loadingPlaceholder +
            currentValue.substring(endPos, currentValue.length);

        onChange({ target: { value: newValueWithPlaceholder } });

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await window.axios.post(route('image.upload'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const url = response.data.url;
            const finalImageMarkdown = `![Image](${url})`;

            // Text value might have changed while uploading, so we replace the placeholder
            const currentVal = textareaRef.current.value;
            const finalValue = currentVal.replace(loadingPlaceholder, finalImageMarkdown);
            onChange({ target: { value: finalValue } });

        } catch (error) {
            console.error('Upload failed:', error);
            const currentVal = textareaRef.current.value;
            // Remove placeholder on error
            const valWithoutPlaceholder = currentVal.replace(loadingPlaceholder, '');
            onChange({ target: { value: valWithoutPlaceholder } });

            let errorMessage = 'Failed to upload image.';
            if (error.response) {
                errorMessage += ` (Status: ${error.response.status} - ${error.response.statusText})`;
                if (error.response.data && error.response.data.message) {
                    errorMessage += `\n${error.response.data.message}`;
                }
            } else if (error.message) {
                errorMessage += ` ${error.message}`;
            }
            alert(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="relative">
            <textarea
                ref={textareaRef}
                value={value}
                onChange={onChange}
                className={`p-3 ${className}`}
                placeholder={placeholder}
                rows={rows}
                onPaste={handlePaste}
            ></textarea>
            <div className={`absolute bottom-2 right-2 flex items-center space-x-2 ${isUploading ? 'opacity-50' : ''}`}>
                <label className="cursor-pointer text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors" title="Upload Image">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                        disabled={isUploading}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                </label>
            </div>
            {isUploading && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm pointer-events-none">
                    Uploading...
                </div>
            )}
        </div>
    );
}
