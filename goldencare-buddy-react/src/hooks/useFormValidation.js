import { useState, useCallback } from 'react';

// Form validation hook
export const useFormValidation = (initialState = {}) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation rules
  const validators = {
    required: (value) => {
      if (value === null || value === undefined || value === '') {
        return 'This field is required';
      }
      return null;
    },
    
    minLength: (min) => (value) => {
      if (value && value.length < min) {
        return `Minimum length is ${min} characters`;
      }
      return null;
    },
    
    maxLength: (max) => (value) => {
      if (value && value.length > max) {
        return `Maximum length is ${max} characters`;
      }
      return null;
    },
    
    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
      return null;
    },
    
    phone: (value) => {
      const phoneRegex = /^[0-9]{10}$/;
      if (value && !phoneRegex.test(value)) {
        return 'Please enter a valid 10-digit phone number';
      }
      return null;
    },
    
    patientId: (value) => {
      const idRegex = /^[A-Z0-9]{3,10}$/;
      if (value && !idRegex.test(value)) {
        return 'Patient ID must be 3-10 characters (letters and numbers only)';
      }
      return null;
    },
    
    doctorId: (value) => {
      const idRegex = /^[A-Z0-9]{3,10}$/;
      if (value && !idRegex.test(value)) {
        return 'Doctor ID must be 3-10 characters (letters and numbers only)';
      }
      return null;
    },
    
    password: (value) => {
      if (value && value.length < 6) {
        return 'Password must be at least 6 characters';
      }
      return null;
    },
    
    time: (value) => {
      const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;
      if (value && !timeRegex.test(value)) {
        return 'Please enter time in format: HH:MM AM/PM';
      }
      return null;
    }
  };

  // Validate single field
  const validateField = useCallback((name, value, rules = []) => {
    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        return error;
      }
    }
    return null;
  }, []);

  // Validate all fields
  const validateForm = useCallback((validationRules) => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(fieldName => {
      const value = values[fieldName];
      const rules = validationRules[fieldName];
      const error = validateField(fieldName, value, rules);
      
      if (error) {
        newErrors[fieldName] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validateField]);

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  }, [errors]);

  // Handle manual value setting
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when value is set
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  }, [errors]);

  // Reset form
  const resetForm = useCallback((newValues = {}) => {
    setValues(newValues);
    setErrors({});
    setIsSubmitting(false);
  }, []);

  // Set submitting state
  const setSubmitting = useCallback((submitting) => {
    setIsSubmitting(submitting);
  }, []);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    setFieldValue,
    validateForm,
    validateField,
    resetForm,
    setSubmitting,
    validators
  };
};

// Predefined validation rule sets
export const validationRules = {
  patientLogin: {
    patientId: [validators.required, validators.patientId],
    password: [validators.required, validators.minLength(6)]
  },
  
  doctorLogin: {
    username: [validators.required],
    doctorPassword: [validators.required, validators.minLength(6)]
  },
  
  patientRegister: {
    name: [validators.required, validators.minLength(2)],
    patientId: [validators.required, validators.patientId],
    password: [validators.required, validators.minLength(6)],
    mobile: [validators.required, validators.phone],
    countryCode: [validators.required]
  },
  
  doctorRegister: {
    name: [validators.required, validators.minLength(2)],
    email: [validators.required, validators.email],
    doctorId: [validators.required, validators.doctorId],
    password: [validators.required, validators.minLength(6)],
    specialization: [validators.required],
    licenseNumber: [validators.required],
    yearsOfExperience: [validators.required],
    mobile: [validators.required, validators.phone],
    countryCode: [validators.required]
  },
  
  medication: {
    name: [validators.required, validators.minLength(2)],
    dosage: [validators.required],
    pillCount: [validators.required],
    customTime: [validators.required, validators.time],
    slot: [validators.required],
    prescribedBy: [validators.required]
  }
};