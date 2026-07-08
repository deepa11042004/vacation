const fs = require('fs');

let content = fs.readFileSync('frontend/app/admin/clients/new/page.tsx', 'utf-8');
content = content.replace(/\r\n/g, '\n'); // Normalize newlines

// 1. Add Zod import
content = content.replace('import { api } from "@/lib/api";', 'import { api } from "@/lib/api";\nimport { z } from "zod";');

// 2. Change `inp` and `sel` to functions
content = content.replace(
  'const inp = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";\nconst sel = inp;',
  'const inp = (err?: string) => `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${err ? "border-red-500 bg-red-50 text-red-900" : "border-slate-300 bg-white"}`;\nconst sel = inp;'
);

// 3. Update Field component
content = content.replace(
  'function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {\n  return (\n    <div>\n      <label className="block text-xs font-semibold text-slate-600 mb-1.5">\n        {label}{required && <span className="text-red-500 ml-0.5">*</span>}\n      </label>\n      {children}\n    </div>\n  );\n}',
  'function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {\n  return (\n    <div>\n      <label className="block text-xs font-semibold text-slate-600 mb-1.5">\n        {label}{required && <span className="text-red-500 ml-0.5">*</span>}\n      </label>\n      {children}\n      {error && <p className="mt-1 text-[11px] font-semibold text-red-500">{error}</p>}\n    </div>\n  );\n}'
);

// 4. Add Zod Schemas
const schemas = `
const FormSchema = z.object({
  personal: z.object({
    first_name: z.string().min(2, "First name must be at least 2 characters").max(50, "Too long"),
    middle_name: z.string().max(50).optional().or(z.literal("")),
    last_name: z.string().min(1, "Last name is required").max(50, "Too long"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    date_of_birth: z.string().optional().or(z.literal("")),
    spouse_name: z.string().max(100).optional().or(z.literal("")),
    country_code: z.string().min(1, "Country code required"),
    mobile: z.string().min(10, "Mobile must be at least 10 digits").max(15, "Too long"),
    alternate_mobile: z.string().max(15).optional().or(z.literal("")),
    email: z.string().email("Please enter a valid email address"),
    marriage_anniversary: z.string().optional().or(z.literal("")),
  }),
  addr: z.object({
    primary_address: z.string().optional().or(z.literal("")),
    primary_state: z.string().optional().or(z.literal("")),
    primary_pincode: z.string().optional().or(z.literal("")),
    secondary_address: z.string().optional().or(z.literal("")),
    secondary_state: z.string().optional().or(z.literal("")),
    secondary_pincode: z.string().optional().or(z.literal("")),
  }),
  mem: z.object({
    package_name: z.string().min(1, "Package name is required"),
    validity_years: z.coerce.number().min(1, "At least 1 year"),
    nights_per_year: z.coerce.number().min(0, "Cannot be negative").optional(),
    sale_date: z.string().min(1, "Sale date is required"),
    total_price: z.coerce.number().min(0, "Price must be >= 0"),
    discount_amount: z.coerce.number().min(0).optional(),
    down_payment: z.coerce.number().min(0).optional(),
    amc: z.coerce.number().min(0).optional(),
    payment_mode: z.enum(["CASH","CHEQUE","ONLINE","BANK_TRANSFER","CARD"]),
    dsa: z.string().optional().or(z.literal("")),
    reference_by: z.string().optional().or(z.literal("")),
    transaction_ref: z.string().optional().or(z.literal("")),
    bank_name: z.string().optional().or(z.literal("")),
    sales_consultant: z.string().optional().or(z.literal("")),
    take_over_manager: z.string().optional().or(z.literal("")),
    remarks: z.string().optional().or(z.literal("")),
  }),
  offers: z.array(z.object({
    offer_name: z.string().optional().or(z.literal("")),
    valid_until: z.string().optional().or(z.literal(""))
  }))
});
`;

content = content.replace('const today = new Date().toISOString().slice(0, 10);', schemas + '\nconst today = new Date().toISOString().slice(0, 10);');

// 5. Add fieldErrors state
content = content.replace(
  '  const [error,  setError]  = useState("");',
  '  const [error,  setError]  = useState("");\n  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});'
);

// 6. Update handleSubmit validation
content = content.replace(
  /    if \(!personal\.first_name[\s\S]*?setError\("[^"]+"\); return;\n    \}/g,
  ''
);

content = content.replace(
  /    if \(!mem\.package_name[\s\S]*?setError\("[^"]+"\); return;\n    \}/g,
  ''
);

const validationLogic = `    setSaving(true); setError(""); setFieldErrors({});
    try {
      const parsed = FormSchema.safeParse({ personal, addr, mem, offers });
      if (!parsed.success) {
        const errors: Record<string, string> = {};
        parsed.error.errors.forEach(e => {
          if (e.path.length > 0) errors[e.path.join(".")] = e.message;
        });
        setFieldErrors(errors);
        setError("Please fix the validation errors in the form before submitting.");
        setSaving(false);
        return;
      }
`;

content = content.replace('    setSaving(true); setError("");\n    try {', validationLogic);

// 7. Map over <Field> blocks
const fields = content.split('<Field ');
for (let i = 1; i < fields.length; i++) {
  const valMatch = fields[i].match(/value=\{([^.]+)\.([^}]+)\}/);
  if (valMatch) {
    const path = valMatch[1] + "." + valMatch[2];
    fields[i] = 'error={fieldErrors["' + path + '"]} ' + fields[i];
    fields[i] = fields[i].replace(/className=\{inp\}/g, 'className={inp(fieldErrors["' + path + '"])}');
    fields[i] = fields[i].replace(/className=\{sel\}/g, 'className={sel(fieldErrors["' + path + '"])}');
  }
}
content = fields.join('<Field ');

// Offers inputs
content = content.replace(/className=\{inp\} value=\{row\.offer_name\}/g, 'className={inp(fieldErrors["offers." + i + ".offer_name"])} value={row.offer_name}');
content = content.replace(/className=\{inp\} value=\{row\.valid_until\}/g, 'className={inp(fieldErrors["offers." + i + ".valid_until"])} value={row.valid_until}');

fs.writeFileSync('frontend/app/admin/clients/new/page.tsx', content);
console.log("Done");
