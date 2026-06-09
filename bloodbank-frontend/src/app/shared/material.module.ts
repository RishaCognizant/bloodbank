import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

const MATERIAL_MODULES = [
  MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
  MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatToolbarModule,
  MatSidenavModule, MatListModule, MatMenuModule, MatDialogModule, MatSnackBarModule,
  MatChipsModule, MatBadgeModule, MatTooltipModule, MatProgressSpinnerModule,
  MatDatepickerModule, MatNativeDateModule, MatGridListModule, MatDividerModule,
  MatStepperModule, MatButtonToggleModule,
];

@NgModule({ imports: MATERIAL_MODULES, exports: MATERIAL_MODULES })
export class MaterialModule {}
