import { ANVIL_CATEGORIES, ANVIL_RECIPES, recipeTextureUrl, type AnvilRecipe } from '../../domain/recipes';
import './ItemPicker.css';

interface ItemPickerProps {
  value: string;
  recipe: AnvilRecipe | undefined;
  onChange: (recipeId: string) => void;
}

export default function ItemPicker({ value, recipe, onChange }: ItemPickerProps) {
  return (
    <div className="item-picker">
      <div className="item-picker-controls">
        <span className="item-preview-icon" aria-hidden="true">
          {recipe ? <img src={recipeTextureUrl(recipe.id)} alt="" /> : null}
        </span>
        <select
          aria-label="Item to forge"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Pick an item, or set the rules by hand</option>
          {ANVIL_CATEGORIES.map((category) => (
            <optgroup key={category.id} label={category.label}>
              {ANVIL_RECIPES.filter((entry) => entry.category === category.id).map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {recipe ? (
        <p className="item-picker-note">{recipe.note ?? 'Available in every metal.'}</p>
      ) : null}
    </div>
  );
}
