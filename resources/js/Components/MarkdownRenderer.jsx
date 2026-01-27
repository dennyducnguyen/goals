import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

export default function MarkdownRenderer({ content, className = '' }) {
    if (!content) return null;

    return (
        <div className={`prose dark:prose-invert max-w-none ${className} 
            prose-headings:mb-2 prose-headings:font-bold 
            prose-p:mb-2 prose-p:leading-relaxed 
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-ul:list-disc prose-ul:pl-5 prose-ul:my-2
            prose-ol:list-decimal prose-ol:pl-5 prose-ol:my-2
            prose-li:my-0.5
            [&>img]:rounded-lg [&>img]:max-w-full [&>img]:h-auto`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                    a: ({ node, ...props }) => <a {...props} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" />
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
