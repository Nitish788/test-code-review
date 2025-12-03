# Kanban Board Implementation

## Overview

Our Kanban board is a dynamic task management interface that allows users to organize, filter, and manage tasks across different priority levels. It supports drag-and-drop functionality, column-specific sorting and filtering, and real-time task updates.

## Core Features

### 1. Priority-Based Columns

- Tasks are organized into five priority columns:
  - URGENT
  - HIGH
  - MEDIUM
  - LOW
  - NONE
- Each column maintains its own independent configuration for sorting and filtering
- Tasks can be dragged between columns to change their priority

### 2. Task Management

- Create new tasks directly in any priority column
- Delete tasks with a single click
- Drag and drop tasks to:
  - Reorder within the same column
  - Move between different priority columns
- Each task displays:
  - Title
  - Status (Not Started, In Progress, Completed)
  - Visual feedback during drag operations

### 3. Column Features

Each column comes with powerful organization tools:

- **Sorting Options**

  - Sort by title (A-Z or Z-A)
  - Sort by status
  - Maintains manual ordering when no sort is selected

- **Filtering Capabilities**
  - Filter by status (multi-select)
  - Search tasks by title (case-insensitive)

## Technical Implementation

### State Management

- Uses React's useState for local state management
- Maintains three key states:
  1. `draggedTask`: Tracks the currently dragged task
  2. `columnConfigs`: Stores sorting and filtering preferences for each column
  3. `columnOrder`: Maintains the manual ordering of tasks within columns

### Task Ordering System

- Implements a hybrid ordering approach:
  - Manual ordering through drag and drop
  - Automatic sorting when sort options are selected
  - Preserves order during filtering operations

### Drag and Drop Implementation

1. **Drag Start**

   - Stores the dragged task in state
   - Sets up the drag event with task ID

2. **During Drag**

   - Provides visual feedback for drag operations
   - Highlights drop zones
   - Shows task movement preview

3. **Drop Handling**
   - Updates task priority if dropped in a different column
   - Maintains or updates task order based on drop position
   - Syncs with the backend through provided callbacks

### Filtering System

- Each column maintains independent filters
- Supports multiple active filters
- Filter operations:
  1. First applies status filters
  2. Then applies search text filters
  3. Finally applies sorting (if enabled)
