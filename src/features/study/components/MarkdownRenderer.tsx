import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight mt-10 mb-3">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg md:text-xl font-bold mt-8 mb-2">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="text-base text-black/70 leading-relaxed mb-4">
            {children}
          </p>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-black/20 pl-4 my-4 text-black/50 font-medium italic">
            {children}
          </blockquote>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-1.5 mb-4 text-black/70">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-1.5 mb-4 text-black/70">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-base leading-relaxed">{children}</li>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black font-bold underline underline-offset-2 hover:text-black/60 transition-colors"
          >
            {children}
          </a>
        ),
        hr: () => <hr className="border-t border-black/10 my-8" />,
        strong: ({ children }) => (
          <strong className="font-bold text-black">{children}</strong>
        ),
        code: ({ children, className }) => {
          const isBlock = className?.includes("language-");
          if (isBlock) {
            return (
              <code className="block bg-black/5 border border-black/10 p-4 text-sm font-mono overflow-x-auto my-4">
                {children}
              </code>
            );
          }
          return (
            <code className="bg-black/5 border border-black/10 px-1.5 py-0.5 text-sm font-mono">
              {children}
            </code>
          );
        },
        pre: ({ children }) => <pre className="my-4">{children}</pre>,
        table: ({ children }) => (
          <div className="overflow-x-auto my-6">
            <table className="w-full border-collapse border border-black/10 text-sm">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-black/10 bg-black/5 px-4 py-2 text-left font-bold">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-black/10 px-4 py-2">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
