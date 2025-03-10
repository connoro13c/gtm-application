# GTM Application

A comprehensive Go-to-Market (GTM) application for managing accounts, scenarios, segmentation, and insights.

## Project Structure

The project is organized into two main parts:

- **Frontend**: React application with shadcn/ui components and Tailwind CSS
- **Backend**: Express.js API with PostgreSQL database using Prisma ORM

### Directory Structure

```
gtm-application/
├── src/                   # Frontend React application
├── backend/               # Backend Express API
│   ├── src/
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API route handlers
│   │   └── server.js      # Main server entry point
│   └── package.json       # Backend dependencies
├── prisma/                # Prisma schema and migrations
│   └── schema.prisma      # Database schema definition
├── public/                # Static assets
├── package.json           # Frontend dependencies
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd gtm-application
   ```

2. Install frontend dependencies
   ```
   npm install
   ```

3. Install backend dependencies
   ```
   cd backend
   npm install
   cd ..
   ```

4. Set up the database
   ```
   # Make sure PostgreSQL is running
   # Create a database named 'gtm_app'
   
   # Generate Prisma client
   npx prisma generate
   
   # Create database tables
   npx prisma db push
   ```

5. Start the development servers

   In one terminal (for backend):
   ```
   cd backend
   npm run dev
   ```

   In another terminal (for frontend):
   ```
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Features

- **Account Management**: Track and manage customer/prospect accounts
- **Segmentation**: Segment accounts based on various criteria
- **Scenario Planning**: Create and run GTM scenarios
- **Insights Dashboard**: Visualize key metrics and predictions
- **User Authentication**: Secure login and role-based access control

## Tech Stack

- **Frontend**:
  - React
  - shadcn/ui component library
  - Tailwind CSS
  - Vite

- **Backend**:
  - Express.js
  - Prisma ORM
  - PostgreSQL
  - JWT Authentication

## License

[MIT License](LICENSE)

# GTM Application Project Guide

## Documentation References

All project documentation is stored in the `/project_documentation` directory:

- **Project Structure**: [Project_Structure_Overview.md](/project_documentation/Project_Structure_Overview.md)
- **Style Guide**: [Style_Guide.md](/project_documentation/Style_Guide.md)
- **Requirements**: [PRD.md](/project_documentation/PRD.md)
- **Component Hierarchy**: [Component_Hierarchy.md](/project_documentation/Component_Hierarchy.md)
- **API Documentation**: [API_Documentation.md](/project_documentation/API_Documentation.md)
- **Testing Strategy**: [Testing_Strategy.md](/project_documentation/Testing_Strategy.md)
- **UI/UX Wireframes**: [UX_UI_Wireframes.md](/project_documentation/UX_UI_Wireframes.md)
- **Dashboard Wireframe**: [Dashboard_Wireframe.md](/project_documentation/Dashboard_Wireframe.md)
- **Scenario Management Wireframe**: [Scenario_Management_Wireframe.md](/project_documentation/Scenario_Management_Wireframe.md)
- **Scenario Modeling Wireframe**: [Scenario_Modeling_Wireframe.md](/project_documentation/Scenario_Modeling_Wireframe.md)
- **Data Sources Wireframe**: [Data_Sources_Wireframe.md](/project_documentation/Data_Sources_Wireframe.md)
- **Account Segmentation Wireframe**: [Account_Segmentation_Wireframe.md](/project_documentation/Account_Segmentation_Wireframe.md)
- **Account & Territory Wireframe**: [Account_Territory_Wireframe.md](/project_documentation/Account_Territory_Wireframe.md)
- **Predictive Insights Wireframe**: [Predictive_Insights_Wireframe.md](/project_documentation/Predictive_Insights_Wireframe.md)
- **User Input Wireframe**: [User_Input_Wireframe.md](/project_documentation/User_Input_Wireframe.md)
- **Data Validation Wireframe**: [Data_Validation_Wireframe.md](/project_documentation/Data_Validation_Wireframe.md)
- **Glossary**: [Glossary.md](/project_documentation/Glossary.md)
- **Environment Variables**: [Environment_Variables.md](/project_documentation/Environment_Variables.md)
- **State Management**: [Integration_State_Management.md](/project_documentation/Integration_State_Management.md)
- **Technical Reference**: [Technical_Reference.md](/project_documentation/Technical_Reference.md)

## Common Commands

```bash
# Build
npm run build         # Frontend build
npm run build         # Backend build

# Test
npm run test          # Run tests
npm run test:watch    # Run tests in watch mode

# Lint
npm run lint          # Run lint checks
npm run lint:fix      # Auto-fix lint issues
```

## Tech Stack

### Frontend
- React
- Tailwind CSS
- shadcn/ui components
- Framer Motion (animations)
- Zustand (state management)
- Recharts (data visualization)

### Backend
- Node.js with Express.js
- PostgreSQL
- Prisma ORM
- Auth0/JWT authentication
- Python ML models (scikit-learn, RandomForest, XGBoost)

## Code Conventions

- Use functional components with hooks
- Component files organized by feature/page
- Follow single-responsibility principle
- Naming conventions:
  - Components: PascalCase (e.g., UserList)
  - Utilities: camelCase (e.g., fetchUserData)
- Document complex logic with inline comments
- Use Tailwind CSS for styling

## LLM Interaction Guidelines

This section provides specific instructions for Claude and other LLMs when working on this project to ensure optimal results.

### General Rules

- Do not apologize
- Do not thank me
- Talk to me like a human
- Verify information before making changes
- Preserve existing code structures
- Provide concise and relevant responses
- Verify all information before making changes
- First, think deeply about the best way to do this, inside <thinking> tags, and then respond with your answer
- When you create a new file, make sure to add a comment at the top of the file with the changes you made
- When you update/make changes to a file, make sure to rewrite the comment at the top of the file with the changes you made. If there is no comment, then add one

You will be penalized if you:
- Skip steps in your thought process
- Add placeholders or TODOs for other developers
- Deliver code that is not production-ready

Always strive for an optimal, elegant, minimal world-class solution that meets all specifications. Your code changes should be specific and complete. Think through the problem step-by-step.

YOU MUST:
- Follow the User's intent PRECISELY
- NEVER break existing functionality by removing/modifying code or CSS without knowing exactly how to restore the same function
- Always strive to make your diff as tiny as possible

### File-by-file Changes

- Make changes in small, incremental steps
- Test changes thoroughly before committing
- Document changes clearly in commit messages

### Code Style and Formatting

- Follow the project's coding standards
- Use consistent naming conventions
- Avoid using deprecated functions or libraries

### Debugging and Testing

- Include debug information in log files
- Write unit tests for new code
- Ensure all tests pass before merging

### Project Structure

- Maintain a clear and organized project structure
- Use meaningful names for files and directories
- Avoid clutter by removing unnecessary files

### Clean Code Principles

#### Don't Repeat Yourself (DRY)
- Create functions and classes to ensure logic is written in only one place
- Every piece of knowledge must have a single, unambiguous, authoritative representation

#### Curly's Law - Do One Thing
- A entity (class, function, variable) should mean one thing, and one thing only
- It should not carry different values in different contexts

#### Keep It Simple Stupid (KISS)
- Simplicity should be a key goal in design
- Unnecessary complexity should be avoided
- Simple code is quicker to write, has fewer bugs, and is easier to understand

#### Don't Make Me Think
- Code should be easy to read and understand without much thinking
- If it requires significant mental effort to understand, simplify it

#### You Aren't Gonna Need It (YAGNI)
- Implement things only when you actually need them
- Avoid overengineering based on anticipated future needs

#### Avoid Premature Optimization
- Focus on writing clear, functional code first
- Optimize only after profiling identifies genuine bottlenecks

#### Boy-Scout Rule
- Always leave the code in a better state than you found it
- Make opportunistic refactoring to improve code quality

#### Code for the Maintainer
- Write code as if the future maintainer is someone else
- Prioritize readability and maintainability over cleverness

#### Principle of Least Astonishment
- Code should behave in a way that users expect
- Avoid surprising side effects and behaviors

## LLM Integration Best Practices

This section outlines best practices for working with LLMs (Large Language Models) in this codebase to ensure efficiency, consistency, and optimal results.

### Prompt Engineering Guidelines

#### 1. Be Specific and Concise
- Clearly state the task, context, and expected output format
- For complex tasks, break them down into smaller, focused prompts
- Example: "Create a React component for displaying account scores with the following props: score, trend, lastUpdated"

#### 2. Provide Context
- Include relevant code snippets when asking about specific functionality
- Reference existing patterns in the codebase
- Example: "Here's how we've implemented other form components: [code]. Please create a similar form for the account segmentation feature."

#### 3. Specify Format Requirements
- Be explicit about code style, patterns, and formatting expectations
- Example: "Follow the project's functional component pattern with hook usage as shown in our other components."

#### 4. Technical Implementation Patterns

When requesting new code:
- Begin with a specific description of the component/feature's purpose
- List required props/parameters with types
- Mention any existing components to reference or extend
- Specify state management approach (Zustand, React hooks)
- Include error handling expectations

Example prompt structure:
```
Create a [Component Name] that [purpose].

Props:
- prop1 (type): description
- prop2 (type): description

This should use our existing [pattern/component] as a reference.
Handle errors by [specific approach].
Use the Zustand [specific store] for state management.
```

### LLM Integration Points

#### 1. Code Generation
- Component skeletons and boilerplate
- Test cases based on requirements
- Data transformation utilities
- API integration helpers

#### 2. Code Refactoring
- Identifying repetitive patterns
- Suggesting performance optimizations
- Converting class components to functional components

#### 3. Documentation Assistance
- JSDoc comment generation
- README updates
- API documentation maintenance

#### 4. Learning & Knowledge Transfer
- Explaining complex patterns in the codebase
- Providing implementation alternatives with pros/cons
- Identifying best practices for specific use cases

### Best Practices for LLM-Generated Code

1. **Review all generated code** before integration
2. **Test thoroughly** using the project's testing framework 
3. **Ensure adherence** to the project's code style and conventions
4. **Verify edge cases** are properly handled
5. **Check for security issues** like improper input validation
6. **Run linting and type checking** on generated code

### LLM-Assisted Development Workflow

1. Define clear requirements based on PRD/wireframes
2. Create an LLM prompt following the guidelines above
3. Review and refine the generated solution
4. Test and validate the implementation
5. Integrate with proper error handling and edge case coverage
6. Document any LLM-inspired patterns for team reference

By following these guidelines, we can leverage LLMs to accelerate development while maintaining code quality and consistency.
