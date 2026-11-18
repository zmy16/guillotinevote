import { useEffect, useId, useRef } from 'react';

export function ConfirmDialog({ title, body, cancelLabel, confirmLabel, onConfirm, onCancel }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) {
      return undefined;
    }
    if (!node.open) {
      node.showModal();
    }
    const handleCancel = (event) => {
      event.preventDefault();
      onCancel();
    };
    node.addEventListener('cancel', handleCancel);
    return () => node.removeEventListener('cancel', handleCancel);
  }, [onCancel]);

  return (
    <dialog className="confirm-dialog" ref={dialogRef} aria-labelledby={titleId}>
      <h2 className="confirm-dialog-title" id={titleId}>
        {title}
      </h2>
      <p className="confirm-dialog-body">{body}</p>
      <div className="confirm-dialog-actions">
        <button type="button" className="button button-ghost" onClick={onCancel}>
          {cancelLabel}
        </button>
        <button type="button" className="button button-danger-ghost" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}