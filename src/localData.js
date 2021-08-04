const countries = () => {
  return [
    {
      CountryCode: 101,
      CountryName: "Saudi Arabia",
      CountryNameArabic: "العربية السعودية",
    },
    { CountryCode: 102, CountryName: "India", CountryNameArabic: "الهند" },
  ];
};

const cities = () => [
  {
    City_Code: 501,
    Country: { Country_Code: 101, Country_Name: "Saudi Arabia" },
    City_Name_English: "Jeddah",
    City_Name_Arabic: "جدة",
  },
  {
    City_Code: 502,
    Country: { Country_Code: 101, Country_Name: "Saudi Arabia" },
    City_Name_English: "Riyadh",
    City_Name_Arabic: "الرياض",
  },
  {
    City_Code: 503,
    Country: { Country_Code: 101, Country_Name: "Saudi Arabia" },
    City_Name_English: "Damman",
    City_Name_Arabic: "الدمام",
  },
  {
    City_Code: 504,
    Country: { Country_Code: 102, Country_Name: "India" },
    City_Name_English: "Hyderabad",
    City_Name_Arabic: "حيدر أباد",
  },
  {
    City_Code: 505,
    Country: { Country_Code: 102, Country_Name: "India" },
    City_Name_English: "Mumbai",
    City_Name_Arabic: "مومباي",
  },
];

const customers = () => [
  {
    CustomerCode: 1,
    EnglishName: "Osama",
    ArabicName: "أسامة",
    MobileNo: "1234567890",
    Email: "osama.210690@gmail.com",
    Country: { CountryCode: 101, CountryName: "Saudi Arabia" },
    City: { City_Code: 501, City_Name_English: "Jeddah" },
    AddressLine1: "Line 1",
    AddressLine2: "Line 2",
    AddressLine3: "Line 3",
  },
  {
    CustomerCode: 2,
    EnglishName: "Ahmed",
    ArabicName: "أحمد",
    MobileNo: "1234567890",
    Email: "ahmed@gmail.com",
    Country: { CountryCode: 101, CountryName: "Saudi Arabia" },
    City: { City_Code: 502, City_Name_English: "Riyadh" },
    AddressLine1: "Line 1",
    AddressLine2: "Line 2",
    AddressLine3: "Line 3",
  },
  {
    CustomerCode: 3,
    EnglishName: "Hussain",
    ArabicName: "حسين",
    MobileNo: "1234567890",
    Email: "hussain@gmail.com",
    Country: { CountryCode: 102, CountryName: "India" },
    City: { City_Code: 503, City_Name_English: "Hyderabad" },
    AddressLine1: "Line 1",
    AddressLine2: "Line 2",
    AddressLine3: "Line 3",
  },
  {
    CustomerCode: 4,
    EnglishName: "Uzair",
    ArabicName: "عزير",
    MobileNo: "1234567890",
    Email: "uzair@gmail.com",
    Country: { CountryCode: 102, CountryName: "India" },
    City: { City_Code: 504, City_Name_English: "Mumbai" },
    AddressLine1: "Line 1",
    AddressLine2: "Line 2",
    AddressLine3: "Line 3",
  },
];

const items = () => [
  {
    ItemCode: 1001,
    ItemEnglishName: "Table",
    ItemNameArabic: "الطاولة",
    Price: 100,
    VatPercentage: 5,
  },
  {
    ItemCode: 1002,
    ItemEnglishName: "Chair",
    ItemNameArabic: "كرسي",
    Price: 150,
    VatPercentage: 2,
  },
  {
    ItemCode: 1003,
    ItemEnglishName: "Mattress",
    ItemNameArabic: "فراش",
    Price: 500,
    VatPercentage: 3,
  },
  {
    ItemCode: 1004,
    ItemEnglishName: "Lamp",
    ItemNameArabic: "خروف",
    Price: 50,
    VatPercentage: 6,
  },
  {
    ItemCode: 1005,
    ItemEnglishName: "Curtains",
    ItemNameArabic: "ستائر",
    Price: 75,
    VatPercentage: 10,
  },
];

const salesMaster = () => [
  {
    InvoiceNo: 30001,
    InvoiceDate: new Date().toISOString(),
    CustomerCode: 1,
    CustomerName: "Osama",
    Remarks: "Payment in Cash",
    TotalSalesInvAmt: 250,
    TotalVatAmt: 8,
    NetTotal: 258,
  },
  {
    InvoiceNo: 30002,
    InvoiceDate: new Date().toISOString(),
    CustomerCode: 2,
    Remarks: "Payment through Card",
    TotalSalesInvAmt: 550,
    TotalVatAmt: 18,
    NetTotal: 568,
  },
  {
    InvoiceNo: 30003,
    InvoiceDate: new Date().toISOString(),
    CustomerCode: 3,
    Remarks: "Cash On Delivery",
    TotalSalesInvAmt: 75,
    TotalVatAmt: 7.5,
    NetTotal: 82.5,
  },
];

const salesDetails = () => [
  {
    InvoiceNo: 30001,
    ItemCode: 1001,
    ItemName: "Table",
    Price: 100,
    Qty: 1,
    TotalAmount: 105,
    Vat: 5,
  },
  {
    InvoiceNo: 30001,
    ItemCode: 1002,
    ItemName: "Chair",
    Price: 150,
    Qty: 1,
    TotalAmount: 153,
    Vat: 2,
  },
  {
    InvoiceNo: 30002,
    ItemCode: 1003,
    ItemName: "Mattress",
    Price: 500,
    Qty: 1,
    TotalAmount: 515,
    Vat: 3,
  },
  {
    InvoiceNo: 30002,
    ItemCode: 1004,
    ItemName: "Lamp",
    Price: 50,
    Qty: 1,
    TotalAmount: 53,
    Vat: 6,
  },
  {
    InvoiceNo: 30003,
    ItemCode: 1005,
    ItemName: "Curtains",
    Price: 75,
    Qty: 1,
    TotalAmount: 82.5,
    Vat: 10,
  },
];

export default {
  countries,
  cities,
  customers,
  items,
  salesMaster,
  salesDetails,
};
