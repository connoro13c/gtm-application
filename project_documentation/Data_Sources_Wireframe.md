# Data Sources & Mapping Management Wireframe & UX/UI Specification

## 🎯 Purpose

Enable Sales Ops and technical administrators to efficiently manage persistent data connections, add and maintain new data sources, map additional datasets, and ensure seamless data integration and integrity for accurate scoring.

## 📌 Core Components & Layout

### Section 1: Data Sources Overview

**Clearly structured list/table displaying:**
- Data Source Name
- Source Type (Salesforce Report, Google Sheet, CSV Upload)
- Last Refreshed Time & Date
- Connection Status (Active, Syncing, Error)

**Interactive Controls:**
- Button: "Add New Data Source" (initiates workflow for connecting new sources)
- Quick actions per data source:
  - Edit Connection
  - Refresh Data
  - Disable / Enable
  - Delete Connection

### Section 2: New Data Source Connection Workflow

**Guided step-by-step interface:**
- Choose Data Source Type (Salesforce, Google Sheets, CSV)
- Authentication Process (OAuth/API keys)
- Selection & configuration of specific data elements (reports, sheets, columns)
- Real-time validation and feedback on connection status

### Section 3: Data Mapping & Integration Interface

**Split Layout Design:**
- Left side: Table view displaying source data columns as rows
- Right side: Category buckets for organized field mapping

**Table Structure (Source Fields):**
- Four columns: ID, Name, Example, Category
- Selectable rows with ctrl/shift-click for multi-selection
- Keyboard accessibility (Enter/Space keys for selection)
- Visual indication of mapped vs. unmapped fields

**AI-Powered Suggestion System:**
- AI automatically suggests appropriate categories for each field
- "Accept All AI Suggestions" button at the top of the interface
- Individual accept/reject buttons for each suggestion
- Color-coded confidence indicators for AI suggestions

**Category Buckets:**
- Visual containers for each data category:
  - Account Identification (key icon, blue)
  - Firmographic (database icon, green)
  - Engagement (arrow icon, purple)
  - Customer Health (check icon, amber)
  - Product Usage (layers icon, indigo)
  - Marketing (sparkles icon, pink)
  - Other (tag icon, gray)
- Drop zones for drag-and-drop field assignment
- Count indicators showing number of fields in each bucket
- Option to remove fields from buckets

**Drag-and-Drop Functionality:**
- Intuitive drag fields from table to category buckets
- Multi-select and batch drag capability
- Visual feedback during drag operations
- Keyboard accessible alternatives for non-mouse users

### Section 4: Data Source Health & Monitoring

**Real-time, color-coded status indicators:**
- Green: Active and healthy connections
- Yellow: Syncing or non-critical issues
- Red: Critical connection errors needing immediate attention
- Clear troubleshooting pathways for errors, with actionable prompts

### Section 5: Audit Trails & Historical Logs

**Comprehensive tracking of data source interactions:**
- User actions (additions, edits, deletions)
- Data sync and refresh logs
- Issue detection and resolution history

## ⚙️ Interactivity & UX Considerations

- User-friendly UI enabling technical and non-technical users alike
- Immediate feedback and intuitive troubleshooting
- Minimal friction for establishing and maintaining robust data integrations
- Comprehensive visibility into data health and integrity