import { useState } from "react";

const usePostForms = () => {
    const [commentFormView, setCommentFormView] = useState(false);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [repostFormView, setRepostFormView] = useState(false);
    const [shareFormview, setShareFormView] = useState(false);

    const toggleCommentForm = (e: React.MouseEvent) => {
        e && e.stopPropagation();
        setCommentFormView(v => !v);
    };

    const toggleEditForm = (e: React.MouseEvent) => {
        e && e.stopPropagation();
        setIsOverlayOpen(v => !v);
    };

    const toggleRepostForm = (e: Event) => {
        e && e.stopPropagation();
        setRepostFormView(v => !v);
    };

    const toggleShareForm = (e: Event) => {
        e && e.stopPropagation();
        setShareFormView(v => !v);
    };

    return {
        commentFormView,
        isOverlayOpen,
        repostFormView,
        shareFormview,
        toggleCommentForm,
        toggleEditForm,
        toggleRepostForm,
        toggleShareForm,
    };
};

export default usePostForms;
