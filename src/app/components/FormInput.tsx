'use client';

import React from 'react';
import { Field, ErrorMessage, useField } from 'formik';
import { TextField } from '@mui/material';

const FormInput = ({ name, label, type }: any) => {
  const [field] = useField(name);

  return (
    <label className="flex flex-col relative">
      <Field {...field} as={TextField} label={label} type={type || 'type'} />
      <span className="text-red-800 absolute top-14 left- text-xs font-bold">
        <ErrorMessage name={name} />
      </span>
    </label>
  );
};

export default FormInput;
