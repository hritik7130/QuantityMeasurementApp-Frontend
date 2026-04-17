export type OperationType = 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE' | 'COMPARE' | 'CONVERT';

export type QuantityInput = {
  input1: { value: number; unit: string };
  input2?: { value: number; unit: string } | null;
  meta: {
    measurementType: string;
    operationType: OperationType;
    resultUnit?: string | null;
  };
};

export type QuantityResponse = {
  value: number;
  unit: string;
};

export type QuantityHistory = {
  id: number;
  inputValue1: number;
  unit1: string;
  inputValue2?: number | null;
  unit2?: string | null;
  result: number;
  resultUnit: string;
  operationType: string;
  measurementType: string;
  username: string;
  timestamp: string;
};

