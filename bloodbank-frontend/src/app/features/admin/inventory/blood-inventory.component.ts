import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BloodInventoryService } from '../../../core/services/blood-inventory.service';
import { BloodInventory, BLOOD_GROUPS } from '../../../models/blood-inventory.model';

@Component({
  selector: 'app-blood-inventory',
  templateUrl: './blood-inventory.component.html',
  styleUrls: ['./blood-inventory.component.scss'],
})
export class BloodInventoryComponent implements OnInit {
  inventory: BloodInventory[] = [];
  loading = true;
  selectedInventory: BloodInventory | null = null;
  form: FormGroup;
  bloodGroups = BLOOD_GROUPS;

  constructor(
    private inventoryService: BloodInventoryService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      bloodGroup: ['', Validators.required],
      units: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() { this.loadInventory(); }

  loadInventory() {
    this.inventoryService.getAll().subscribe({
      next: data => { this.inventory = data; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  editInventory(item: BloodInventory) {
    this.selectedInventory = item;
    this.form.patchValue({ bloodGroup: item.bloodGroup, units: item.units });
  }

  updateInventory() {
    if (this.form.invalid) return;
    const { bloodGroup, units } = this.form.value;
    this.inventoryService.update(bloodGroup, units).subscribe({
      next: () => {
        this.snackBar.open('Inventory updated successfully', 'Close', { duration: 2000, panelClass: 'snack-success' });
        this.selectedInventory = null;
        this.form.reset({ units: 0 });
        this.loadInventory();
      },
      error: () => this.snackBar.open('Update failed', 'Close', { duration: 2000, panelClass: 'snack-error' }),
    });
  }

  getStockLevel(units: number): string {
    if (units === 0) return 'EMPTY';
    if (units <= 10) return 'LOW';
    if (units <= 30) return 'MEDIUM';
    return 'GOOD';
  }
}
