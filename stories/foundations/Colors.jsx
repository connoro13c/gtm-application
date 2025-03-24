
import './colors.css';

export const ColorPalette = () => (
  <div className="color-wrapper">
    <h2>Primary Brand Colors</h2>
    <div className="color-grid">
      <div className="color-item">
        <div className="color-preview" style={{ backgroundColor: '#F34E3F' }}></div>
        <div className="color-info">
          <span className="color-name">Primary (Vermillion-7)</span>
          <code>#F34E3F</code>
        </div>
      </div>
      <div className="color-item">
        <div className="color-preview" style={{ backgroundColor: '#3737F2' }}></div>
        <div className="color-info">
          <span className="color-name">Secondary (Blue-5)</span>
          <code>#3737F2</code>
        </div>
      </div>
      <div className="color-item">
        <div className="color-preview" style={{ backgroundColor: '#7834BB' }}></div>
        <div className="color-info">
          <span className="color-name">Accent (Violet-5)</span>
          <code>#7834BB</code>
        </div>
      </div>
      <div className="color-item">
        <div className="color-preview" style={{ backgroundColor: '#F8F8F8', border: '1px solid #DDD' }}></div>
        <div className="color-info">
          <span className="color-name">Background (Greyscale-10)</span>
          <code>#F8F8F8</code>
        </div>
      </div>
      <div className="color-item">
        <div className="color-preview" style={{ backgroundColor: '#202020' }}></div>
        <div className="color-info">
          <span className="color-name">Text (Greyscale-2)</span>
          <code>#202020</code>
        </div>
      </div>
    </div>
    
    <h2>Greyscale</h2>
    <div className="color-grid">
      {[
        { name: 'Greyscale-0', hex: '#020202' },
        { name: 'Greyscale-1', hex: '#0E0E0E' },
        { name: 'Greyscale-2', hex: '#202020' },
        { name: 'Greyscale-3', hex: '#343434' },
        { name: 'Greyscale-4', hex: '#4A4A4A' },
        { name: 'Greyscale-5', hex: '#606060' },
        { name: 'Greyscale-6', hex: '#777777' },
        { name: 'Greyscale-7', hex: '#909090' },
        { name: 'Greyscale-8', hex: '#A9A9A9' },
        { name: 'Greyscale-9', hex: '#DDDDDD' },
        { name: 'Greyscale-10', hex: '#F8F8F8', border: true },
      ].map((color) => (
        <div className="color-item" key={color.name}>
          <div 
            className="color-preview" 
            style={{ 
              backgroundColor: color.hex,
              border: color.border ? '1px solid #DDD' : 'none'
            }}
          ></div>
          <div className="color-info">
            <span className="color-name">{color.name}</span>
            <code>{color.hex}</code>
          </div>
        </div>
      ))}
    </div>
    
    <h2>Color Families</h2>
    
    <h3>Blue Palette</h3>
    <div className="color-grid">
      <div className="color-item">
        <div className="color-preview" style={{ backgroundColor: '#3737F2' }}></div>
        <div className="color-info">
          <span className="color-name">Blue-5</span>
          <code>#3737F2</code>
        </div>
      </div>
      <div className="color-item">
        <div className="color-preview" style={{ backgroundColor: '#4C53FF' }}></div>
        <div className="color-info">
          <span className="color-name">Blue-6</span>
          <code>#4C53FF</code>
        </div>
      </div>
      <div className="color-item">
        <div className="color-preview" style={{ backgroundColor: '#6D77FF' }}></div>
        <div className="color-info">
          <span className="color-name">Blue-7</span>
          <code>#6D77FF</code>
        </div>
      </div>
    </div>
    
    <h3>Violet Palette</h3>
    <div className="color-grid">
      <div className="color-item">
        <div className="color-preview" style={{ backgroundColor: '#7834BB' }}></div>
        <div className="color-info">
          <span className="color-name">Violet-5</span>
          <code>#7834BB</code>
        </div>
      </div>
      <div className="color-item">
        <div className="color-preview" style={{ backgroundColor: '#914BDC' }}></div>
        <div className="color-info">
          <span className="color-name">Violet-6</span>
          <code>#914BDC</code>
        </div>
      </div>
      <div className="color-item">
        <div className="color-preview" style={{ backgroundColor: '#A96AF3' }}></div>
        <div className="color-info">
          <span className="color-name">Violet-7</span>
          <code>#A96AF3</code>
        </div>
      </div>
    </div>
    
    <h3>Vermilion Palette</h3>
    <div className="color-grid">
      <div className="color-item">
        <div className="color-preview" style={{ backgroundColor: '#F34E3F' }}></div>
        <div className="color-info">
          <span className="color-name">Vermilion-7</span>
          <code>#F34E3F</code>
        </div>
      </div>
      <div className="color-item">
        <div className="color-preview" style={{ backgroundColor: '#FF7867' }}></div>
        <div className="color-info">
          <span className="color-name">Vermilion-8</span>
          <code>#FF7867</code>
        </div>
      </div>
      <div className="color-item">
        <div className="color-preview" style={{ backgroundColor: '#FFA293' }}></div>
        <div className="color-info">
          <span className="color-name">Vermilion-9</span>
          <code>#FFA293</code>
        </div>
      </div>
    </div>
  </div>
);

export default ColorPalette;