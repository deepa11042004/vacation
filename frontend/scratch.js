const { z } = require('zod');

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

const parsed = FormSchema.safeParse({
  personal: {
    first_name: "", middle_name: "", last_name: "",
    gender: "MALE", date_of_birth: "", spouse_name: "",
    mobile: "", alternate_mobile: "", country_code: "+91",
    email: "", marriage_anniversary: "",
  },
  addr: {
    primary_address: "", primary_state: "", primary_pincode: "",
    secondary_address: "", secondary_state: "", secondary_pincode: "",
  },
  mem: {
    package_name: "", validity_years: "1", nights_per_year: "0",
    sale_date: "2026-07-08",
    total_price: "", discount_amount: "0", down_payment: "0", amc: "",
    payment_mode: "CASH",
    sales_consultant: "", take_over_manager: "",
    dsa: "", reference_by: "", remarks: "",
    transaction_ref: "", bank_name: "",
  },
  offers: [
    { offer_name: "", valid_until: "" }
  ]
});

console.log(parsed.success);
if (!parsed.success) {
  console.log(parsed.error.errors);
}
