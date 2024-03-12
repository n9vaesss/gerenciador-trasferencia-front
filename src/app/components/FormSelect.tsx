import React from 'react';
import { ErrorMessage, Field } from 'formik';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const FormSelect = ({ name, label, options, tamanho }: any) => {
  return (
    <Box sx={{ minWidth: tamanho }} className="flex flex-col relative">
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Field
          name={name}
          as={Select}
          labelId="demo-simple-select-label"
          label={label}
        >
          {options &&
            Array.isArray(options) &&
            options.length > 0 &&
            options.map((option: any) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
        </Field>
      </FormControl>
      <span className="text-red-800 absolute top-14 left- text-xs font-bold">
        <ErrorMessage name={name} />
      </span>
    </Box>
  );
};

export default FormSelect;
