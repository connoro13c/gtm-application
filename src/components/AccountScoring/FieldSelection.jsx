import { Box, Paper, Typography, Chip, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CloseIcon from '@mui/icons-material/Close';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PropTypes from 'prop-types';
import { colors } from '../../theme/colors';
import { useState, useCallback, useEffect } from 'react';
import { analyzeFields } from '../../services/openai';

const FIELD_CATEGORIES = {
  identifier: {
    label: 'Account Identifier',
    description: 'Unique identifier for each account (e.g., Account ID, Name)',
    maxFields: 1
  },
  target: {
    label: 'Target Outcome',
    description: 'The field you want to predict (e.g., Won/Lost, Churn Status)',
    maxFields: 1
  },
  engagement: {
    label: 'Engagement Metrics',
    description: 'Fields that measure customer interaction (e.g., Usage Frequency, Last Login, Activity Score)',
    maxFields: Infinity
  },
  firmographics: {
    label: 'Firmographic Data',
    description: 'Company characteristics (e.g., Industry, Employee Count, Revenue, Location)',
    maxFields: Infinity
  },
  features: {
    label: 'Additional Features',
    description: 'Other attributes that might influence the outcome',
    maxFields: Infinity
  }
};

// Helper function to analyze field patterns and suggest categories
const analyzeField = (field) => {
  const name = field.name.toLowerCase();
  const value = String(field.sampleValues?.[0] || '').toLowerCase();

  // ID field patterns
  if (name.includes('id') || name.includes('key') || name.includes('number')) {
    return {
      category: 'identifier',
      confidence: 0.9,
      reason: 'Field name suggests a unique identifier'
    };
  }

  // Target outcome patterns
  if (name.includes('status') || name.includes('outcome') || 
      name.includes('result') || name.includes('score') ||
      name.includes('won') || name.includes('lost')) {
    return {
      category: 'target',
      confidence: 0.8,
      reason: 'Field appears to represent an outcome or status'
    };
  }

  // Engagement patterns
  const engagementKeywords = [
    'interaction', 'login', 'visit', 'usage', 'activity',
    'frequency', 'last_seen', 'engagement', 'active', 'session',
    'click', 'view', 'open', 'response'
  ];
  if (engagementKeywords.some(keyword => name.includes(keyword)) ||
      name.includes('date') || name.includes('time') ||
      name.match(/(last|next|recent|frequency|count)_\w+/)) {
    return {
      category: 'engagement',
      confidence: 0.85,
      reason: 'Field indicates user interaction or engagement metrics'
    };
  }

  // Firmographic patterns
  const firmographicKeywords = [
    'industry', 'sector', 'employee', 'revenue', 'company',
    'location', 'country', 'region', 'size', 'founded',
    'market', 'segment', 'annual', 'headquarters', 'org'
  ];
  if (firmographicKeywords.some(keyword => name.includes(keyword)) ||
      name.match(/(company|org|business)_\w+/) ||
      (name.includes('type') && !name.includes('data'))) {
    return {
      category: 'firmographics',
      confidence: 0.85,
      reason: 'Field contains company characteristics or firmographic data'
    };
  }

  // Feature patterns - now a fallback for numeric/categorical fields
  if (field.type === 'number' || value.match(/^[0-9,.]+$/) ||
      name.includes('total') || name.includes('amount') ||
      name.includes('ratio') || name.includes('percent')) {
    return {
      category: 'features',
      confidence: 0.7,
      reason: 'Field contains measurable or categorical data'
    };
  }

  return null;
};

// Add this component for AI insights
const AiInsightPanel = ({ recommendations, onAcceptSuggestion, availableFields }) => (
  <Box sx={{ 
    p: 3, 
    borderBottom: `1px solid ${colors.border.drawer}`,
    backgroundColor: `${colors.brand.red}10`,
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
      <AutoFixHighIcon sx={{ color: colors.brand.red }} />
      <Typography variant="h6" sx={{ color: colors.text.primary }}>
        AI Field Analysis
      </Typography>
    </Box>
    
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: 2,
      mb: 3,
      justifyItems: 'center'
    }}>
      {Object.entries(
        recommendations.reduce((acc, rec) => {
          acc[rec.category] = (acc[rec.category] || 0) + 1;
          return acc;
        }, {})
      ).map(([category, count]) => (
        <Box 
          key={category}
          sx={{ 
            p: 2,
            width: '100%',
            maxWidth: '160px',
            borderRadius: 1,
            backgroundColor: colors.background.paper,
            border: `1px solid ${colors.brand.red}40`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              color: colors.text.secondary,
              textTransform: 'capitalize',
              textAlign: 'center'
            }}
          >
            {category.replace(/_/g, ' ')}
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              color: colors.brand.red,
              fontWeight: 500
            }}
          >
            {count}
          </Typography>
        </Box>
      ))}
    </Box>

    <Button
      startIcon={<AutoFixHighIcon />}
      onClick={() => recommendations.forEach(rec => {
        const fieldObj = availableFields.find(f => f.name === rec.field);
        if (fieldObj) {
          onAcceptSuggestion(fieldObj, rec.category);
        }
      })}
      variant="contained"
      size="medium"
      sx={{
        backgroundColor: colors.brand.red,
        padding: '8px 24px',
        '&:hover': {
          backgroundColor: `${colors.brand.red}dd`
        }
      }}
    >
      Accept All AI Suggestions
    </Button>
  </Box>
);

// Modify the field row to show more AI context
const FieldRow = ({ field, aiRecommendation, isSelected, isSelectedForDrag, onFieldClick, onDragStart, onAcceptSuggestion, isResizing, columnWidths }) => (
  <TableRow
    draggable={!isResizing}
    onDragStart={onDragStart}
    onClick={onFieldClick}
    sx={{
      cursor: isResizing ? 'default' : 'grab',
      backgroundColor: isSelectedForDrag ? `${colors.brand.red}20` : 'transparent',
      opacity: isSelected ? 0.5 : 1,
      '&:hover': {
        backgroundColor: isSelected ? 'transparent' : colors.background.hover
      }
    }}
  >
    <TableCell sx={{ padding: '4px', width: '32px' }}>
      <DragIndicatorIcon sx={{ color: colors.text.secondary, fontSize: '20px' }} />
    </TableCell>
    <TableCell sx={{ 
      padding: '4px 8px',
      width: columnWidths.name
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {field.name}
        {aiRecommendation && !isSelected && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={`${(aiRecommendation.confidence * 100).toFixed(0)}% ${aiRecommendation.category}`}
              size="small"
              icon={<AutoFixHighIcon sx={{ fontSize: '14px' }} />}
              onDelete={() => onAcceptSuggestion(aiRecommendation.category, field)}
              deleteIcon={<CheckCircleIcon />}
              sx={{ 
                height: '24px',
                '& .MuiChip-label': { fontSize: '12px', padding: '0 6px' },
                backgroundColor: `${colors.brand.red}${Math.round(aiRecommendation.confidence * 40)}`,
                color: colors.text.primary,
                borderColor: colors.brand.red,
                '& .MuiChip-deleteIcon': {
                  color: colors.text.primary
                }
              }}
            />
          </Box>
        )}
      </Box>
    </TableCell>
    <TableCell sx={{ 
      padding: '4px 8px',
      color: colors.text.secondary,
      width: columnWidths.type
    }}>
      {field.type}
    </TableCell>
    <TableCell sx={{ 
      padding: '4px 8px',
      color: colors.text.secondary,
      width: columnWidths.example
    }}>
      {field.sampleValues?.[0] || '-'}
    </TableCell>
  </TableRow>
);

export const FieldSelection = ({ 
  availableFields, 
  selectedFields,
  onFieldSelect,
  onFieldRemove
}) => {
  const [selectedForDrag, setSelectedForDrag] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);

  // Generate AI recommendations on mount or when fields change
  useEffect(() => {
    const getAIRecommendations = async () => {
      if (availableFields.length === 0) return;
      
      // First use basic pattern matching as fallback
      const basicRecommendations = availableFields
        .map(field => {
          const analysis = analyzeField(field);
          return analysis ? {
            field: field.name,
            ...analysis
          } : null;
        })
        .filter(Boolean);
      
      setAiRecommendations(basicRecommendations);

      // Then try to get AI-powered recommendations
      try {
        const aiAnalysis = await analyzeFields(availableFields);
        if (aiAnalysis) {
          const enhancedRecommendations = JSON.parse(aiAnalysis);
          setAiRecommendations(enhancedRecommendations);
        }
      } catch (error) {
        console.error('Error getting AI recommendations:', error);
        // Keep using basic recommendations if AI fails
      }
    };

    getAIRecommendations();
  }, [availableFields]);

  // Check if a field is selected in any category
  const isFieldSelected = useCallback((fieldName) => {
    return Object.values(selectedFields).some(categoryFields => 
      categoryFields?.some(field => field.name === fieldName)
    );
  }, [selectedFields]);

  // Sort fields into selected and unselected
  const sortedFields = [...availableFields].sort((a, b) => {
    const aSelected = isFieldSelected(a.name);
    const bSelected = isFieldSelected(b.name);
    if (aSelected === bSelected) return 0;
    return aSelected ? 1 : -1;
  });

  const handleFieldClick = (e, field) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setSelectedForDrag(prev => {
        const isAlreadySelected = prev.some(f => f.name === field.name);
        if (isAlreadySelected) {
          return prev.filter(f => f.name !== field.name);
        } else {
          return [...prev, field];
        }
      });
    } else {
      setSelectedForDrag([field]);
    }
  };

  const handleDragStart = (e, field) => {
    const dragFields = selectedForDrag.length > 0 ? selectedForDrag : [field];
    e.dataTransfer.setData('fields', JSON.stringify(dragFields));
  };

  const handleDrop = (e, category) => {
    e.preventDefault();
    try {
      const fields = JSON.parse(e.dataTransfer.getData('fields'));
      fields.forEach(field => {
        if (!isFieldSelected(field.name)) {
          const fieldObj = availableFields.find(f => f.name === field.name);
          if (fieldObj) {
            onFieldSelect(category, fieldObj);
          }
        }
      });
      setSelectedForDrag([]); // Clear selection after drop
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const handleFieldRemove = (category, fieldName) => {
    onFieldRemove(category, fieldName);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Find the index where selected fields start
  const selectedStartIndex = sortedFields.findIndex(field => isFieldSelected(field.name));

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Scrollable Container */}
      <Box sx={{ 
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* AI Field Analysis */}
        <Box sx={{ 
          width: '100%',
          borderBottom: `1px solid ${colors.border.drawer}`,
          backgroundColor: `${colors.brand.red}10`,
          p: 3,
          maxWidth: '100%'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <AutoFixHighIcon sx={{ color: colors.brand.red }} />
            <Typography variant="h6" sx={{ color: colors.text.primary }}>
              AI Field Analysis
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 2,
            mb: 3,
            justifyItems: 'center'
          }}>
            {Object.entries(
              aiRecommendations.reduce((acc, rec) => {
                acc[rec.category] = (acc[rec.category] || 0) + 1;
                return acc;
              }, {})
            ).map(([category, count]) => (
              <Box 
                key={category}
                sx={{ 
                  p: 2,
                  width: '100%',
                  maxWidth: '160px',
                  borderRadius: 1,
                  backgroundColor: colors.background.paper,
                  border: `1px solid ${colors.brand.red}40`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: colors.text.secondary,
                    textTransform: 'capitalize',
                    textAlign: 'center'
                  }}
                >
                  {category.replace(/_/g, ' ')}
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: colors.brand.red,
                    fontWeight: 500
                  }}
                >
                  {count}
                </Typography>
              </Box>
            ))}
          </Box>

          <Button
            startIcon={<AutoFixHighIcon />}
            onClick={() => aiRecommendations.forEach(rec => {
              const fieldObj = availableFields.find(f => f.name === rec.field);
              if (fieldObj) {
                onFieldSelect(rec.category, fieldObj);
              }
            })}
            variant="contained"
            size="medium"
            sx={{
              backgroundColor: colors.brand.red,
              padding: '8px 24px',
              '&:hover': {
                backgroundColor: `${colors.brand.red}dd`
              }
            }}
          >
            Accept All AI Suggestions
          </Button>
        </Box>

        {/* Main Content */}
        <Box sx={{ p: 4, flex: 1 }}>
          {/* Two Column Layout */}
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 3,
            width: '100%'
          }}>
            {/* Field Selection Table */}
            <Paper sx={{ 
              backgroundColor: colors.background.paper,
              border: `1px solid ${colors.border.drawer}`,
              height: '100%',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Table Header - Fixed */}
              <Box sx={{
                borderBottom: `1px solid ${colors.border.drawer}`,
                backgroundColor: colors.background.paper
              }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: 40, p: 1 }}>
                        {/* Empty cell for drag handle */}
                      </TableCell>
                      <TableCell sx={{ width: '35%', p: 1 }}>
                        Field Name
                      </TableCell>
                      <TableCell sx={{ width: '15%', p: 1, textAlign: 'center' }}>
                        Type
                      </TableCell>
                      <TableCell sx={{ width: '25%', p: 1, textAlign: 'center' }}>
                        Example
                      </TableCell>
                      <TableCell sx={{ width: '25%', p: 1, textAlign: 'center' }}>
                        AI Suggested
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </Box>

              {/* Table Body - Scrollable */}
              <Box sx={{ 
                flex: 1,
                overflowY: 'auto'
              }}>
                <Table size="small">
                  <TableBody>
                    {sortedFields.map((field, index) => {
                      const isSelected = isFieldSelected(field.name);
                      const aiRecommendation = aiRecommendations.find(r => r.field === field.name);
                      const isSelectedForDrag = selectedForDrag.some(f => f.name === field.name);
                      const showDivider = index === selectedStartIndex && selectedStartIndex > 0;
                      
                      return (
                        <Box component="tbody" key={field.name}>
                          {showDivider && (
                            <TableRow>
                              <TableCell 
                                colSpan={5}
                                sx={{ 
                                  p: 1,
                                  backgroundColor: colors.background.paper,
                                  borderBottom: `1px solid ${colors.border.drawer}`
                                }}
                              >
                                <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
                                  Selected Fields
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                          <TableRow
                            draggable
                            onDragStart={(e) => handleDragStart(e, field)}
                            onClick={(e) => handleFieldClick(e, field)}
                            sx={{
                              cursor: 'grab',
                              backgroundColor: isSelected 
                                ? `${colors.background.hover}80`
                                : isSelectedForDrag 
                                  ? `${colors.brand.red}20` 
                                  : 'transparent',
                              opacity: isSelected ? 0.7 : 1,
                              '&:hover': {
                                backgroundColor: isSelected 
                                  ? `${colors.background.hover}80`
                                  : colors.background.hover
                              }
                            }}
                          >
                            <TableCell sx={{ width: 40, p: 1 }}>
                              <DragIndicatorIcon sx={{ color: colors.text.secondary, fontSize: 20 }} />
                            </TableCell>
                            <TableCell sx={{ width: '35%', p: 1 }}>
                              {field.name}
                            </TableCell>
                            <TableCell sx={{ width: '15%', p: 1, textAlign: 'center', color: colors.text.secondary }}>
                              {field.type}
                            </TableCell>
                            <TableCell sx={{ width: '25%', p: 1, textAlign: 'center', color: colors.text.secondary }}>
                              {field.sampleValues?.[0] || '-'}
                            </TableCell>
                            <TableCell sx={{ width: '25%', p: 1, textAlign: 'center' }}>
                              {aiRecommendation && !isSelected && (
                                <Chip 
                                  label={`${(aiRecommendation.confidence * 100).toFixed(0)}% ${aiRecommendation.category}`}
                                  size="small"
                                  icon={<AutoFixHighIcon sx={{ fontSize: '14px' }} />}
                                  onDelete={() => onFieldSelect(aiRecommendation.category, field)}
                                  deleteIcon={<CheckCircleIcon />}
                                  sx={{ 
                                    maxWidth: '100%',
                                    height: 24,
                                    '& .MuiChip-label': { 
                                      fontSize: 12,
                                      padding: '0 6px',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis'
                                    },
                                    backgroundColor: `${colors.brand.red}${Math.round(aiRecommendation.confidence * 40)}`,
                                    color: colors.text.primary,
                                    borderColor: colors.brand.red,
                                    '& .MuiChip-deleteIcon': {
                                      color: colors.text.primary
                                    }
                                  }}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        </Box>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </Paper>

            {/* Field Categories */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2,
              height: '100%',
              overflowY: 'visible'
            }}>
              {Object.entries(FIELD_CATEGORIES).map(([category, { label }]) => (
                <Paper
                  key={category}
                  onDrop={(e) => handleDrop(e, category)}
                  onDragOver={handleDragOver}
                  sx={{ 
                    backgroundColor: colors.background.paper,
                    border: `1px solid ${colors.border.drawer}`,
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%'
                  }}
                >
                  {/* Header Section */}
                  <Box sx={{ 
                    p: 2, 
                    borderBottom: selectedFields[category]?.length > 0 ? `1px solid ${colors.border.drawer}` : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: colors.background.paper,
                    flexShrink: 0
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {label}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Drop Zone */}
                  <Box sx={{ 
                    backgroundColor: colors.background.default,
                    p: selectedFields[category]?.length > 0 ? 2 : 3,
                    flex: 1,
                    width: '100%'
                  }}>
                    {(!selectedFields[category] || selectedFields[category].length === 0) ? (
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '44px',
                        border: `2px dashed ${colors.border.drawer}`,
                        borderRadius: 1,
                        p: 2
                      }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: colors.text.secondary,
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          Drop {FIELD_CATEGORIES[category].maxFields === 1 ? 'a field' : 'fields'} here
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        width: '100%',
                        minHeight: '44px'
                      }}>
                        {selectedFields[category]?.map((field) => (
                          <Chip
                            key={field.name}
                            label={field.name}
                            size="small"
                            onDelete={() => handleFieldRemove(category, field.name)}
                            deleteIcon={<CloseIcon sx={{ fontSize: '14px' }} />}
                            sx={{ 
                              height: '28px',
                              backgroundColor: colors.background.paper,
                              color: colors.text.primary,
                              border: `1px solid ${colors.border.drawer}`,
                              transition: 'all 0.2s ease',
                              flexShrink: 0,
                              '& .MuiChip-label': { 
                                fontSize: '13px',
                                lineHeight: 1.2,
                                fontWeight: 500,
                                px: 1,
                                whiteSpace: 'nowrap'
                              },
                              '&:hover': {
                                backgroundColor: `${colors.background.hover}`,
                                borderColor: colors.brand.red,
                                transform: 'translateY(-1px)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                              },
                              '& .MuiChip-deleteIcon': {
                                color: colors.text.secondary,
                                fontSize: '14px',
                                transition: 'color 0.2s ease',
                                '&:hover': {
                                  color: colors.text.primary
                                }
                              }
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

FieldSelection.propTypes = {
  availableFields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    sampleValues: PropTypes.arrayOf(PropTypes.string)
  })).isRequired,
  selectedFields: PropTypes.shape({
    identifier: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    })),
    target: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    })),
    engagement: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    })),
    firmographics: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    })),
    features: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    }))
  }).isRequired,
  onFieldSelect: PropTypes.func.isRequired,
  onFieldRemove: PropTypes.func.isRequired
};

AiInsightPanel.propTypes = {
  recommendations: PropTypes.arrayOf(PropTypes.shape({
    field: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    confidence: PropTypes.number.isRequired,
    reason: PropTypes.string.isRequired
  })).isRequired,
  onAcceptSuggestion: PropTypes.func.isRequired,
  availableFields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    sampleValues: PropTypes.arrayOf(PropTypes.string)
  })).isRequired
};

FieldRow.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    sampleValues: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  aiRecommendation: PropTypes.shape({
    category: PropTypes.string.isRequired,
    confidence: PropTypes.number.isRequired,
    reason: PropTypes.string.isRequired
  }),
  isSelected: PropTypes.bool.isRequired,
  isSelectedForDrag: PropTypes.bool.isRequired,
  onFieldClick: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onAcceptSuggestion: PropTypes.func.isRequired,
  isResizing: PropTypes.bool.isRequired,
  columnWidths: PropTypes.shape({
    name: PropTypes.number.isRequired,
    type: PropTypes.number.isRequired,
    example: PropTypes.number.isRequired
  }).isRequired
}; 