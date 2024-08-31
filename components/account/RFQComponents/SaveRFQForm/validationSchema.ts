import * as Yup from 'yup';

// Define the validation schema according to formConfig
export const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  userName: Yup.string().required('userName is Required'),
  email: Yup.string().email('Invalid email address').required('Email Address is required'),
  phoneNumber: Yup.string().required('Phone Number is required'), 
  companyName: Yup.string().required('Company Name is required'),
  role: Yup.string().required('Role is required'),
  poNumber: Yup.string().required('PO Number is required'),
  validUntil: Yup.date().required('Do Not Ship Later Than is required'), 
  assignedTo: Yup.string().required('Assigned To is required'),
  notes: Yup.string().nullable(),
  lines: Yup.array().min(1, 'At least one product is required'),
});
