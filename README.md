# CHL Xmas Card 2025

This project is an interactive holiday card built with React and Vite, featuring advanced vector animations powered by Rive and rendered using WebGL2 for superior visual quality. The card responds to user input, updating animations in real time with smooth, feathered vector graphics. The architecture leverages a ViewModel pattern for robust data binding between React state and Rive animation properties, ensuring a seamless and responsive user experience.

## Features
- Interactive Rive animations with real-time user input
- WebGL2 rendering for advanced vector feathering and performance
- ViewModel-based data binding for clean state management
- Responsive design and smooth visual effects

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) to view the card in your browser.

## Development Notes
- Animations are authored in Rive and exported as `.riv` files.
- The project uses `@rive-app/react-webgl2` for rendering.
- State synchronization between React and Rive is handled via a ViewModel pattern.

# Building Interactive Animations with Rive and React WebGL2

Creating responsive animations that update based on user input requires careful consideration of rendering technology, data architecture, and performance optimization. Here's what you need to know when building interactive Rive animations with React.

## Use WebGL2 for Feathering Vectors

Choose `@rive-app/react-webgl2` over the standard `rive-react` package for superior visual quality and performance. WebGL2 provides three critical advantages:

**Vector Feathering Support**: The WebGL2 renderer delivers advanced vector feathering capabilities that create smoother, more professional-looking animations. This hardware-accelerated anti-aliasing is particularly noticeable on curved edges and fine details.

**Performance Benefits**: GPU acceleration results in smoother animations and better performance when handling complex vector graphics and multiple animated elements. The rendering pipeline offloads work from the CPU, maintaining consistent frame rates.

**Enhanced Visual Quality**: Superior anti-aliasing and visual effects create polished final output. The difference becomes apparent in text rendering, gradient transitions, and edge smoothness compared to standard canvas rendering.

Import the WebGL2 renderer instead of the standard package:

```typescript
import { 
  useRive, 
  useViewModel, 
  useViewModelInstance, 
  useViewModelInstanceString, 
  useViewModelInstanceColor,
  useViewModelInstanceNumber
} from '@rive-app/react-webgl2';
```

## ViewModel and Data Binding

Implement a ViewModel pattern to manage bidirectional data flow between React state and Rive animation properties. This creates a responsive system where user interface changes immediately reflect in the animation.

### Structure Your ViewModel

Define a centralized state structure that matches your animation's exposed properties:

```typescript
interface ViewModel {
  colorProperty: string;    // Hex color values
  textProperty: string;     // String values for text elements
  numericProperty: number;  // Numeric controls for quantities or positions
}
```

### Hook-Based Property Binding

Use Rive's specialized hooks for different data types to establish the connection between React state and animation properties:

```typescript
const { rive, RiveComponent } = useRive({
  src: '/animation.riv',
  stateMachines: 'StateMachineName',
  autoplay: true,
});

const defaultViewModel = useViewModel(rive, { useDefault: true }); 
const vmInstance = useViewModelInstance(defaultViewModel, { rive });

// Bind to different property types
const { value: colorValue, setRgb: setColor } = useViewModelInstanceColor('colorProperty', vmInstance);
const { value: textValue, setValue: setText } = useViewModelInstanceString('textProperty', vmInstance);
const { value: numericValue, setValue: setNumber } = useViewModelInstanceNumber('numericProperty', vmInstance);
```

### Handle Color Conversion

Bridge the gap between user-friendly hex color inputs and Rive's RGB requirements with a conversion utility:

```typescript
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const handleViewModelChange = (newViewModel: ViewModel) => {
  setViewModel(newViewModel);
  
  // Update color properties
  const rgb = hexToRgb(newViewModel.colorProperty);
  if (rgb) {
    setColor(rgb.r, rgb.g, rgb.b);
  }
  
  // Update other properties
  setText(newViewModel.textProperty);
  setNumber(newViewModel.numericProperty);
};
```

### Establish Data Flow

Create a unidirectional data flow where React state serves as the single source of truth:

1. User input updates React state
2. State changes trigger ViewModel synchronization
3. Rive properties update via hook setters
4. Animation responds to new property values

```typescript
const [viewModel, setViewModel] = useState<ViewModel>(initialValues);

// Form changes flow through centralized handler
const handleFormChange = (updatedViewModel: ViewModel) => {
  handleViewModelChange(updatedViewModel);
};
```

## Additional Learnings

### Browser Compatibility

WebGL2 requires modern browser support. Ensure compatibility with your target audience:

- Chrome 56+
- Firefox 51+  
- Safari 15+
- Edge 79+

For broader compatibility, maintain the ability to fallback to standard `rive-react`, though this sacrifices the enhanced visual features.

### Timing Considerations

Implement proper synchronization timing to avoid initialization errors. Rive requires time to fully load before accepting property updates:

```typescript
useEffect(() => {
  if (rive && vmInstance && !initialSyncDone.current) {
    setTimeout(() => {
      handleViewModelChange(initialViewModel);
      initialSyncDone.current = true;
    }, 100);
  }
}, [rive, vmInstance]);
```

Use a ref to track initialization state and prevent multiple sync attempts. The 100ms delay ensures Rive completes its loading process before property binding begins.

### Performance Optimization

Optimize for responsive interactions by considering update frequency and computational cost:

**Selective Property Updates**: Only update properties that have actually changed rather than re-syncing the entire ViewModel on every interaction.

**Canvas Resizing**: Call `rive.resizeDrawingSurfaceToCanvas()` when the Rive instance loads to ensure proper canvas dimensions and prevent scaling issues.

The combination of WebGL2 rendering, structured data binding, and performance-conscious implementation creates smooth, responsive interactive animations that provide immediate visual feedback to user interactions.
