# Undo/Redo Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Trade Management App                          │
│                     TradeApp.tsx Component                       │
└─────────────────────────────────────────────────────────────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
          ┌──────────┐  ┌──────────┐  ┌──────────┐
          │ Inventory│  │  Sales   │  │ UndoRedo │
          │  State   │  │  State   │  │  Stacks  │
          └──────────┘  └──────────┘  └──────────┘
                │              │              │
                └──────────────┼──────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
        ┌───────────────┐           ┌────────────────┐
        │ Local State   │           │ Database       │
        │ Management    │           │ (MongoDB)      │
        └───────────────┘           └────────────────┘
```

## Data Flow for Recording a Sale

```
┌─────────────┐
│ User Records│
│    Sale     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│ handleRecordSale() {                        │
│   - Validate form inputs                   │
│   - Calculate profit                       │
│   - POST to /api/sales                     │
│ }                                          │
└──────┬──────────────────────────────────────┘
       │
       ▼ (if success)
┌─────────────────────────────────────────────┐
│ Sale Created in Database                   │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│ Update Client State:                        │
│ - Add to sales array                       │
│ - Deduct from inventory                    │
│ - Add profit to total                      │
│ - PUSH to undoStack ✨                     │
│ - CLEAR redoStack ✨                       │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│ ↶ Undo Button Becomes ACTIVE               │
│ ↷ Redo Button Becomes DISABLED             │
└─────────────────────────────────────────────┘
```

## Data Flow for Undo

```
┌────────────────────┐
│ User Clicks Undo   │
│ (↶ button active)  │
└─────────┬──────────┘
          │
          ▼
┌────────────────────────────────────────┐
│ handleUndoSale() {                     │
│   - Pop from undoStack                │
│   - DELETE /api/sales/{saleId}        │
│ }                                      │
└────────┬──────────────────────────────┘
         │
         ▼ (if success)
┌────────────────────────────────────────┐
│ Sale Deleted from Database            │
└────────┬──────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ Update Client State:                   │
│ - Remove from sales array             │
│ - ADD to inventory (restore)          │
│ - SUBTRACT from profit                │
│ - PUSH to redoStack                   │
│ - UPDATE undoStack                    │
└────────┬──────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ ↶ Undo Button Status: Check for more  │
│ ↷ Redo Button Becomes ACTIVE          │
└────────────────────────────────────────┘
```

## Data Flow for Redo

```
┌────────────────────┐
│ User Clicks Redo   │
│ (↷ button active)  │
└─────────┬──────────┘
          │
          ▼
┌────────────────────────────────────────┐
│ handleRedoSale() {                     │
│   - Pop from redoStack                │
│   - POST /api/sales                   │
│ }                                      │
└────────┬──────────────────────────────┘
         │
         ▼ (if success)
┌────────────────────────────────────────┐
│ Sale Recreated in Database            │
└────────┬──────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ Update Client State:                   │
│ - Add back to sales array             │
│ - SUBTRACT from inventory (deduct)    │
│ - ADD to profit                       │
│ - PUSH to undoStack                   │
│ - UPDATE redoStack                    │
└────────┬──────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│ ↶ Undo Button Becomes ACTIVE          │
│ ↷ Redo Button Status: Check for more  │
└────────────────────────────────────────┘
```

## State Management Diagram

```
                     ┌─────────────────┐
                     │  UndoRedoEntry  │
                     ├─────────────────┤
                     │ - saleId        │
                     │ - itemId        │
                     │ - quantity      │
                     │ - profit        │
                     └─────────────────┘
                          ▲      ▲
                          │      │
                  ┌───────┘      └────────┐
                  │                       │
                  ▼                       ▼
          ┌───────────────┐      ┌──────────────┐
          │  undoStack    │      │  redoStack   │
          │     []        │      │     []       │
          ├───────────────┤      ├──────────────┤
          │ Entry[0]      │      │              │
          │ Entry[1]      │      │              │
          │ Entry[2] ◄──  │      │  ◄── Empty   │
          │ newest        │      │ initially    │
          └───────────────┘      └──────────────┘
                  ▲
                  │
              moves here
              when redoing
                  │
                  │
          ┌───────────────┐
          │   Record      │
          │    Sale       │
          └───────────────┘
                  ▲
                  │
              new entry
              added here
```

## Button State Machine

```
                    ┌──────────────┐
                    │   INITIAL    │
                    │ (No sales)   │
                    └───────┬──────┘
                            │
                    Record Sale
                            │
                            ▼
            ┌─────────────────────────────┐
            │  SALES RECORDED             │
            │ undoStack: [1 entry]        │
            │ redoStack: []               │
            │                             │
            │ Undo: ✅ ENABLED (Orange)  │
            │ Redo: ❌ DISABLED (Gray)   │
            └──────────┬──────────────────┘
                       │
                ┌──────┴───────┐
                │              │
          Click Undo       Record Sale
                │              │
                ▼              ▼
      ┌────────────────┐  ┌──────────────────┐
      │ SALE UNDONE    │  │ REDO CLEARED     │
      │ undoStack: []  │  │ undoStack: [2]   │
      │ redoStack:[1]  │  │ redoStack: []    │
      │                │  │                  │
      │ Undo: ❌       │  │ Undo: ✅         │
      │ Redo: ✅       │  │ Redo: ❌         │
      └────────┬───────┘  └──────────────────┘
               │
          Click Redo
               │
               ▼
      ┌────────────────┐
      │ SALE REDONE    │
      │ undoStack: [1] │
      │ redoStack: []  │
      │                │
      │ Undo: ✅       │
      │ Redo: ❌       │
      └────────────────┘
```

## Database Transactions

```
Record Sale Transaction:
┌─────────────────────────────────────┐
│ 1. INSERT into Sales collection     │
│ 2. UPDATE Inventory collection      │
│ 3. On error: ROLLBACK both          │
└─────────────────────────────────────┘

Undo Sale Transaction:
┌─────────────────────────────────────┐
│ 1. DELETE from Sales collection     │
│ 2. Client updates Inventory (local) │
│ 3. If DELETE fails: Show error      │
└─────────────────────────────────────┘

Redo Sale Transaction:
┌─────────────────────────────────────┐
│ 1. INSERT into Sales collection     │
│ 2. Client updates Inventory (local) │
│ 3. If INSERT fails: Show error      │
└─────────────────────────────────────┘
```

## Component Hierarchy

```
TradeApp.tsx (main component)
│
├─ State:
│  ├─ sales
│  ├─ inventory
│  ├─ totalProfit
│  ├─ undoStack ✨
│  └─ redoStack ✨
│
├─ Handlers:
│  ├─ handleRecordSale (updated)
│  ├─ handleUndoSale (new) ✨
│  └─ handleRedoSale (new) ✨
│
├─ render Sales Form
│  └─ Three Buttons:
│     ├─ Record Sale (green)
│     ├─ ↶ Undo (orange) ✨
│     └─ ↷ Redo (blue) ✨
│
└─ render Sales History
   └─ Delete button (existing)
```

## Error Handling Flow

```
User Action
    │
    ▼
Try:
    │
    ├─► API Call
    │    │
    │    ├─ Success → Update State ✅
    │    │
    │    └─ Failure → Catch Block
    │
    └─ Error in State Update
         │
         └─ Catch Block

Catch Block:
    │
    ├─► Extract error message
    │
    ├─► Show Alert to user
    │
    └─► Don't update state (rollback)
```

## Stack Behavior (LIFO - Last In First Out)

```
Initial: 
undoStack = []

After Sale 1:
undoStack = [Sale1]

After Sale 2:
undoStack = [Sale1, Sale2]

After Sale 3:
undoStack = [Sale1, Sale2, Sale3]

Click Undo (removes last):
undoStack = [Sale1, Sale2]
redoStack = [Sale3]

Click Undo (removes last):
undoStack = [Sale1]
redoStack = [Sale3, Sale2]

Click Redo (adds to undo, removes from redo):
undoStack = [Sale1, Sale2]
redoStack = [Sale3]

Record New Sale 4 (clears redo!):
undoStack = [Sale1, Sale2, Sale4]
redoStack = []  ← CLEARED!
```

---

This architecture ensures:
✅ Clean separation of concerns
✅ Proper state management
✅ Database consistency
✅ User-friendly error handling
✅ Intuitive undo/redo behavior
✅ No data loss
