// formConfig.ts
export const formConfig:any = {
    fields: {
      firstName: {
        label: 'First Name *',
        placeholder: 'First Name',
        type: 'text',
        required: true,
      },
      lastName: {
        label: 'Last Name *',
        placeholder: 'Last Name',
        type: 'text',
        required: true,
      },
      userName : {
        label: 'User Name *',
        placeholder: 'User Name',
        type: 'text',
        required: true,
      },
      email: {
        label: 'Email Address *',
        placeholder: 'Email Address',
        type: 'email',
        required: true,
      },
      phoneNumber: {
        label: 'Phone Number',
        placeholder: 'Phone Number',
        type: 'tel',
        required: false,
      },
      companyName: {
        label: 'Company Name*',
        placeholder: 'Company Name',
        type: 'text',
        required: true,
      },
      role: {
        label: 'Role',
        placeholder: 'Role',
        type: 'text',
        required: false,
      },

      poNumber: {
        label: 'PO Number',
        placeholder: 'PO Number',
        type: 'text',
        required: false,
      },
      validUntil: {
        label: 'Do Not Ship Later Than',
        type: 'date',
        required: true,
      },
      assignedTo: {
        label: 'Assigned To',
        type: 'select',
        options: [], 
        required: true,
      },
    notes: {
        label: 'Notes',
        placeholder: 'Notes',
        type: 'textarea',
        required: false,
      },
    },

    lines: {
      headers: {
        productId: 'Product ID',
        productName: 'Product Name',
        stockCode: 'Stock Code',
        qty: 'Quantity',
        price: 'Price',
        targetPrice: 'Target Price',
      },
      initialValues: []
    },
  };
  