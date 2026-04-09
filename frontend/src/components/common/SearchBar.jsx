import { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

export default function SearchBar({ placeholder = 'Search...', onSearch, sx = {} }) {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
    if (e.target.value === '') onSearch('');
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') onSearch(value); };
  const handleClear = () => { setValue(''); onSearch(''); };

  return (
    <TextField
      size="small"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      sx={{
        minWidth: 280,
        '& .MuiOutlinedInput-root': {
          bgcolor: '#fff',
          borderRadius: 2,
          '& fieldset': { borderColor: '#e2e8f0' },
          '&:hover fieldset': { borderColor: '#94a3b8' },
          '&.Mui-focused fieldset': { borderColor: '#002C5F' },
        },
        ...sx,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search sx={{ fontSize: 18, color: '#94a3b8' }} />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleClear} sx={{ p: 0.3 }}>
              <Clear sx={{ fontSize: 16, color: '#94a3b8' }} />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  );
}
