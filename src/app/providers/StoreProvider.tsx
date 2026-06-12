import React, { type PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';

type StoreProviderProps = PropsWithChildren;

export const StoreProvider: React.FC<StoreProviderProps> = (props) => {
  const { children } = props;

  return <Provider store={store}>{children}</Provider>;
};
