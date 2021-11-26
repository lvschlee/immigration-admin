import { createContext, FC, useContext } from 'react';
import { QuizStore } from './store';

type RootStateContextType = {
  quizStore: QuizStore;
};

const RootStateContext = createContext<RootStateContextType>(
  {} as RootStateContextType
);

const quizStore = new QuizStore();

export const RootStateProvider: FC = ({ children }) => (
  <RootStateContext.Provider value={{ quizStore }}>
    {children}
  </RootStateContext.Provider>
);

export const useRootStore = () => useContext(RootStateContext);
