import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../render/renderWithProviders';
import { QuantitySelectorActionBinder } from '../../features/productDetails/components/QuantitySelector';

describe('QuantitySelector', () => {
  it('does not increment above max', () => {
    const onChange = jest.fn();
    const { getByText } = renderWithProviders(<QuantitySelectorActionBinder quantity={1} max={1} onChange={onChange} />);

    const inc = getByText('+');
    fireEvent.press(inc);

    expect(onChange).not.toHaveBeenCalled();
  });
});
