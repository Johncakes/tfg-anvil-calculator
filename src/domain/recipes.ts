// Generated from TerraFirmaCraft 1.20.x anvil recipe data plus the TerraFirmaGreg KubeJS
// recipes. Where TFG reuses a TFC recipe id its rules replace TFC's, and most tool heads are
// re-outputted as GregTech parts. Rules depend only on the item kind, never on the metal.
import type { PickableActionId, PriorityValue } from './actions';

const ITEM_TEXTURE_PATH = `${import.meta.env.BASE_URL}textures/items`;

export const ANVIL_CATEGORIES = [
  { id: 'tools', label: 'Tools & Weapons' },
  { id: 'armor', label: 'Armor' },
  { id: 'metalworking', label: 'Metalworking' },
  { id: 'blocks', label: 'Blocks & Misc' },
] as const;

export type AnvilCategoryId = (typeof ANVIL_CATEGORIES)[number]['id'];

export interface AnvilRecipe {
  id: string;
  label: string;
  category: AnvilCategoryId;
  instructions: { action: PickableActionId; priority: Exclude<PriorityValue, ''> }[];
}

export const ANVIL_RECIPES: AnvilRecipe[] = [
  {
    id: 'axe_head',
    label: 'Axe Head',
    category: 'tools',
    instructions: [{ action: 'punch', priority: 'last' }, { action: 'hit', priority: 'second-last' }, { action: 'upset', priority: 'third-last' }],
  },
  {
    id: 'knife_butchery_head',
    label: 'Butchery Knife Head',
    category: 'tools',
    instructions: [{ action: 'punch', priority: 'last' }, { action: 'bend', priority: 'not-last' }, { action: 'bend', priority: 'not-last' }],
  },
  {
    id: 'buzzsaw_blade',
    label: 'Buzzsaw Blade',
    category: 'tools',
    instructions: [{ action: 'bend', priority: 'last' }, { action: 'hit', priority: 'second-last' }, { action: 'draw', priority: 'third-last' }],
  },
  {
    id: 'chisel_head',
    label: 'Chisel Head',
    category: 'tools',
    instructions: [{ action: 'hit', priority: 'last' }, { action: 'hit', priority: 'not-last' }, { action: 'draw', priority: 'not-last' }],
  },
  {
    id: 'file_head',
    label: 'File Head',
    category: 'tools',
    instructions: [{ action: 'upset', priority: 'last' }, { action: 'bend', priority: 'not-last' }, { action: 'punch', priority: 'not-last' }],
  },
  {
    id: 'fish_hook',
    label: 'Fish Hook',
    category: 'tools',
    instructions: [{ action: 'draw', priority: 'not-last' }, { action: 'bend', priority: 'any' }, { action: 'hit', priority: 'any' }],
  },
  {
    id: 'hammer_head',
    label: 'Hammer Head',
    category: 'tools',
    instructions: [{ action: 'punch', priority: 'last' }, { action: 'shrink', priority: 'not-last' }],
  },
  {
    id: 'hoe_head',
    label: 'Hoe Head',
    category: 'tools',
    instructions: [{ action: 'punch', priority: 'last' }, { action: 'hit', priority: 'not-last' }, { action: 'bend', priority: 'not-last' }],
  },
  {
    id: 'javelin_head',
    label: 'Javelin Head',
    category: 'tools',
    instructions: [{ action: 'hit', priority: 'last' }, { action: 'hit', priority: 'second-last' }, { action: 'draw', priority: 'third-last' }],
  },
  {
    id: 'knife_blade',
    label: 'Knife Blade',
    category: 'tools',
    instructions: [{ action: 'punch', priority: 'last' }, { action: 'bend', priority: 'not-last' }, { action: 'draw', priority: 'not-last' }],
  },
  {
    id: 'mace_head',
    label: 'Mace Head',
    category: 'tools',
    instructions: [{ action: 'hit', priority: 'last' }, { action: 'shrink', priority: 'not-last' }, { action: 'bend', priority: 'not-last' }],
  },
  {
    id: 'mining_hammer_head',
    label: 'Mining Hammer Head',
    category: 'tools',
    instructions: [{ action: 'punch', priority: 'last' }, { action: 'shrink', priority: 'not-last' }],
  },
  {
    id: 'pickaxe_head',
    label: 'Pickaxe Head',
    category: 'tools',
    instructions: [{ action: 'punch', priority: 'last' }, { action: 'bend', priority: 'not-last' }, { action: 'draw', priority: 'not-last' }],
  },
  {
    id: 'propick_head',
    label: 'Propick Head',
    category: 'tools',
    instructions: [{ action: 'punch', priority: 'last' }, { action: 'draw', priority: 'not-last' }, { action: 'bend', priority: 'not-last' }],
  },
  {
    id: 'saw_blade',
    label: 'Saw Blade',
    category: 'tools',
    instructions: [{ action: 'hit', priority: 'last' }, { action: 'hit', priority: 'second-last' }],
  },
  {
    id: 'scraping_knife_blade',
    label: 'Scraping Knife Blade',
    category: 'tools',
    instructions: [{ action: 'hit', priority: 'last' }, { action: 'draw', priority: 'not-last' }, { action: 'draw', priority: 'second-last' }],
  },
  {
    id: 'screwdriver_tip',
    label: 'Screwdriver Tip',
    category: 'tools',
    instructions: [{ action: 'draw', priority: 'last' }, { action: 'hit', priority: 'second-last' }, { action: 'hit', priority: 'third-last' }],
  },
  {
    id: 'scythe_blade',
    label: 'Scythe Blade',
    category: 'tools',
    instructions: [{ action: 'punch', priority: 'last' }, { action: 'bend', priority: 'not-last' }, { action: 'draw', priority: 'not-last' }],
  },
  {
    id: 'shovel_head',
    label: 'Shovel Head',
    category: 'tools',
    instructions: [{ action: 'punch', priority: 'last' }, { action: 'hit', priority: 'not-last' }],
  },
  {
    id: 'spade_head',
    label: 'Spade Head',
    category: 'tools',
    instructions: [{ action: 'punch', priority: 'last' }, { action: 'hit', priority: 'not-last' }],
  },
  {
    id: 'sword_blade',
    label: 'Sword Blade',
    category: 'tools',
    instructions: [{ action: 'punch', priority: 'last' }, { action: 'bend', priority: 'not-last' }, { action: 'draw', priority: 'not-last' }],
  },
  {
    id: 'wire_cutter_head',
    label: 'Wire Cutter Head',
    category: 'tools',
    instructions: [{ action: 'draw', priority: 'last' }, { action: 'hit', priority: 'second-last' }, { action: 'hit', priority: 'third-last' }],
  },
  {
    id: 'wrench_tip',
    label: 'Wrench Tip',
    category: 'tools',
    instructions: [{ action: 'draw', priority: 'last' }, { action: 'hit', priority: 'second-last' }, { action: 'hit', priority: 'third-last' }],
  },
  {
    id: 'shield',
    label: 'Shield',
    category: 'armor',
    instructions: [{ action: 'upset', priority: 'last' }, { action: 'bend', priority: 'second-last' }, { action: 'bend', priority: 'third-last' }],
  },
  {
    id: 'unfinished_boots',
    label: 'Unfinished Boots',
    category: 'armor',
    instructions: [{ action: 'bend', priority: 'last' }, { action: 'bend', priority: 'second-last' }, { action: 'shrink', priority: 'third-last' }],
  },
  {
    id: 'unfinished_chestplate',
    label: 'Unfinished Chestplate',
    category: 'armor',
    instructions: [{ action: 'hit', priority: 'last' }, { action: 'hit', priority: 'second-last' }, { action: 'upset', priority: 'third-last' }],
  },
  {
    id: 'unfinished_greaves',
    label: 'Unfinished Greaves',
    category: 'armor',
    instructions: [{ action: 'bend', priority: 'any' }, { action: 'draw', priority: 'any' }, { action: 'hit', priority: 'any' }],
  },
  {
    id: 'unfinished_helmet',
    label: 'Unfinished Helmet',
    category: 'armor',
    instructions: [{ action: 'hit', priority: 'last' }, { action: 'bend', priority: 'second-last' }, { action: 'bend', priority: 'third-last' }],
  },
  {
    id: 'bolt',
    label: 'Bolt',
    category: 'metalworking',
    instructions: [{ action: 'punch', priority: 'last' }, { action: 'draw', priority: 'second-last' }, { action: 'draw', priority: 'third-last' }],
  },
  {
    id: 'high_carbon_steel_ingot',
    label: 'High Carbon Steel Ingot',
    category: 'metalworking',
    instructions: [{ action: 'hit', priority: 'last' }, { action: 'hit', priority: 'second-last' }, { action: 'hit', priority: 'third-last' }],
  },
  {
    id: 'ingot',
    label: 'Ingot (from High Carbon)',
    category: 'metalworking',
    instructions: [{ action: 'hit', priority: 'last' }, { action: 'hit', priority: 'second-last' }, { action: 'hit', priority: 'third-last' }],
  },
  {
    id: 'nugget',
    label: 'Nugget',
    category: 'metalworking',
    instructions: [{ action: 'punch', priority: 'last' }, { action: 'hit', priority: 'second-last' }, { action: 'punch', priority: 'third-last' }],
  },
  {
    id: 'refined_iron_bloom',
    label: 'Refined Iron Bloom',
    category: 'metalworking',
    instructions: [{ action: 'hit', priority: 'last' }, { action: 'hit', priority: 'second-last' }, { action: 'hit', priority: 'third-last' }],
  },
  {
    id: 'ring',
    label: 'Ring',
    category: 'metalworking',
    instructions: [{ action: 'hit', priority: 'last' }, { action: 'hit', priority: 'second-last' }, { action: 'hit', priority: 'third-last' }],
  },
  {
    id: 'rod',
    label: 'Rod',
    category: 'metalworking',
    instructions: [{ action: 'draw', priority: 'last' }],
  },
  {
    id: 'screw',
    label: 'Screw',
    category: 'metalworking',
    instructions: [{ action: 'punch', priority: 'last' }, { action: 'punch', priority: 'second-last' }, { action: 'shrink', priority: 'third-last' }],
  },
  {
    id: 'sheet',
    label: 'Sheet',
    category: 'metalworking',
    instructions: [{ action: 'hit', priority: 'last' }, { action: 'hit', priority: 'second-last' }, { action: 'hit', priority: 'third-last' }],
  },
  {
    id: 'small_gear',
    label: 'Small Gear',
    category: 'metalworking',
    instructions: [{ action: 'hit', priority: 'last' }, { action: 'shrink', priority: 'second-last' }, { action: 'draw', priority: 'third-last' }],
  },
  {
    id: 'small_spring',
    label: 'Small Spring',
    category: 'metalworking',
    instructions: [{ action: 'hit', priority: 'last' }, { action: 'bend', priority: 'second-last' }, { action: 'bend', priority: 'third-last' }],
  },
  {
    id: 'spring',
    label: 'Spring',
    category: 'metalworking',
    instructions: [{ action: 'hit', priority: 'last' }, { action: 'bend', priority: 'second-last' }, { action: 'bend', priority: 'third-last' }],
  },
  {
    id: 'tuyere',
    label: 'Tuyere',
    category: 'metalworking',
    instructions: [{ action: 'bend', priority: 'last' }, { action: 'bend', priority: 'second-last' }],
  },
  {
    id: 'from_bloom',
    label: 'Wrought Iron Ingot (from Bloom)',
    category: 'metalworking',
    instructions: [{ action: 'hit', priority: 'last' }, { action: 'hit', priority: 'second-last' }, { action: 'hit', priority: 'third-last' }],
  },
  {
    id: 'bars',
    label: 'Bars',
    category: 'blocks',
    instructions: [{ action: 'upset', priority: 'last' }, { action: 'punch', priority: 'second-last' }, { action: 'punch', priority: 'third-last' }],
  },
  {
    id: 'bars_double',
    label: 'Bars (from Double Ingot)',
    category: 'blocks',
    instructions: [{ action: 'upset', priority: 'last' }, { action: 'punch', priority: 'second-last' }, { action: 'punch', priority: 'third-last' }],
  },
  {
    id: 'blowpipe',
    label: 'Blowpipe',
    category: 'blocks',
    instructions: [{ action: 'draw', priority: 'last' }, { action: 'draw', priority: 'second-last' }, { action: 'hit', priority: 'third-last' }],
  },
  {
    id: 'mechanisms',
    label: 'Brass Mechanisms',
    category: 'blocks',
    instructions: [{ action: 'punch', priority: 'last' }, { action: 'hit', priority: 'second-last' }, { action: 'punch', priority: 'third-last' }],
  },
  {
    id: 'bucket',
    label: 'Bucket',
    category: 'blocks',
    instructions: [{ action: 'bend', priority: 'last' }, { action: 'bend', priority: 'second-last' }, { action: 'bend', priority: 'third-last' }],
  },
  {
    id: 'chain',
    label: 'Chain',
    category: 'blocks',
    instructions: [{ action: 'hit', priority: 'any' }, { action: 'hit', priority: 'any' }, { action: 'draw', priority: 'last' }],
  },
  {
    id: 'grill',
    label: 'Grill',
    category: 'blocks',
    instructions: [{ action: 'draw', priority: 'any' }, { action: 'punch', priority: 'last' }, { action: 'punch', priority: 'not-last' }],
  },
  {
    id: 'door',
    label: 'Iron Door',
    category: 'blocks',
    instructions: [{ action: 'hit', priority: 'last' }, { action: 'draw', priority: 'not-last' }, { action: 'punch', priority: 'not-last' }],
  },
  {
    id: 'jar_lid',
    label: 'Jar Lid',
    category: 'blocks',
    instructions: [{ action: 'hit', priority: 'last' }, { action: 'hit', priority: 'second-last' }, { action: 'punch', priority: 'third-last' }],
  },
  {
    id: 'lamp',
    label: 'Lamp',
    category: 'blocks',
    instructions: [{ action: 'bend', priority: 'last' }, { action: 'bend', priority: 'second-last' }, { action: 'draw', priority: 'third-last' }],
  },
  {
    id: 'pump',
    label: 'Steel Pipe',
    category: 'blocks',
    instructions: [{ action: 'draw', priority: 'last' }, { action: 'bend', priority: 'not-last' }],
  },
  {
    id: 'trapdoor',
    label: 'Trapdoor',
    category: 'blocks',
    instructions: [{ action: 'bend', priority: 'last' }, { action: 'draw', priority: 'second-last' }, { action: 'draw', priority: 'third-last' }],
  },
];

export function recipeTextureUrl(recipeId: string): string {
  return `${ITEM_TEXTURE_PATH}/${recipeId}.png`;
}

export function findRecipe(recipeId: string): AnvilRecipe | undefined {
  return ANVIL_RECIPES.find((recipe) => recipe.id === recipeId);
}
