import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownRenderer({ content, className = '' }) {
    if (!content) return null;

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className={`prose dark:prose-invert max-w-none ${className} [&>p]:mb-1 [&>p:last-child]:mb-0 [&>img]:rounded-lg [&>img]:max-w-full [&>img]:h-auto`}
            components={{
                a: ({ node, ...props }) => <a {...props} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" />
            }}
        >
            {content}
        </ReactMarkdown>
    );
}
