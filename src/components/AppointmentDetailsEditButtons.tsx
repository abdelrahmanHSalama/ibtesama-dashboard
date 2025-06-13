import { buttonStyles } from "../constants/appointmentsConstants";

export const EditButtons = ({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: () => void;
}) => (
  <div className="flex gap-1">
    <button type="button" className={buttonStyles} onClick={onCancel}>
      ❌
    </button>
    <button type="button" className={buttonStyles} onClick={onSave}>
      💾
    </button>
  </div>
);
