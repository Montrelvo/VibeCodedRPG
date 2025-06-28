# Save Feature Debug Plan

The save/load feature is currently not functioning correctly. The game does not resume from a saved state, and there is no explicit "Load Game" button.

## Objectives

1. Ensure game state is correctly saved to `localStorage`.
2. Ensure game state is correctly loaded from `localStorage` on application startup.
3. Verify offline progress calculation is accurate.
4. Confirm HUD updates correctly after loading.

## Current Understanding of the Issue

- The `loadGame()` function in `GameScene.js` was removed in a previous `apply_diff` operation.
- The `main.js` file now handles the initial loading and offline progress calculation.
- The `GameScene` no longer calls `this.loadGame()` in its `create()` method.
- The `Player` instance is now global in `main.js` and passed to scenes via `game.config.data.player`.

## Plan of Action

### Step 1: Verify `main.js` handles loading and offline progress correctly

- Re-read `src/main.js` to confirm the current implementation of `loadGame()` and offline progress calculation.
- Add console logs in `main.js` to trace the player's stats before and after loading.

### Step 2: Ensure `GameScene.js` correctly uses the global player instance and updates HUD

- Re-read `src/scenes/GameScene.js` to confirm it's accessing `this.game.config.data.player` and not creating a new `Player` instance.
- Verify `updateHUD()` is called after the player instance is set in `create()`.

### Step 3: Test the save/load functionality

- Run the game.
- Make some progress (e.g., gain gold, XP, level up).
- Click the "Save Game" button.
- Close and reopen the game.
- Check if the game resumes from the saved state and if offline gains are applied.
- Check browser console for any errors or relevant logs.

### Step 4: Address any remaining issues based on testing

- If the game still doesn't load correctly, investigate `localStorage` content directly in browser developer tools.
- If offline progress is incorrect, re-evaluate the calculation logic in `main.js`.
