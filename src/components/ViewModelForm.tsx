import React from 'react';
import { ViewModel } from '../types/ViewModel';

type Props = {
  value: ViewModel;
  onChange: (vm: ViewModel) => void;
};

export const ViewModelForm: React.FC<Props> = ({ value, onChange }) => {
  const handleChange = (field: keyof ViewModel, val: any) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[1,2,3,4,5].map(i => (
        <label key={i}>
          {i} color:
          <input
            type="color"
            value={value[`color${i}` as keyof ViewModel] as string}
            onChange={e => handleChange(`color${i}` as keyof ViewModel, e.target.value)}
          />
        </label>
      ))}
      <label>
        Stocking Amount:
        <input
          type="number"
          value={value.stockingAmt}
          min={0}
          max={5}
          onChange={e => handleChange('stockingAmt', Number(e.target.value))}
        />
      </label>
      {[1,2,3,4,5].map(i => (
        <label key={i}>
          Name {i}:
          <input
            type="text"
            value={value[`name${i}` as keyof ViewModel] as string}
            onChange={e => handleChange(`name${i}` as keyof ViewModel, e.target.value)}
          />
        </label>
      ))}
    </form>
  );
}; 