# TFG Anvil Calculator

[![Deploy to GitHub Pages](https://github.com/Johncakes/tfg-anvil-calculator/actions/workflows/deploy.yml/badge.svg?branch=master)](https://github.com/Johncakes/tfg-anvil-calculator/actions/workflows/deploy.yml)

A Calculator for the TerraFirmaCraft anvil system

## What's different from the original

This is a fork of [AdrianMiller99's calculator](https://github.com/AdrianMiller99/tfg-anvil-calculator)
(by way of [LambdaTenEleven's fork](https://github.com/LambdaTenEleven/tfg-anvil-calculator)) with
a few changes to make it a faster and more simple process.

- **Anvil conditions are automated.** Instead of selecting the three smithing instructions from
  the anvil GUI every time, pick what you are forging from the item list and instructions and their priorities are filled in for you.
- **Improved readability for steps.** Results come back as a anvil action icons with
  labels, repeated actions collapse into `(x3)` style runs, and the actions a separated with a divider.

## How to use

1. - **Pick the item you are forging.** The item picker fills in all three smithing instructions
     and their priorities automatically. The rules for an item depend only on what the item is,
     never on which metal it is made from, so one entry covers every metal.
   - **Or set the instructions by hand.** Choose up to three instructions to match the ones shown
     in the in-game anvil GUI, and give each one its priority: Last, Second Last, Third Last, Not
     Last, or Any. **Use this for anything the item list does not cover.**
2. Enter the target value shown in the anvil GUI.
3. Click Calculate.

Target values are generated from your world seed and the recipe id, which includes the metal, so
the same item has a different target in every metal.

If the target value is hard to read, enable Zero-aligned mode in Settings. Align the red and green
pointers in the anvil UI, then calculate with the app's assumed target value of `0`.

The result is split into two parts:

- Setup: actions used to reach the value needed before final instructions. Their order does not matter.
- Finally: actions that must be performed in the shown order to complete the item.

## Running locally

```sh
git clone https://github.com/Johncakes/tfg-anvil-calculator.git
cd tfg-anvil-calculator
npm install
npm run dev
```

The dev server runs at `http://127.0.0.1:5174/`.

## License

Code in this project is licensed under the European Union Public Licence (EUPL) 1.2. See [LICENSE](./LICENSE) for details.

This project is a fork of [tfg-anvil-calculator](https://github.com/LambdaTenEleven/tfg-anvil-calculator)
by LambdaTenEleven, which is itself based on/adapted from
[tfg-anvil-calculator](https://github.com/AdrianMiller99/tfg-anvil-calculator) by AdrianMiller99.
Both are licensed under EUPL 1.2.

Item textures in `public/textures/items` come from three places:

- [TerraFirmaCraft](https://github.com/TerraFirmaCraft/TerraFirmaCraft), licensed under EUPL 1.2,
  for the items TerraFirmaGreg leaves as TFC items.
- [GregTech CEu Modern](https://github.com/GregTechCEu/GregTech-Modern) and the
  [TerraFirmaGreg Modpack-Modern](https://github.com/TerraFirmaGreg-Team/Modpack-Modern) `dull`
  material set, for the tool heads and machine parts TerraFirmaGreg re-outputs as GregTech items.
  These are the untinted greyscale source textures; in game they are coloured per metal.
- `door.png` and `pump.png` are original work for this project, because the vanilla Minecraft door
  texture cannot be redistributed and the steel pipe has no item texture.

The Scraping Knife Blade icon is a stand-in, as the TFC Scraping mod publishes no texture source.

Action textures in `public/textures` are derived from PerfectAnvilTFG by Vizzy, licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). PerfectAnvilTFG is itself a derivative of [Anvil GUI](https://www.curseforge.com/minecraft/texture-packs/tfc-anvil-helper) by Simon, used under CC BY 4.0. The textures were extracted, edited and exported as separate PNG files for use in this app.
