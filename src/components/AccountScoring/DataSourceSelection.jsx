import { Box, Typography, Paper, Grid, Divider, CircularProgress, Alert } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import TableChartIcon from '@mui/icons-material/TableChart';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PropTypes from 'prop-types';
import { colors } from '../../theme/colors';
import { useRef, useState } from 'react';
import { loadAccountData } from '../../utils/dataLoader';

const ConnectOption = ({ icon: Icon, name, description, onClick, isSelected }) => (
  <Paper
    onClick={onClick}
    sx={{
      p: 3,
      cursor: 'pointer',
      backgroundColor: colors.background.paper,
      border: `1px solid ${isSelected ? colors.brand.red : colors.border.drawer}`,
      transition: 'all 0.2s',
      '&:hover': {
        borderColor: colors.brand.red,
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Icon sx={{ fontSize: 32, color: colors.text.secondary }} />
      <Box>
        <Typography variant="subtitle1">{name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

ConnectOption.propTypes = {
  icon: PropTypes.elementType.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool
};

export const DataSourceSelection = ({ selectedSource, onSelect, onFileLoaded }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (file) => {
    if (!file) return;
    
    try {
      setIsLoading(true);
      setError(null);
      onSelect('data_files');
      setUploadedFile(file);
      
      const data = await loadAccountData(file);
      if (data) {
        onFileLoaded(data);
      } else {
        throw new Error('Failed to parse file data');
      }
    } catch (error) {
      console.error('Error loading file:', error);
      setError('Failed to load file. Please ensure it is a valid CSV file with account data.');
      setUploadedFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFileChange(file);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Import Your Account Data
          </Typography>
          <Typography color="text.secondary">
            Upload your data file or connect directly to your data source
          </Typography>
        </Grid>

        {/* Primary Upload Zone */}
        <Grid item xs={12}>
          <Paper
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              p: 6,
              backgroundColor: colors.background.paper,
              border: `2px dashed ${isDragging ? colors.brand.red : colors.border.drawer}`,
              borderRadius: 2,
              transition: 'all 0.2s',
              cursor: 'pointer',
              '&:hover': {
                borderColor: colors.brand.red,
                backgroundColor: `${colors.brand.red}05`
              }
            }}
            onClick={handleBrowseClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".csv,.xlsx,.xls"
              onChange={handleInputChange}
            />
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: 2
            }}>
              {isLoading ? (
                <>
                  <CircularProgress size={48} sx={{ color: colors.brand.red }} />
                  <Typography variant="h6">
                    Loading file...
                  </Typography>
                </>
              ) : uploadedFile ? (
                <>
                  <CheckCircleIcon sx={{ fontSize: 48, color: colors.brand.red }} />
                  <Typography variant="h6" sx={{ color: colors.brand.red }}>
                    {uploadedFile.name}
                  </Typography>
                  <Typography color="text.secondary">
                  File loaded successfully. Click {"\"Next\""} to continue.
                  </Typography>
                </>
              ) : (
                <>
                  <CloudUploadIcon sx={{ fontSize: 48, color: colors.text.secondary }} />
                  <Typography variant="h6">
                    Drop your file here or click to browse
                  </Typography>
                  <Typography color="text.secondary">
                    Supports .csv, .xlsx, and .xls files
                  </Typography>
                </>
              )}

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 2,
                    backgroundColor: 'transparent',
                    color: '#f44336'
                  }}
                >
                  {error}
                </Alert>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Divider */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Or connect directly
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>
        </Grid>

        {/* Alternative Connection Options */}
        <Grid item xs={12} md={6}>
          <ConnectOption
            icon={StorageIcon}
            name="Salesforce"
            description="Connect to your Salesforce account"
            onClick={() => onSelect('salesforce')}
            isSelected={selectedSource === 'salesforce'}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ConnectOption
            icon={TableChartIcon}
            name="Google Sheets"
            description="Import from Google Sheets"
            onClick={() => onSelect('google_sheets')}
            isSelected={selectedSource === 'google_sheets'}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

DataSourceSelection.propTypes = {
  selectedSource: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onFileLoaded: PropTypes.func.isRequired
}; 