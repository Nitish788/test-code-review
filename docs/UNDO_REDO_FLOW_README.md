# Understanding the Undo/Redo System

## What is it?

Think of this undo/redo system as your safety net while managing tasks. Made a mistake? No problem! You can undo your last action. Changed your mind about that undo? You can redo it too. The system keeps track of everything you do with your tasks - whether you're creating new ones, updating existing ones, or removing them.

## How does it work?

### The Building Blocks

I've built this system using three main pieces:

- A custom hook called `useHistory` that does all the heavy lifting
- A simple UI component with undo/redo buttons
- Two lists that keep track of your actions (like a timeline of what you've done)

### Types of Actions I Track

1. **When you create a task**

   - I save all the details of your new task
   - Undoing this simply removes the task
   - Redoing brings it back exactly as it was

2. **When you update a task**

   - I save both the new version AND the old version
   - Undoing brings back the old version
   - Redoing applies your changes again

3. **When you delete a task**
   - I only need to remember which task it was (the ID)
   - But we keep a complete backup of the task for undo
   - Undoing brings the whole task back
   - Redoing removes it again

### Cool Features You Should Know About

- It remembers up to 50 of your most recent actions
- Quick keyboard shortcuts (just like your text editor):
  - Undo: Ctrl+Z (or Cmd+Z if you're on a Mac)
  - Redo: Ctrl+Y (or Cmd+Y on Mac)
- You'll see a friendly notification whenever you undo or redo
- Starting a new action clears the redo history (because we're creating a new timeline)

### How Actions Flow Through the System

1. **When you do something new**

   - It add it to your history
   - Clear any potential redo actions (since we're on a new path)
   - Make the change immediately
   - Save everything to your browser's storage

2. **When you hit undo**

   - It look at the last thing you did
   - Reverse it based on what kind of action it was
   - Keep it in our redo list in case you want it back
   - Let you know what we undid

3. **When you hit redo**
   - It grab the most recent undone action
   - Apply it again
   - Move it back to the history
   - Show you what it restored

### Saving Your Work

- Every change is automatically saved to your browser's storage
- Your action history stays available while you're working
- Starting fresh? Your history resets when you reload the page

### The User Experience

I've made it super intuitive:

- Clear undo/redo buttons right in the interface
- Helpful notifications so you know what's happening
- Buttons are disabled when you can't undo/redo anymore
- Hover over the buttons to see keyboard shortcuts
