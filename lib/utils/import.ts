export interface ImportResult<T> {
  success: T[];
  errors: Array<{ row: number; error: string; data: any }>;
  total: number;
}

export function parseCSV(csvContent: string): string[][] {
  const lines = csvContent.split("\n");
  const result: string[][] = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    const row: string[] = [];
    let currentField = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          currentField += '"';
          i++; // Skip next quote
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === "," && !insideQuotes) {
        row.push(currentField.trim());
        currentField = "";
      } else {
        currentField += char;
      }
    }

    row.push(currentField.trim());
    result.push(row);
  }

  return result;
}

export function csvToObjects<T extends Record<string, any>>(
  csvContent: string
): { headers: string[]; data: Partial<T>[] } {
  const rows = parseCSV(csvContent);
  if (rows.length === 0) {
    throw new Error("CSV file is empty");
  }

  const headers = rows[0];
  const data: Partial<T>[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length !== headers.length) continue;

    const obj: any = {};
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j].trim();
      let value: any = row[j].trim();

      // Convert empty strings to null
      if (value === "") {
        value = null;
      }
      // Try to parse numbers
      else if (!isNaN(Number(value)) && value !== "") {
        value = Number(value);
      }
      // Try to parse booleans
      else if (value.toLowerCase() === "true") {
        value = true;
      } else if (value.toLowerCase() === "false") {
        value = false;
      }
      // Try to parse dates (ISO format)
      else if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          value = date;
        }
      }

      obj[header] = value;
    }

    data.push(obj);
  }

  return { headers, data };
}

export function validateProductImport(data: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== "string") {
    errors.push("Product name is required");
  }

  if (!data.manufacturer || typeof data.manufacturer !== "string") {
    errors.push("Manufacturer is required");
  }

  if (data.quantity !== undefined && (typeof data.quantity !== "number" || data.quantity < 0)) {
    errors.push("Quantity must be a non-negative number");
  }

  if (data.price !== undefined && (typeof data.price !== "number" || data.price < 0)) {
    errors.push("Price must be a non-negative number");
  }

  if (
    data.lowStockAt !== undefined &&
    data.lowStockAt !== null &&
    (typeof data.lowStockAt !== "number" || data.lowStockAt < 0)
  ) {
    errors.push("Low stock threshold must be a non-negative number");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateSupplierImport(data: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== "string") {
    errors.push("Supplier name is required");
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Invalid email format");
  }

  if (
    data.website &&
    !/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(
      data.website
    )
  ) {
    errors.push("Invalid website URL");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}



