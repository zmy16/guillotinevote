import { useEffect, useRef } from 'react';

export function LeaveConfirm({ onConfirm, onCancel }) {
  const dialogRef = useRef(null);

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
    <dialog className="confirm-dialog" ref={dialogRef} aria-labelledby="leave-dialog-title">
      <h2 className="confirm-dialog-title" id="leave-dialog-title">
        Abandon the trial?
      </h2>
      <p className="confirm-dialog-body">
        Leaving now closes the docket. The rounds you already played are kept in Match history as an unfinished trial; the court itself cannot be resumed.
      </p>
      <div className="confirm-dialog-actions">
        <button type="button" className="button button-ghost" onClick={onCancel}>
          Keep playing
        </button>
        <button type="button" className="button button-danger-ghost" onClick={onConfirm}>
          Leave the court
        </button>
      </div>
    </dialog>
  );
}
