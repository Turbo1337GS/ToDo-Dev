import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import gfm from 'remark-gfm';
import rehypeMathjax from 'rehype-mathjax';
import rehypeRaw from 'rehype-raw';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { Box } from '@mui/material';
import remarkBreaks from 'remark-breaks';

interface CodeBlockProps {
  text: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ text }) => {
  const [messageCopied, setMessageCopied] = useState(false);

  const renderers = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      text = text.replaceAll("\n", "");
      const handleCopy = () => {
        if (!navigator.clipboard) return;
        navigator.clipboard.writeText(String(children)).then(() => {
          setMessageCopied(true);
          setTimeout(() => {
            setMessageCopied(false);
          }, 2000);
        });
      };

      if (!inline && match) {
        return (
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, right: 0 }}>
              <button
                onClick={handleCopy}
                style={{
                  backgroundColor: '#292929',
                  borderRadius: '5px',
                  padding: '5px',
                  margin: '5px',
                }}
              >
                {messageCopied ? (
                  <IconCheck size={20} />
                ) : (
                  <IconCopy size={20} />
                )}
              </button>
            </div>
            <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="p" {...props}>
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        );
      } else {
        return <code className={className} {...props}>{children}</code>;
      }
    },
    link: ({ node, children, ...props }: any) => {
      return (
        <a
          {...props}
          target="_blank"
          rel="noopener noreferrer"
          href={unescape(props.href)}
        >
          {children}
        </a>
      );
    },
    img: ({ node, ...props }: any) => {
      return (
        <img
          {...props}
          src={unescape(props.src)}
        />
      );
    },
    heading: ({ level, children }: any) => {
      return React.createElement(`h${level}`, {}, children);
    },
    list: ({ ordered, children }: any) => {
      if (ordered) {
        return <ol>{children}</ol>;
      } else {
        return <ul>{children}</ul>;
      }
    },
    listItem: ({ children }: any) => {
      return <li>{children}</li>;
    },
  };


  return (
    <div className='font-CodeBlockProps' style={{ maxWidth: '90%', width: 'auto', maxHeight: 'auto' }}>
      <Box>
        <ReactMarkdown
          components={renderers}
          remarkPlugins={[gfm, remarkBreaks, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeMathjax, rehypeKatex]}
        >
          {text}
        </ReactMarkdown>
      </Box>
    </div>
  );
}

export default CodeBlock