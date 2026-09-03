import { ACTIONS, textureUrl, type ActionId } from '../../domain/actions';
import './ActionIcon.css';

interface ActionIconProps {
  action: ActionId;
  selected?: boolean;
  description?: string;
  showDescription?: boolean;
  button?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function ActionIcon({
  action,
  selected = false,
  description,
  showDescription = false,
  button = true,
  onClick,
  className = '',
}: ActionIconProps) {
  const label = description ?? ACTIONS[action].label;
  const cellClassName = `action-icon${selected ? ' selected' : ''}${className ? ` ${className}` : ''}`;
  const icon = <img src={textureUrl(action)} alt="" />;

  const cell = button ? (
    <button
      type="button"
      className={cellClassName}
      data-action={action}
      onClick={onClick}
      title={label}
      aria-label={label}
    >
      {icon}
    </button>
  ) : (
    <span className={cellClassName} data-action={action} title={label} aria-label={label} role="img">
      {icon}
    </span>
  );

  if (!showDescription) {
    return cell;
  }

  return (
    <div className="action-choice">
      {cell}
      <span className="action-label">{label}</span>
    </div>
  );
}
