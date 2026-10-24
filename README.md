# Alchemist's Cauldron

A browser game about brewing potions. Mix ingredients, bring the cauldron into 3 target ranges and brew as many potions as you can before the time or your lives run out.

I made it for the RS School qualifying stage.

## How the game works

1. Start a game. A random recipe is picked from the recipe pool. It shows a name, 3 target ranges (Temperature, Density, Magic Power) and how many ingredients you may use.
2. Add ingredients from the shelf to the cauldron. The 3 bars show the current totals.
3. Try to get every value into its target range, then press Brew.
4. A successful brew gives score and extra time, and a new recipe appears. A failed brew costs a life.
5. The game ends when time runs out, you lose all lives, or there are no ingredients left.

Ingredients are limited. Each one starts with a random stock from 2 to 15, and every ingredient you add to the cauldron is spent for good, even if the brew fails.

### Difficulty

| Setting                     | Easy  | Medium | Hard  |
| --------------------------- | :---: | :----: | :---: |
| Ingredients on shelf        |   4   |   6    |   8   |
| Max ingredients in cauldron |   4   |   4    |   5   |
| Starting time               | 180 s | 150 s  | 150 s |
| Recipe tolerance            |  ±12  |   ±8   |  ±5   |
| Lives                       |   5   |   3    |   3   |
| Score per brew              |  100  |  200   |  300  |
| Time bonus per brew         | +15 s | +10 s  | +5 s  |

## Levels

The task is split into levels, and each finished level adds to the total score (393 at most).

| Level | What it adds | Total score |
| ----- | ------------ | :---------: |
| Precondition | Repository setup, tooling, folder structure, quality checks | 58 |
| Level 1 | One full playable game with fixed (Medium) rules | 228 |
| Level 2 | Difficulty selection, save and continue | 278 |
| Level 3 | Drag and drop, tooltips, reactions, Pour Out, keyboard shortcuts, visual feedback | 393 |

<!-- TODO: add which levels you actually finished -->

## Tech stack

- TypeScript (no `any`, no frameworks or game libraries)
- CSS for styling, icons and shapes
- <!-- TODO: build tool, e.g. Vite -->

The game works in the latest Google Chrome on screens from 375 px to 1920 px wide.

## Running locally

```bash
git clone https://github.com/<your-username>/alchemists-cauldron.git
cd alchemists-cauldron
npm install
npm run dev
```

Other scripts:

- `npm run build` creates a production build
- `npm run preview` serves the production build locally

## Project structure

```
src/
  data/       ingredients, recipes, difficulty, reactions
  logic/      cauldron totals, recipe picking, stock, brew check, timer
  state/      game state
  storage/    save and leaderboard (localStorage)
  ui/         menu, shelf, cauldron, bars, dialogs
  styles/
```

Game rules live in separate files from the DOM rendering.

## Git workflow

Work is done in story branches (`story-1`, `story-2`, ...), with feature branches for single tasks. Commits are small and follow the RS School git convention.
