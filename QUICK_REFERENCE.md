# Quick Reference: Key Improvements

## 🔢 Calculation Fixes

### The `round()` Helper
```typescript
// Use this to avoid floating-point errors
round(0.1 + 0.2, 2) // Returns 0.3 exactly
round(itemQuantity * conversionFactor, 6) // 6 decimals for quantities
```

### Fractional Quantity Example
**Scenario**: You buy 1 bundle of 10 items, then sell 0.5 bundles
- Sold quantity (in bundles): 0.5
- Conversion factor: 10
- Stock deducted: 0.5 ÷ 10 = 0.05... NO!
- Actually: 0.5 × 10 = 5 items (formula: stock = selling ÷ factor)

Wait, let me correct:
- Stock quantity: 1 (in bundles)
- Conversion: 1 bundle = 10 items
- Selling: 0.5 bundles = 0.5 × 10 = 5 items in selling units
- Stock deducted: 0.5 (bundles)

---

## ✅ Validation Checklist

### Before Recording a Sale
- ✓ Item selected?
- ✓ Quantity > 0?
- ✓ Selling price ≥ 0?
- ✓ Stock available?

### Cost & Profit Calculation
```
1. Cost per selling unit = Cost per stock unit ÷ Conversion factor
2. Profit per unit = Selling price - Cost per selling unit
3. Total profit = Profit per unit × Quantity sold
```

---

## 🎯 Common Actions

### Record a Fractional Sale
1. Select item: "Bundle of Rice"
2. Quantity: "0.5" (half bundle)
3. Selling price: "1200" per bundle
4. System calculates:
   - Cost per bundle: 1000 ÷ 1 = 1000
   - Profit per bundle: 1200 - 1000 = 200
   - Total profit: 200 × 0.5 = 100

### Update Selling Price
1. Go to "Manage Prices"
2. Find item
3. Click "Edit"
4. Enter new price
5. Click "Save"

### Delete a Sale
1. Find sale in history
2. Click "Delete"
3. Confirm deletion
4. Profit automatically adjusted

---

## 🐛 Troubleshooting

### Issue: Quantities showing with many decimals (0.499999999)
**Solution**: Already fixed with `round()` helper

### Issue: Stock shows negative
**Cause**: Floating-point error in old system
**Solution**: Fresh start with rounded values

### Issue: Profit doesn't add up
**Check**:
1. Are quantities in different units?
2. Is conversion factor set correctly?
3. Review cost price at time of sale

---

## 📊 Understanding the Data

### Inventory Table Shows
| Column | Meaning |
|--------|---------|
| Item Name | Name of product |
| Stock | Quantity in stock units |
| Cost Price | Cost per stock unit |
| Stock Unit | Unit of measurement (kg, pcs, bundle) |
| Selling Unit | Unit for selling (usually same) |
| Conversion | How many stock units = 1 selling unit |

### Sales Table Shows
| Column | Meaning |
|--------|---------|
| Item | Product sold |
| Qty | Quantity in selling units |
| Unit | Selling unit |
| Price | Selling price per selling unit |
| Cost | Cost per selling unit (at time of sale) |
| Profit | Total profit from this sale |

---

## 💡 Pro Tips

1. **Set default selling prices** on the Prices page
2. **Use conversion factors** for complex units (1 box = 12 units)
3. **Check profit regularly** to ensure business is healthy
4. **Review analytics** to see top-selling items
5. **Backup data regularly** (database maintenance)

---

## 🔗 Important Links

- Dashboard: `/`
- Manage Prices: Button on dashboard
- Analytics: Button on dashboard
- App (no login): `/tradeapp`

---

**Need Help?** Check the IMPROVEMENTS_APPLIED.md file for detailed technical info.
