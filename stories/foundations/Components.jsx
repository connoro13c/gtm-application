
import './components.css';

export const Components = () => (
  <div className="components-wrapper">
    <h2 className="components-section-title">Buttons</h2>
    <div className="components-grid">
      <div className="component-item">
        <h3>Primary Button</h3>
        <button className="btn-primary">Primary Button</button>
        <div className="component-code">
          <code>Background: #F34E3F</code>
          <code>Text: #FFFFFF</code>
          <code>Border Radius: 8px</code>
        </div>
      </div>
      
      <div className="component-item">
        <h3>Secondary Button</h3>
        <button className="btn-secondary">Secondary Button</button>
        <div className="component-code">
          <code>Background: #3737F2</code>
          <code>Text: #FFFFFF</code>
          <code>Border Radius: 8px</code>
        </div>
      </div>
      
      <div className="component-item">
        <h3>Disabled Button</h3>
        <button className="btn-primary" disabled>Disabled Button</button>
        <div className="component-code">
          <code>Opacity: 0.6</code>
          <code>Cursor: not-allowed</code>
        </div>
      </div>
    </div>
    
    <h2 className="components-section-title">Forms</h2>
    <div className="components-grid">
      <div className="component-item">
        <h3>Input Field</h3>
        <input type="text" className="input-field" placeholder="Input text" />
        <div className="component-code">
          <code>Border: 1px solid #DDDDDD</code>
          <code>Border Radius: 8px</code>
        </div>
      </div>
      
      <div className="component-item">
        <h3>Focus State</h3>
        <div className="focus-state-demo">
          <input type="text" className="input-field input-focused" placeholder="Focus state" />
        </div>
        <div className="component-code">
          <code>Border: 1px solid #F34E3F</code>
        </div>
      </div>
      
      <div className="component-item">
        <h3>Error State</h3>
        <div className="error-state-container">
          <input type="text" className="input-field input-error" placeholder="Error state" />
          <p className="error-message">Error message goes here</p>
        </div>
        <div className="component-code">
          <code>Border: 1px solid #FF7867</code>
          <code>Error Text: #FF7867</code>
        </div>
      </div>
    </div>
    
    <h2 className="components-section-title">Cards</h2>
    <div className="components-grid">
      <div className="component-item card-demo-container">
        <div className="card">
          <h3>Card Title</h3>
          <p>This is a sample card with content inside. Cards are used to group related information.</p>
          <button className="btn-primary">Action</button>
        </div>
        <div className="component-code">
          <code>Background: #FFFFFF</code>
          <code>Border Radius: 16px</code>
          <code>Shadow: 0px 5px 10px rgba(0,0,0,0.05)</code>
        </div>
      </div>
    </div>
    
    <h2 className="components-section-title">Spacing</h2>
    <div className="spacing-container">
      <div className="spacing-item">
        <div className="spacing-visual spacing-xs"></div>
        <div className="spacing-info">
          <span>X-Small</span>
          <code>8px</code>
        </div>
      </div>
      
      <div className="spacing-item">
        <div className="spacing-visual spacing-sm"></div>
        <div className="spacing-info">
          <span>Small</span>
          <code>16px</code>
        </div>
      </div>
      
      <div className="spacing-item">
        <div className="spacing-visual spacing-md"></div>
        <div className="spacing-info">
          <span>Medium</span>
          <code>24px</code>
        </div>
      </div>
      
      <div className="spacing-item">
        <div className="spacing-visual spacing-lg"></div>
        <div className="spacing-info">
          <span>Large</span>
          <code>32px</code>
        </div>
      </div>
      
      <div className="spacing-item">
        <div className="spacing-visual spacing-xl"></div>
        <div className="spacing-info">
          <span>X-Large</span>
          <code>48px</code>
        </div>
      </div>
      
      <div className="spacing-item">
        <div className="spacing-visual spacing-2xl"></div>
        <div className="spacing-info">
          <span>XX-Large</span>
          <code>64px</code>
        </div>
      </div>
    </div>
  </div>
);

export default Components;