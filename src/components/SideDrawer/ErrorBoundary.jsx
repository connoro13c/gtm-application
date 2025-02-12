import { Component } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button } from '@mui/material';
import { colors } from '../../theme/colors';

/**
 * Error boundary component for the SideDrawer
 * Catches and handles errors in the navigation drawer
 */
export class SideDrawerErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SideDrawer Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            width: '64px',
            backgroundColor: colors.background.default,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 2,
            gap: 2
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: colors.text.secondary,
              textAlign: 'center',
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)'
            }}
          >
            Navigation Error
          </Typography>
          <Button
            onClick={() => this.setState({ hasError: false })}
            sx={{
              minWidth: 'unset',
              width: '40px',
              height: '40px',
              color: colors.text.primary,
              backgroundColor: colors.background.paper,
              '&:hover': {
                backgroundColor: colors.background.hover
              }
            }}
          >
            ↻
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

SideDrawerErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
}; 