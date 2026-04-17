import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { QuantityService } from './quantity.service';
import { SnackService } from '../../shared/ui/snack.service';
import { MEASUREMENT_TYPES, UNITS_BY_TYPE, MeasurementType } from './units.catalog';
import { OperationType, QuantityResponse } from './quantity-api.types';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './calculator.page.html',
  styleUrl: './calculator.page.scss'
})
export class CalculatorPage {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(QuantityService);
  private readonly snack = inject(SnackService);

  readonly measurementTypes = MEASUREMENT_TYPES;
  readonly operationTypes: { id: OperationType; label: string }[] = [
    { id: 'ADD', label: 'Add' },
    { id: 'SUBTRACT', label: 'Subtract' },
    { id: 'MULTIPLY', label: 'Multiply' },
    { id: 'DIVIDE', label: 'Divide' },
    { id: 'COMPARE', label: 'Compare' },
    { id: 'CONVERT', label: 'Convert' }
  ];

  readonly operationEmoji: Record<OperationType, string> = {
    ADD: '➕',
    SUBTRACT: '➖',
    MULTIPLY: '✖️',
    DIVIDE: '➗',
    COMPARE: '🟰',
    CONVERT: '🔁'
  };

  readonly form = this.fb.nonNullable.group({
    measurementType: this.fb.nonNullable.control<MeasurementType>('LengthUnit', { validators: [Validators.required] }),
    operationType: this.fb.nonNullable.control<OperationType>('ADD', { validators: [Validators.required] }),
    input1Value: this.fb.nonNullable.control<number>(1, { validators: [Validators.required] }),
    input1Unit: this.fb.nonNullable.control<string>('FEET', { validators: [Validators.required] }),
    input2Value: this.fb.control<number | null>(1),
    input2Unit: this.fb.control<string | null>('INCHES'),
    resultUnit: this.fb.control<string | null>(null)
  });

  // Signals that mirror reactive-form values, so computed() updates correctly.
  readonly measurementType = signal<MeasurementType>(this.form.controls.measurementType.value);
  readonly operationType = signal<OperationType>(this.form.controls.operationType.value);

  readonly units = computed(() => UNITS_BY_TYPE[this.measurementType()]);
  readonly needsSecondInput = computed(() => {
    const op = this.operationType();
    return op === 'ADD' || op === 'SUBTRACT' || op === 'MULTIPLY' || op === 'DIVIDE' || op === 'COMPARE';
  });
  readonly showsResultUnit = computed(() => {
    const op = this.operationType();
    return op === 'ADD' || op === 'SUBTRACT' || op === 'CONVERT';
  });
  readonly requiresResultUnit = computed(() => this.operationType() === 'CONVERT');
  readonly isMultiply = computed(() => this.operationType() === 'MULTIPLY');

  readonly result = signal<QuantityResponse | null>(null);
  loading = false;

  ngOnInit() {
    this.form.controls.measurementType.valueChanges.subscribe((type) => {
      this.measurementType.set(type);
    });
    this.form.controls.operationType.valueChanges.subscribe((op) => {
      this.operationType.set(op);
    });

    this.form.controls.measurementType.valueChanges.subscribe((type) => {
      const first = UNITS_BY_TYPE[type][0]?.id ?? '';
      this.form.controls.input1Unit.setValue(first);
      this.form.controls.input2Unit.setValue(UNITS_BY_TYPE[type][1]?.id ?? first);
      this.form.controls.resultUnit.setValue(null);
    });

    this.form.controls.operationType.valueChanges.subscribe((op) => {
      // Match backend requirement: multiply needs same unit.
      if (op === 'MULTIPLY') {
        this.form.controls.input2Unit.setValue(this.form.controls.input1Unit.value);
        this.form.controls.input2Unit.disable({ emitEvent: false });
        this.form.controls.resultUnit.setValue(null);
        this.form.controls.input2Value.enable({ emitEvent: false });
      } else {
        this.form.controls.input2Unit.enable({ emitEvent: false });
        this.form.controls.input2Value.enable({ emitEvent: false });
        if (op === 'DIVIDE' || op === 'COMPARE') this.form.controls.resultUnit.setValue(null);
      }

      if (op === 'CONVERT') {
        // UI hides Input 2 for convert; we also disable it to avoid confusion.
        this.form.controls.input2Value.disable({ emitEvent: false });
        this.form.controls.input2Unit.disable({ emitEvent: false });
      } else if (op !== 'MULTIPLY') {
        // Restore Input 2 unit if it was disabled by convert.
        this.form.controls.input2Unit.enable({ emitEvent: false });
      }
    });

    this.form.controls.input1Unit.valueChanges.subscribe((u) => {
      if (this.form.controls.operationType.value === 'MULTIPLY') {
        this.form.controls.input2Unit.setValue(u, { emitEvent: false });
      }
    });
  }

  async submit() {
    if (this.loading) return;
    this.result.set(null);

    if (this.form.invalid) {
      this.snack.error('Please fill all required fields.');
      return;
    }

    const v = this.form.getRawValue();

    const payload = {
      input1: { value: Number(v.input1Value), unit: String(v.input1Unit) },
      input2: this.needsSecondInput()
        ? { value: Number(v.input2Value ?? 0), unit: String(v.input2Unit ?? '') }
        : null,
      meta: {
        measurementType: v.measurementType,
        operationType: v.operationType,
        resultUnit: this.showsResultUnit() ? v.resultUnit : null
      }
    };

    // Backend requires meta.operationType always; convert requires resultUnit.
    if (this.requiresResultUnit() && (!v.resultUnit || v.resultUnit.trim() === '')) {
      this.snack.error('Result unit is required for Convert.');
      return;
    }

    // Extra safety: backend rejects multiply if units differ.
    if (v.operationType === 'MULTIPLY' && v.input1Unit !== v.input2Unit) {
      this.snack.error('For Multiply, Input 1 unit and Input 2 unit must be the same.');
      return;
    }

    this.loading = true;
    try {
      const res = await firstValueFrom(this.api.perform(payload));
      this.result.set(res);
    } catch (e: any) {
      this.snack.error(e?.error?.message || e?.error || e?.message || 'Operation failed');
    } finally {
      this.loading = false;
    }
  }
}

