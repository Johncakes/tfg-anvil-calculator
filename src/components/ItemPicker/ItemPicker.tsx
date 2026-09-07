import { type KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from 'react';
import { ANVIL_CATEGORIES, ANVIL_RECIPES, recipeTextureUrl, type AnvilRecipe } from '../../domain/recipes';
import './ItemPicker.css';

interface ItemPickerProps {
  value: string;
  recipe: AnvilRecipe | undefined;
  onChange: (recipeId: string) => void;
}

interface MatchGroup {
  id: string;
  label: string;
  recipes: AnvilRecipe[];
}

/** Every typed word has to appear somewhere in the item's name, so word order
 *  does not matter and the underscored ids are searchable too. */
function matchesTokens(recipe: AnvilRecipe, tokens: string[]): boolean {
  const haystack = `${recipe.label} ${recipe.id.replace(/_/g, ' ')}`.toLowerCase();
  return tokens.every((token) => haystack.includes(token));
}

export default function ItemPicker({ value, recipe, onChange }: ItemPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const groups = useMemo<MatchGroup[]>(() => {
    const tokens = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const found = tokens.length === 0 ? ANVIL_RECIPES : ANVIL_RECIPES.filter((entry) => matchesTokens(entry, tokens));

    // Items whose name starts with what was typed are the likeliest guess, so
    // they lead their category. Array.sort is stable, so the rest keep order.
    const ranked = [...found].sort((a, b) => {
      const first = tokens[0] ?? '';
      const aLeads = a.label.toLowerCase().startsWith(first) ? 0 : 1;
      const bLeads = b.label.toLowerCase().startsWith(first) ? 0 : 1;
      return aLeads - bLeads;
    });

    return ANVIL_CATEGORIES.map((category) => ({
      id: category.id,
      label: category.label,
      recipes: ranked.filter((entry) => entry.category === category.id),
    })).filter((group) => group.recipes.length > 0);
  }, [search]);

  const flat = useMemo(() => groups.flatMap((group) => group.recipes), [groups]);

  // A narrowed list makes the old highlight meaningless, so aim at the top match.
  useEffect(() => {
    setActiveIndex(0);
  }, [search, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Keep the keyboard-highlighted row visible while arrowing through a long list.
  useEffect(() => {
    if (!open) {
      return;
    }
    const active = flat[activeIndex];
    if (active) {
      document.getElementById(`${listId}-${active.id}`)?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, flat, listId, open]);

  function choose(nextRecipe: AnvilRecipe) {
    onChange(nextRecipe.id);
    setOpen(false);
    setSearch('');
  }

  function clearSelection() {
    onChange('');
    setSearch('');
    // Keep the list up: clearing is nearly always the start of picking again.
    setOpen(true);
    inputRef.current?.focus();
  }

  function toggleMenu() {
    setSearch('');
    if (open) {
      setOpen(false);
      return;
    }
    // Focusing fires onFocus, which opens the menu, so only focus on the way in.
    setOpen(true);
    inputRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      if (flat.length === 0) {
        return;
      }
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((current) => (current + step + flat.length) % flat.length);
      return;
    }

    if (event.key === 'Enter' && open) {
      const active = flat[activeIndex];
      if (active) {
        event.preventDefault();
        choose(active);
      }
      return;
    }

    if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpen(false);
      setSearch('');
      return;
    }

    if (event.key === 'Tab') {
      setOpen(false);
    }
  }

  const activeRecipe = flat[activeIndex];

  return (
    <div className="item-picker" ref={containerRef}>
      <div className="item-picker-controls">
        <button
          type="button"
          className="item-preview-icon"
          onClick={toggleMenu}
          aria-label={open ? 'Close the item list' : 'Browse all items'}
          aria-expanded={open}
          title={open ? 'Close the item list' : 'Browse all items'}
        >
          {recipe ? <img src={recipeTextureUrl(recipe.id)} alt="" /> : <span className="item-preview-empty" aria-hidden="true" />}
        </button>

        <div className="item-search">
          <input
            ref={inputRef}
            type="text"
            className="item-search-input"
            role="combobox"
            aria-label="Item to forge"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open && activeRecipe ? `${listId}-${activeRecipe.id}` : undefined}
            autoComplete="off"
            placeholder={recipe ? recipe.label : 'Search items, or set the rules by hand'}
            value={open ? search : recipe?.label ?? ''}
            onChange={(event) => {
              setSearch(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
          />
          {recipe || search ? (
            <button type="button" className="item-clear" onClick={clearSelection} aria-label="Clear the picked item" title="Clear">
              &times;
            </button>
          ) : null}
        </div>

        {open ? (
          <div className="item-menu" id={listId} role="listbox" aria-label="Items">
            {groups.length === 0 ? (
              <p className="item-menu-empty">No items match “{search.trim()}”.</p>
            ) : (
              groups.map((group) => (
                <div className="item-group" key={group.id} role="group" aria-label={group.label}>
                  <div className="item-group-label">{group.label}</div>
                  {group.recipes.map((entry) => {
                    const index = flat.indexOf(entry);
                    const classNames = [
                      'item-option',
                      index === activeIndex ? 'active' : '',
                      entry.id === value ? 'selected' : '',
                    ]
                      .filter(Boolean)
                      .join(' ');

                    return (
                      <div
                        key={entry.id}
                        id={`${listId}-${entry.id}`}
                        role="option"
                        aria-selected={entry.id === value}
                        className={classNames}
                        // Stops the input losing focus before the click lands.
                        onMouseDown={(event) => event.preventDefault()}
                        onMouseMove={() => setActiveIndex(index)}
                        onClick={() => choose(entry)}
                      >
                        <img className="item-option-icon" src={recipeTextureUrl(entry.id)} alt="" />
                        <span className="item-option-label">{entry.label}</span>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
