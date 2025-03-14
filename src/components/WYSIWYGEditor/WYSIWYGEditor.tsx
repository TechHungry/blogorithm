// src/components/WYSIWYGEditor/WYSIWYGEditor.tsx
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Toolbar from './Toolbar';
import './EditorStyles.css';

interface WYSIWYGEditorProps {
    initialContent?: string;
    onContentChange?: (content: string) => void;
}

const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({
                                                         initialContent = '',
                                                         onContentChange
                                                     }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState<string>(initialContent);
    const isUpdatingRef = useRef<boolean>(false);
    const lastSelectionRef = useRef<{
        range: Range | null,
        start: number | null,
        end: number | null
    }>({
        range: null,
        start: null,
        end: null
    });

    // Track if this is the initial render
    const initialRenderRef = useRef<boolean>(true);

    // Set initial content only once
    useEffect(() => {
        if (editorRef.current && initialContent && initialRenderRef.current) {
            editorRef.current.innerHTML = initialContent;
            initialRenderRef.current = false;
        }
    }, [initialContent]);

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

            lastSelectionRef.current = {
                range: range,
                start: start,
                end: end
            };
        }
    }, []);

    // More robust selection restore
    const restoreSelection = useCallback(() => {
        if (!editorRef.current) return;

        const selection = window.getSelection();
        if (!selection) return;

        // First try to restore by range if available
        if (lastSelectionRef.current.range) {
            try {
                selection.removeAllRanges();
                selection.addRange(lastSelectionRef.current.range);
                return;
            } catch (e) {
                // If range restoration fails, fall back to position-based approach
                console.log("Range restoration failed, using position fallback");
            }
        }

        // Fall back to position-based approach
        if (lastSelectionRef.current.start !== null && lastSelectionRef.current.end !== null) {
            const charIndex = findNodeAndOffsetAtPosition(editorRef.current, lastSelectionRef.current.start);
            const endCharIndex = findNodeAndOffsetAtPosition(editorRef.current, lastSelectionRef.current.end);

            if (charIndex && endCharIndex) {
                const range = document.createRange();
                range.setStart(charIndex.node, charIndex.offset);
                range.setEnd(endCharIndex.node, endCharIndex.offset);

                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }, []);

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

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.contentEditable = 'true';
            editorRef.current.spellcheck = true;

            // Add placeholder handling
            const handleFocus = () => {
                if (editorRef.current?.innerHTML === '') {
                    editorRef.current.classList.remove('empty');
                }
                // Don't save selection on focus, wait for user interaction
            };

            const handleBlur = () => {
                if (editorRef.current?.innerHTML === '') {
                    editorRef.current.classList.add('empty');
                }
                // Save selection on blur
                saveSelection();
            };

            // Debounced content change handler to reduce frequency of state updates
            let inputTimeout: NodeJS.Timeout;
            const handleInput = () => {
                if (editorRef.current) {
                    // Save selection immediately before any changes
                    saveSelection();

                    // Clear previous timeout
                    clearTimeout(inputTimeout);

                    // If we're already handling an update, skip to avoid recursion
                    if (isUpdatingRef.current) return;
                    isUpdatingRef.current = true;

                    const isEmpty = editorRef.current.innerHTML === '' ||
                        editorRef.current.innerHTML === '<br>' ||
                        editorRef.current.innerHTML === '<p></p>';

                    if (isEmpty) {
                        editorRef.current.classList.add('empty');
                    } else {
                        editorRef.current.classList.remove('empty');
                    }

                    const newContent = editorRef.current.innerHTML;

                    // Debounce content updates to parent component
                    inputTimeout = setTimeout(() => {
                        // Set local state
                        setContent(newContent);

                        // Only call the callback if content actually changed
                        if (onContentChange && newContent !== content) {
                            onContentChange(newContent);
                        }

                        // Make sure to restore selection after React updates
                        requestAnimationFrame(() => {
                            restoreSelection();
                            isUpdatingRef.current = false;
                        });
                    }, 50); // Small debounce to batch updates
                }
            };

            // Initialize with empty class if no content
            if (editorRef.current.innerHTML === '') {
                editorRef.current.classList.add('empty');
            }

            // Handle click events to track cursor position
            const handleClick = (e: MouseEvent) => {
                // Use setTimeout to ensure this runs after browser finishes processing the click
                setTimeout(() => {
                    saveSelection();
                }, 0);
            };

            // Handle keydown events to track cursor position
            const handleKeyDown = (e: KeyboardEvent) => {
                // Don't save selection on modifier keys alone
                if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Enter') {
                    setTimeout(() => {
                        saveSelection();
                    }, 0);
                }
            };

            editorRef.current.addEventListener('focus', handleFocus);
            editorRef.current.addEventListener('blur', handleBlur);
            editorRef.current.addEventListener('input', handleInput);
            editorRef.current.addEventListener('click', handleClick);
            editorRef.current.addEventListener('keydown', handleKeyDown);

            return () => {
                clearTimeout(inputTimeout);
                editorRef.current?.removeEventListener('focus', handleFocus);
                editorRef.current?.removeEventListener('blur', handleBlur);
                editorRef.current?.removeEventListener('input', handleInput);
                editorRef.current?.removeEventListener('click', handleClick);
                editorRef.current?.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [saveSelection, restoreSelection, onContentChange, content]);

    return (
        <div className="overflow-hidden shadow-xl bg-gray-800 bg-opacity-30 text-white border border-gray-700 flex flex-col h-[calc(100vh-200px)]">
            <Toolbar editorRef={editorRef} />
            <div
                ref={editorRef}
                className="p-4 flex-1 overflow-y-auto outline-none text-gray-100 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-500 empty:before:italic"
                data-placeholder="Start writing something amazing..."
            />
        </div>
    );
};

export default React.memo(WYSIWYGEditor);