import React from 'react';
import './typography.css';

export const Typography = () => (
  <div className="typography-wrapper">
    <h2 className="section-title">Typefaces</h2>
    <div className="typeface-grid">
      <div className="typeface-item">
        <h3>Logo</h3>
        <p className="font-eastman">Eastman</p>
        <div className="font-sample font-eastman">AaBbCcDdEeFfGg 0123456789</div>
      </div>
      
      <div className="typeface-item">
        <h3>Headlines</h3>
        <p>PolySans (Bulky, Regular, Slim variants)</p>
        <div className="font-sample font-polysans-bulky">AaBbCcDdEeFfGg</div>
        <div className="font-sample font-polysans">AaBbCcDdEeFfGg</div>
        <div className="font-sample font-polysans-slim">AaBbCcDdEeFfGg</div>
      </div>
      
      <div className="typeface-item">
        <h3>Body</h3>
        <p>PolySans Mono</p>
        <div className="font-sample font-polysans-mono">AaBbCcDdEeFfGg 0123456789</div>
      </div>
      
      <div className="typeface-item">
        <h3>Alternative</h3>
        <p>Inter</p>
        <div className="font-sample font-inter">AaBbCcDdEeFfGg 0123456789</div>
      </div>
    </div>
    
    <h2 className="section-title">Typography Scale</h2>
    <div className="scale-container">
      <div className="scale-item">
        <div className="scale-info">
          <span className="scale-name">H1</span>
          <span className="scale-size">48px</span>
        </div>
        <h1 className="scale-example">The quick brown fox jumps over the lazy dog</h1>
      </div>
      
      <div className="scale-item">
        <div className="scale-info">
          <span className="scale-name">H1 (Alternative)</span>
          <span className="scale-size">32px</span>
        </div>
        <h1 className="scale-example scale-example-alt">The quick brown fox jumps over the lazy dog</h1>
      </div>
      
      <div className="scale-item">
        <div className="scale-info">
          <span className="scale-name">H2</span>
          <span className="scale-size">36px</span>
        </div>
        <h2 className="scale-example scale-h2">The quick brown fox jumps over the lazy dog</h2>
      </div>
      
      <div className="scale-item">
        <div className="scale-info">
          <span className="scale-name">H2 (Alternative)</span>
          <span className="scale-size">24px</span>
        </div>
        <h2 className="scale-example scale-h2-alt">The quick brown fox jumps over the lazy dog</h2>
      </div>
      
      <div className="scale-item">
        <div className="scale-info">
          <span className="scale-name">H3</span>
          <span className="scale-size">24px</span>
        </div>
        <h3 className="scale-example scale-h3">The quick brown fox jumps over the lazy dog</h3>
      </div>
      
      <div className="scale-item">
        <div className="scale-info">
          <span className="scale-name">H3 (Alternative)</span>
          <span className="scale-size">20px</span>
        </div>
        <h3 className="scale-example scale-h3-alt">The quick brown fox jumps over the lazy dog</h3>
      </div>
      
      <div className="scale-item">
        <div className="scale-info">
          <span className="scale-name">Body</span>
          <span className="scale-size">16px</span>
        </div>
        <p className="scale-example scale-body">The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
      
      <div className="scale-item">
        <div className="scale-info">
          <span className="scale-name">Small</span>
          <span className="scale-size">14px</span>
        </div>
        <p className="scale-example scale-small">The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
    </div>
    
    <h2 className="section-title">Text Colors</h2>
    
    <h3>Light Background Colors</h3>
    <div className="text-colors-grid">
      <div className="text-color-item">
        <p className="text-color-sample" style={{ color: '#7834BB' }}>Primary Text (Violet-05)</p>
        <code>#7834BB</code>
      </div>
      <div className="text-color-item">
        <p className="text-color-sample" style={{ color: '#F34E3F' }}>Secondary Text (Vermilion-05)</p>
        <code>#F34E3F</code>
      </div>
      <div className="text-color-item">
        <p className="text-color-sample" style={{ color: '#3737F2' }}>Accent Text (Blue-05)</p>
        <code>#3737F2</code>
      </div>
    </div>
    
    <h3>Dark Background Colors</h3>
    <div className="text-colors-grid dark-bg">
      <div className="text-color-item">
        <p className="text-color-sample" style={{ color: '#A96AF3' }}>Primary Text (Violet-07)</p>
        <code>#A96AF3</code>
      </div>
      <div className="text-color-item">
        <p className="text-color-sample" style={{ color: '#FF7867' }}>Secondary Text (Vermilion-08)</p>
        <code>#FF7867</code>
      </div>
      <div className="text-color-item">
        <p className="text-color-sample" style={{ color: '#6D77FF' }}>Accent Text (Blue-07)</p>
        <code>#6D77FF</code>
      </div>
    </div>
  </div>
);

export default Typography;