import React, { useState, useEffect, useRef } from 'react';
import { ViewModel } from './types/ViewModel';
import { ViewModelForm } from './components/ViewModelForm';
import { 
  useRive, 
  useViewModel, 
  useViewModelInstance, 
  useViewModelInstanceString, 
  useViewModelInstanceColor,
  useViewModelInstanceNumber
} from '@rive-app/react-webgl2';

const initialVM: ViewModel = {
  color1: '#ff0000',
  color2: '#00ff00',
  color3: '#0000ff',
  color4: '#ffff00',
  color5: '#00ffff',
  stockingAmt: 3,
  name1: 'Justin',
  name2: 'Kelsey',
  name3: 'Mia',
  name4: 'Milo',
  name5: 'Ilo',
};

const STATE_MACHINE_NAME = 'State Machine 1';
const VIEW_MODEL_NAME = 'View Model 1';

function App() {
  const [vm, setVM] = useState<ViewModel>(initialVM);
  const initialSyncDone = useRef(false);

  const { rive, RiveComponent } = useRive({
    src: '/christmas_card.riv',
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
    autoBind: true,
  });

  const defaultViewModelExplicit = useViewModel(rive, { useDefault: true }); 
  const vmInstance = useViewModelInstance(defaultViewModelExplicit, { rive });

  let colorInputs: { value: number, setRgb: (r: number, g: number, b: number) => void }[] = [];
  let nameInputs: { value: string, setValue: (value: string) => void }[] = [];
  let stockingAmtInput: { value: number, setValue: (value: number) => void } = { value: 0, setValue: () => {} };

  const { value: color1, setRgb: setColor1 } = useViewModelInstanceColor('1 color', vmInstance);
  const { value: color2, setRgb: setColor2 } = useViewModelInstanceColor('2 color', vmInstance);
  const { value: color3, setRgb: setColor3 } = useViewModelInstanceColor('3 color', vmInstance);
  const { value: color4, setRgb: setColor4 } = useViewModelInstanceColor('4 color', vmInstance);
  const { value: color5, setRgb: setColor5 } = useViewModelInstanceColor('5 color', vmInstance);
  colorInputs = [
    { value: color1 || 0, setRgb: setColor1 },
    { value: color2 || 0, setRgb: setColor2 },
    { value: color3 || 0, setRgb: setColor3 },
    { value: color4 || 0, setRgb: setColor4 },
    { value: color5 || 0, setRgb: setColor5 },
  ];

  const { value: stockingAmt, setValue: setStockingAmt } = useViewModelInstanceNumber('stocking amt', vmInstance);
  stockingAmtInput = { value: stockingAmt || 0, setValue: setStockingAmt };

  const { value: name1, setValue: setName1 } = useViewModelInstanceString('Name 1', vmInstance);
  const { value: name2, setValue: setName2 } = useViewModelInstanceString('Name 2', vmInstance);
  const { value: name3, setValue: setName3 } = useViewModelInstanceString('Name 3', vmInstance);
  const { value: name4, setValue: setName4 } = useViewModelInstanceString('Name 4', vmInstance);
  const { value: name5, setValue: setName5 } = useViewModelInstanceString('Name 5', vmInstance);
  nameInputs = [
    { value: name1 || '', setValue: setName1 },
    { value: name2 || '', setValue: setName2 },
    { value: name3 || '', setValue: setName3 },
    { value: name4 || '', setValue: setName4 },
    { value: name5 || '', setValue: setName5 },
  ];

  const handleVMChange = (newVM: ViewModel) => {
    console.log('handleVMChange', newVM);
    setVM(newVM);
    
    colorInputs?.forEach((input, i) => {
      if (input) {
        console.log(newVM[`color${i + 1}`]);
        const rgb = hexToRgb(newVM[`color${i + 1}`]);
        if (rgb) {
          input.setRgb(rgb.r, rgb.g, rgb.b);
        }
        console.log(input.value);
      }
    });
  
    nameInputs?.forEach((input, i) => {
      if (input) {
        console.log(newVM[`name${i + 1}`]);
        input.setValue(newVM[`name${i + 1}`]);
        console.log(input.value);
      }
    });
  
    if (stockingAmtInput) {
      stockingAmtInput.setValue(newVM.stockingAmt);
      console.log(stockingAmtInput.value);
    }

  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
    
  useEffect(() => {
    if (rive) {
      console.log('Rive loaded');
      if (vmInstance && !initialSyncDone.current) {
        handleVMChange(vm);
        initialSyncDone.current = true;
      }
      rive.resizeDrawingSurfaceToCanvas();
    }
  }, [rive, vmInstance]);

  
  return (
    <div style={{ display: 'flex', gap: 32, padding: 32 }}>
      <RiveComponent style={{ width: 400, height: 400, display: 'block' }} />
      <ViewModelForm value={vm} onChange={handleVMChange} />
    </div>
  );
}

export default App;

