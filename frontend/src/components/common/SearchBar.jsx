import { useState, useEffect, useRef, useCallback } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

// ============================================
// SearchBar - Reusable search input component
// ============================================
// Features: Auto-debounced search (300ms delay), clear button, instant clear
export default function SearchBar({ placeholder = 'Search...', onSearch, debounceMs = 300, sx = {} }) {
  const [value, setValue] = useState('');
  const debounceTimer = useRef(null);
  const onSearchRef = useRef(onSearch);

  // Keep ref updated
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Debounced search effect
  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // If empty, search immediately (instant clear)
    if (value === '') {
      onSearchRef.current('');
      return;
    }

    // Set new timer for debounced search
    debounceTimer.current = setTimeout(() => {
      onSearchRef.current(value);
    }, debounceMs);

    // Cleanup on unmount
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [value, debounceMs]);

  // Update local state
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  // Allow Enter key to trigger immediate search
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      onSearchRef.current(value);
    }
  };
  
  // Clear button handler
  const handleClear = () => {
    setValue('');
    // onSearch('') will be called by useEffect
  };

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
        // Search icon on left
        startAdornment: (
          <InputAdornment position="start">
            <Search sx={{ fontSize: 18, color: '#94a3b8' }} />
          </InputAdornment>
        ),
        // Clear button on right (only when value exists)
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
