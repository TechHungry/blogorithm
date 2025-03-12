'use client';

import { useState, useCallback } from 'react';
import EditorButton from './EditorButton';
import LinkInput from './LinkInput';
import ImageInput from './ImageInput';
import {
    Bold, Italic, Underline, Type, Heading1, Heading2, Heading3,
    List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
    Image, Link, Code, Quote, Minus
} from 'lucide-react';

interface ToolbarProps {
    editorRef: React.RefObject<HTMLDivElement | null>;
}

const Toolbar = ({ editorRef }: ToolbarProps) => {
    const [linkModal, setLinkModal] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [activeStyles, setActiveStyles] = useState<Record<string, boolean>>({});

    // Enhanced exec command with selection preservation
    const exec = useCallback((cmd: string, arg: string | null = null) => {
        if (!editorRef.current) return;

        // Focus the editor first
        editorRef.current.focus();

        // Save current selection
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);

        // Execute the command
        document.execCommand(cmd, false, arg || '');

        // Restore selection if needed
        if (selection && range && !selection.rangeCount) {
            selection.addRange(range);
        }

        // Update active styles
        checkActiveStyles();
    }, [editorRef]);

    // Format block with enhanced handling
    const formatBlock = useCallback((block: string) => {
        if (!editorRef.current) return;

        editorRef.current.focus();

        // Special handling for code blocks
        if (block === 'pre') {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const content = range.extractContents();
                const pre = document.createElement('pre');
                pre.className = 'bg-gray-700 p-2 rounded';
                pre.appendChild(content);
                range.insertNode(pre);
                return;
            }
        }

        document.execCommand('formatBlock', false, block);
        checkActiveStyles();
    }, [editorRef]);

    // Check which styles are currently active
    const checkActiveStyles = useCallback(() => {
        if (typeof document === 'undefined') return;

        const styles: Record<string, boolean> = {
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
            justifyLeft: document.queryCommandState('justifyLeft'),
            justifyCenter: document.queryCommandState('justifyCenter'),
            justifyRight: document.queryCommandState('justifyRight'),
            insertUnorderedList: document.queryCommandState('insertUnorderedList'),
            insertOrderedList: document.queryCommandState('insertOrderedList'),
        };

        setActiveStyles(styles);
    }, []);

    // Add selection change event to update active styles
    if (typeof document !== 'undefined' && editorRef.current) {
        document.addEventListener('selectionchange', checkActiveStyles);
    }

    return (
        <>
            <div className="flex flex-wrap gap-1 bg-gray-900 border-b border-gray-700 p-2">
                <EditorButton
                    icon={<Type size={18} />}
                    onClick={() => formatBlock('p')}
                    active={false}
                />
                <EditorButton
                    icon={<Heading1 size={18} />}
                    onClick={() => formatBlock('h1')}
                    active={false}
                />
                <EditorButton
                    icon={<Heading2 size={18} />}
                    onClick={() => formatBlock('h2')}
                    active={false}
                />
                <EditorButton
                    icon={<Heading3 size={18} />}
                    onClick={() => formatBlock('h3')}
                    active={false}
                />

                <EditorButton
                    icon={<Bold size={18} />}
                    onClick={() => exec('bold')}
                    active={activeStyles.bold}
                />
                <EditorButton
                    icon={<Italic size={18} />}
                    onClick={() => exec('italic')}
                    active={activeStyles.italic}
                />
                <EditorButton
                    icon={<Underline size={18} />}
                    onClick={() => exec('underline')}
                    active={activeStyles.underline}
                />

                <EditorButton
                    icon={<List size={18} />}
                    onClick={() => exec('insertUnorderedList')}
                    active={activeStyles.insertUnorderedList}
                />
                <EditorButton
                    icon={<ListOrdered size={18} />}
                    onClick={() => exec('insertOrderedList')}
                    active={activeStyles.insertOrderedList}
                />

                <EditorButton
                    icon={<AlignLeft size={18} />}
                    onClick={() => exec('justifyLeft')}
                    active={activeStyles.justifyLeft}
                />
                <EditorButton
                    icon={<AlignCenter size={18} />}
                    onClick={() => exec('justifyCenter')}
                    active={activeStyles.justifyCenter}
                />
                <EditorButton
                    icon={<AlignRight size={18} />}
                    onClick={() => exec('justifyRight')}
                    active={activeStyles.justifyRight}
                />

                <EditorButton
                    icon={<Quote size={18} />}
                    onClick={() => formatBlock('blockquote')}
                    active={false}
                />
                <EditorButton
                    icon={<Code size={18} />}
                    onClick={() => formatBlock('pre')}
                    active={false}
                />

                <EditorButton
                    icon={<Link size={18} />}
                    onClick={() => setLinkModal(true)}
                    active={false}
                />
                <EditorButton
                    icon={<Image size={18} />}
                    onClick={() => setImageModal(true)}
                    active={false}
                />
                <EditorButton
                    icon={<Minus size={18} />}
                    onClick={() => exec('insertHorizontalRule')}
                    active={false}
                />
            </div>

            {linkModal && <LinkInput exec={exec} onClose={() => setLinkModal(false)} />}
            {imageModal && <ImageInput exec={exec} onClose={() => setImageModal(false)} />}
        </>
    );
};

export default Toolbar;