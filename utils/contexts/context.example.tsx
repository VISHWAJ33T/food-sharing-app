import { createContext, useContext } from 'react';

export const ExampleContext = createContext<ReturnType<typeof useExampleInit>>(
  null as unknown as ReturnType<typeof useExampleInit>,
);

export const useExampleContext = () => {
  return useContext(ExampleContext);
};

// Provider component
export const ExampleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const example = useExampleInit();

  return (
    <ExampleContext.Provider value={example}>
      {children}
    </ExampleContext.Provider>
  );
};

const useExampleInit = () => {};
