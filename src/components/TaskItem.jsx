import { motion } from 'framer-motion';
import ReactDOM from 'react-dom';
import { useEffect, useRef, useState } from 'react';

const TaskItem = ({
  item,
  onOpenPdf,
  onOpenResource,
  onMarkDone,
  onToggleBookmark,
  onToggleRevision,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const cancelBtnRef = useRef(null);
  const continueBtnRef = useRef(null);
  const modalRef = useRef(null);
  const revisionDue = item.reviseAt ? new Date(item.reviseAt).getTime() <= Date.now() : false;

  const handleMarkClick = () => {
    if (item.completed) {
      return;
    }

    if (item.opened) {
      onMarkDone();
      return;
    }

    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    onMarkDone();
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };

  useEffect(() => {
    if (!confirmOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setConfirmOpen(false);
        return;
      }

      if (event.key !== 'Tab' || !modalRef.current) {
        return;
      }

      const focusable = modalRef.current.querySelectorAll('button');
      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const focusTarget = cancelBtnRef.current || continueBtnRef.current;
    focusTarget?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [confirmOpen]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.01 }}
        className={`flex flex-col gap-3 p-3 rounded-lg glass-card glass-hover transition-all duration-200 ${
          item.completed ? 'bg-green-800/30' : ''
        }`}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 w-full">
            <motion.input
              whileTap={{ scale: 0.9 }}
              type="checkbox"
              checked={item.completed}
              disabled
              className="w-5 h-5 text-green-500 bg-gray-800 border-gray-600 rounded"
            />
            <span
              className={`text-sm font-medium transition-all duration-200 ${
                item.completed ? 'line-through text-gray-400' : 'text-white'
              }`}
            >
              {item.name}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {item.bookmarked ? (
              <span className="px-2 py-1 text-xs rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                Bookmarked
              </span>
            ) : null}
            {item.reviseAt ? (
              <span
                className={`px-2 py-1 text-xs rounded-full border ${
                  revisionDue
                    ? 'bg-rose-500/20 text-rose-200 border-rose-400/40'
                    : 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40'
                }`}
              >
                {revisionDue ? 'Revision Due' : 'Revision Planned'}
              </span>
            ) : null}
          </div>
        </div>

        <div className="w-full">
          <p className="text-xs text-gray-300 mb-2 font-semibold">Resources</p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenPdf}
              className="px-2 py-1 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
              disabled={!item.pdf}
              title={item.pdf ? 'Open PDF' : 'PDF not available'}
            >
              Open PDF
            </button>

            <button
              onClick={onOpenResource}
              className="px-2 py-1 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!item.resource}
              title={item.resource ? 'Open resource link' : 'Resource not available'}
            >
              Open Resource
            </button>

            <button
              onClick={handleMarkClick}
              className={`px-2 py-1 rounded-lg font-semibold transition-all duration-200 ${
                item.completed ? 'bg-green-500/80 text-white cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              disabled={item.completed}
              title={item.completed ? 'Already completed' : 'Mark as done'}
            >
              {item.completed ? 'Completed' : 'Mark as Done'}
            </button>

            <button
              onClick={onToggleBookmark}
              className={`px-2 py-1 rounded-lg transition-colors duration-200 ${
                item.bookmarked ? 'bg-amber-500/20 text-amber-200 border border-amber-400/40' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {item.bookmarked ? 'Remove Bookmark' : 'Bookmark'}
            </button>

            <button
              onClick={onToggleRevision}
              className={`px-2 py-1 rounded-lg transition-colors duration-200 ${
                item.reviseAt ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {item.reviseAt ? 'Clear Reminder' : 'Revise Tomorrow'}
            </button>
          </div>
        </div>
      </motion.div>

      {confirmOpen &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`confirm-title-${item.id ?? item.name.replace(/\W+/g, '-')}`}
          >
            <div
              ref={modalRef}
              className="max-w-md w-full bg-slate-900 p-6 rounded-xl glass-card border border-white/20 shadow-2xl transition-all duration-300"
            >
              <h3 id={`confirm-title-${item.id}`} className="text-lg font-bold text-white mb-3">
                Confirm Completion
              </h3>
              <p className="text-sm text-gray-200 mb-5">
                You have not opened the study material. Do you still want to mark it as completed?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  ref={cancelBtnRef}
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-lg border border-white/30 text-white/80 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  ref={continueBtnRef}
                  onClick={handleConfirm}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default TaskItem;
