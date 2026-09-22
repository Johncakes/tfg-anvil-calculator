import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { MATERIAL_SUGGESTIONS, materialTextureUrl, normalizeMaterial } from '../domain/materials';
import './ItemPicker/ItemPicker.css';

interface MaterialPickerProps {
  value: string;
  disabled: boolean;
  onChange: (material: string) => void;
}

export default function MaterialPicker({ value, disabled, onChange }: MaterialPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const tokens = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const options = MATERIAL_SUGGESTIONS.filter((name) => tokens.every((token) => name.toLowerCase().includes(token)));
  const custom = normalizeMaterial(search);
  const isCustom = custom && !MATERIAL_SUGGESTIONS.some((name) => name.toLowerCase() === custom.toLowerCase());
  if (isCustom) options.push(custom);
  const expanded = open && !disabled;

  function close() { setOpen(false); setSearch(''); }
  function choose(material: string) { onChange(normalizeMaterial(material)); close(); }

  useEffect(() => {
    if (!expanded) return;
    function outside(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) close();
    }
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [expanded]);

  useEffect(() => {
    if (expanded) document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [expanded, activeIndex, listId]);

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!expanded) { setOpen(true); setActiveIndex(0); return; }
      if (options.length) setActiveIndex((index) => (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length);
    } else if (event.key === 'Enter' && expanded) {
      event.preventDefault();
      if (options[activeIndex]) choose(options[activeIndex]);
    } else if (event.key === 'Escape') {
      event.preventDefault(); close();
    } else if (event.key === 'Tab') close();
  }

  return (
    <div className="item-picker material-picker" ref={containerRef}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}>
      <div className="item-picker-controls">
        <button type="button" className="item-preview-icon" disabled={disabled}
          aria-label={expanded ? 'Close the material list' : 'Browse all materials'}
          aria-expanded={expanded} title={disabled && value ? `This item is always ${value}.` : 'Browse all materials'}
          onClick={() => {
            if (expanded) close();
            else { setSearch(''); setActiveIndex(0); setOpen(true); inputRef.current?.focus(); }
          }}>
          {value ? <img src={materialTextureUrl(value)} alt="" /> : <span className="item-preview-empty" aria-hidden="true" />}
        </button>
        <div className="item-search">
          <input ref={inputRef} type="text" className="item-search-input" role="combobox"
            aria-label="Material" aria-expanded={expanded} aria-controls={listId} aria-autocomplete="list"
            aria-activedescendant={expanded && options[activeIndex] ? `${listId}-${activeIndex}` : undefined}
            autoComplete="off" disabled={disabled} placeholder={value || 'Search materials'}
            value={expanded ? search : value}
            onFocus={() => { setOpen(true); setSearch(''); setActiveIndex(0); }}
            onChange={(event) => {
              setSearch(event.target.value); setActiveIndex(0); setOpen(true); onChange(event.target.value);
            }} onKeyDown={onKeyDown} />
          {!disabled && (value || search) ? <button type="button" className="item-clear"
            aria-label="Clear the material" title="Clear" onMouseDown={(event) => event.preventDefault()}
            onClick={() => { onChange(''); setSearch(''); setActiveIndex(0); setOpen(true); inputRef.current?.focus(); }}>&times;</button> : null}
        </div>
        {expanded ? <div className="item-menu" id={listId} role="listbox" aria-label="Materials">
          {options.map((name, index) => <div key={name} id={`${listId}-${index}`} role="option"
            aria-selected={name.toLowerCase() === value.toLowerCase()}
            className={`item-option ${index === activeIndex ? 'active' : ''} ${name.toLowerCase() === value.toLowerCase() ? 'selected' : ''}`}
            onMouseDown={(event) => event.preventDefault()} onMouseMove={() => setActiveIndex(index)} onClick={() => choose(name)}>
            <img className="item-option-icon" src={materialTextureUrl(name)} alt="" />
            <span className="item-option-label">{isCustom && name === custom ? `Use “${name}”` : name}</span>
          </div>)}
        </div> : null}
      </div>
    </div>
  );
}
