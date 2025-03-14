// src/components/WYSIWYGEditor/Toolbar.tsx
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
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
    const savedSelectionRef = useRef<{
        range: Range | null,
        start: number | null,
        end: number | null
    }>({
        range: null,
        start: null,
        end: null
    });

    // More robust selection save
    const saveSelection = useCallback(() => {
        if (!editorRef.current) return;

        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0).cloneRange();

            // Also store numeric positions to handle React re-renders better
            const preSelectionRange = range.cloneRange();
            preSelectionRange.selectNodeContents(editorRef.current);
            preSelectionRange.setEnd(range.startContainer, range.startOffset);
            const start = preSelectionRange.toString().length;

            // Calculate end position
            preSelectionRange.setEnd(range.endContainer, range.endOffset);
            const end = preSelectionRange.toString().length;

            savedSelectionRef.current = {
                range: range,
                start: start,
                end: end
            };
        }
    }, [editorRef]);

    // Helper function to find a node and offset based on position
    const findNodeAndOffsetAtPosition = (rootNode: Node, position: number): { node: Node, offset: number } | null => {
        const treeWalker = document.createTreeWalker(
            rootNode,
            NodeFilter.SHOW_TEXT,
            { acceptNode: (node) => NodeFilter.FILTER_ACCEPT }
        );

        let currentPosition = 0;
        let currentNode = treeWalker.nextNode();

        while (currentNode) {
            const nodeLength = currentNode.textContent?.length || 0;

            if (currentPosition + nodeLength >= position) {
                return {
                    node: currentNode,
                    offset: position - currentPosition
                };
            }

            currentPosition += nodeLength;
            currentNode = treeWalker.nextNode();
        }

        // If we couldn't find the position, return the last position
        if (currentPosition > 0) {
            const lastNode = rootNode.lastChild;
            if (lastNode) {
                return {
                    node: lastNode,
                    offset: (lastNode.textContent?.length || 0)
                };
            }
        }

        return null;
    };

    // More robust selection restore
    const restoreSelection = useCallback(() => {
        if (!editorRef.current) return;

        const selection = window.getSelection();
        if (!selection) return;

        // First try to restore by range if available
        if (savedSelectionRef.current.range) {
            try {
                selection.removeAllRanges();
                selection.addRange(savedSelectionRef.current.range);
                return;
            } catch (e) {
                // If range restoration fails, fall back to position-based approach
                console.log("Range restoration failed, using position fallback");
            }
        }

        // Fall back to position-based approach
        if (savedSelectionRef.current.start !== null && savedSelectionRef.current.end !== null) {
            const charIndex = findNodeAndOffsetAtPosition(editorRef.current, savedSelectionRef.current.start);
            const endCharIndex = findNodeAndOffsetAtPosition(editorRef.current, savedSelectionRef.current.end);

            if (charIndex && endCharIndex) {
                const range = document.createRange();
                range.setStart(charIndex.node, charIndex.offset);
                range.setEnd(endCharIndex.node, endCharIndex.offset);

                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }, [editorRef]);

    // Enhanced exec command with selection preservation
    const exec = useCallback((cmd: string, arg: string | null = null) => {
        if (!editorRef.current) return;

        // Focus the editor first
        editorRef.current.focus();

        // Save current selection
        saveSelection();

        // Execute the command
        document.execCommand(cmd, false, arg || '');

        // Restore selection with a slight delay to ensure DOM updates complete
        requestAnimationFrame(() => {
            restoreSelection();
            // Check styles after the command is executed
            checkActiveStyles();
        });
    }, [editorRef, saveSelection, restoreSelection]);

    // Format block with enhanced handling
    const formatBlock = useCallback((block: string) => {
        if (!editorRef.current) return;

        editorRef.current.focus();

        // Save selection
        saveSelection();

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

        // Restore selection with a slight delay to ensure DOM updates complete
        requestAnimationFrame(() => {
            restoreSelection();
            checkActiveStyles();
        });
    }, [editorRef, saveSelection, restoreSelection]);

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

    // Setup selection change event
    useEffect(() => {
        const onSelectionChange = () => {
            if (editorRef.current && document.activeElement === editorRef.current) {
                checkActiveStyles();
                saveSelection();
            }
        };

        document.addEventListener('selectionchange', onSelectionChange);
        return () => {
            document.removeEventListener('selectionchange', onSelectionChange);
        };
    }, [checkActiveStyles, saveSelection, editorRef]);

    // Handle link button click
    const handleLinkClick = () => {
        saveSelection();
        setLinkModal(true);
    };

    // Handle image button click
    const handleImageClick = () => {
        saveSelection();
        setImageModal(true);
    };

    // Handle modal close
    const handleModalClose = () => {
        setLinkModal(false);
        setImageModal(false);
        // Use requestAnimationFrame for more reliable timing
        requestAnimationFrame(() => {
            restoreSelection();
        });
    };

    // Execute command with selection restoration
    const execWithSelectionRestore = (cmd: string, arg: string) => {
        restoreSelection();
        exec(cmd, arg);
    };

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
                    onClick={handleLinkClick}
                    active={false}
                />
                <EditorButton
                    icon={<Image size={18} />}
                    onClick={handleImageClick}
                    active={false}
                />
                <EditorButton
                    icon={<Minus size={18} />}
                    onClick={() => exec('insertHorizontalRule')}
                    active={false}
                />
            </div>

            {linkModal && <LinkInput exec={execWithSelectionRestore} onClose={handleModalClose} />}
            {imageModal && <ImageInput exec={execWithSelectionRestore} onClose={handleModalClose} />}
        </>
    );
};

export default Toolbar;