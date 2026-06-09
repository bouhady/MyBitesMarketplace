import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { QuantitySelector } from '../../src/features/productDetails/components/QuantitySelector';
import { renderWithProviders } from '../../src/test/render/renderWithProviders';

describe('QuantitySelector', () => {
  it('does not increment above stock boundary', () => {
    const onChange = jest.fn();
    const screen = renderWithProviders(<QuantitySelector quantity={2} max={2} onChange={onChange} />);

    fireEvent.press(screen.getByText('+'));

    expect(onChange).not.toHaveBeenCalled();
  });
});
