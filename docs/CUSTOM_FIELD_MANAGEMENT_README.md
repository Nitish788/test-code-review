# Custom Fields Management

This document outlines the implementation and flow of the Custom Fields feature in the Task Manager application.

## Overview

Custom Fields allow users to add additional, dynamic fields to tasks beyond the default fields (title, priority, status). The feature supports three types of custom fields:

- Text
- Number
- Checkbox

## Architecture

### Core Components

1. **CustomFieldsManager/**

   - `CustomFieldsManager.container.tsx`: Container component handling business logic
   - `CustomFieldsManager.presentation.tsx`: Presentational component for UI
   - `CustomFieldsManager.module.css`: Styling

2. **Data Structure**

```typescript
interface CustomField {
  id: string;
  name: string;
  type: "text" | "number" | "checkbox";
}
```

How custom fields are stored in Task

```typescript
interface Task {
  // ... other fields
  customFields?: Record<string, string | number | boolean>;
}
```

## Flow and Implementation

### 1. Storage and Persistence

- Custom fields configuration and tasks with custom field data are both persisted in localStorage
- Custom fields are stored under the key "customFields"
- Tasks with custom field data are stored using tasksStorage utility
- Initial loading happens synchronously in TaskTableContainer:

```typescript
// First load custom fields
const [customFields, setCustomFields] = useState<CustomField[]>(() => {
  const savedFields = localStorage.getItem("customFields");
  return savedFields ? JSON.parse(savedFields) : [];
});

// Then load tasks after custom fields are loaded
const [tasks, setTasks] = useState(() => {
  const savedTasks = tasksStorage.getTasks();
  return savedTasks.length > 0 ? savedTasks : initialTasks;
});

// Persistence effects
useEffect(() => {
  tasksStorage.setTasks(tasks);
}, [tasks]);

useEffect(() => {
  localStorage.setItem("customFields", JSON.stringify(customFields));
}, [customFields]);
```

### 2. Adding Custom Fields

1. User clicks "Manage Custom Fields" button
2. CustomFieldsManager modal opens
3. User enters field name and selects type
4. `handleAddCustomField` in TaskTableContainer:
   - Generates unique ID using crypto.randomUUID()
   - Updates all existing tasks with default value based on field type
   - Updates customFields state and persists to localStorage
   - Updates tasks state with new custom field data and persists to localStorage
   - Shows success notification

### 3. Removing Custom Fields

1. User clicks delete icon on existing field
2. `handleRemoveCustomField` in TaskTableContainer:
   - Removes field from customFields array and persists to localStorage
   - Removes field data from all tasks and persists to localStorage
   - Shows removal notification

### 4. Task Integration

1. **Task Form Integration**

   - TaskForm dynamically generates form fields based on customFields
   - Each custom field is rendered according to its type:
     - Text → text input
     - Number → number input
     - Checkbox → checkbox input

2. **Table Display**
   - TaskTablePresentation dynamically adds columns for custom fields
   - Custom rendering based on field type:
     - Checkbox → disabled checkbox
     - Others → text display

### 5. Sorting Implementation

```typescript
if (customField && a.customFields && b.customFields) {
  // Different sorting logic for number, checkbox, and text types
  if (customField.type === "number") {
    return isAsc
      ? Number(aCustom || 0) - Number(bCustom || 0)
      : Number(bCustom || 0) - Number(aCustom || 0);
  }
  // ... other type handling
}
```

## Data Flow Example

1. **Adding a Custom Field**

```typescript
// User adds "Score" field (number type)
const newField = {
  id: "uuid-123",
  name: "Score",
  type: "number",
};
// Tasks are updated and persisted
const updatedTasks = tasks.map((task) => ({
  ...task,
  customFields: {
    ...task.customFields,
    Score: 0, // default value
  },
}));
setTasks(updatedTasks);
tasksStorage.setTasks(updatedTasks);
```

2. **Using Custom Fields in Tasks**

```typescript
// When creating/editing a task
const task = {
  id: 1,
  title: "Example Task",
  priority: "high",
  status: "not_started",
  customFields: {
    Score: 85,
  },
};
```

## Error Handling

- Field name uniqueness is validated
- Type validation for number fields
- Proper cleanup on field removal
- Fallback default values for different field types

## Notifications

The system shows notifications for:

- Custom field creation (green)
- Custom field removal (red)
- Field validation errors (red)

## Limitations

1. Custom field names must be unique
2. Cannot change field type after creation
3. Cannot reorder custom fields
4. No support for required/optional configuration
