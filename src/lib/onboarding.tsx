/**
 * First-run onboarding state: whether the user has been through it, and the
 * "what are you carrying" categories they picked (used to choose their first
 * reading and, later, to order the home shelves). All on-device.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getItem, setItem } from './storage';
import { CategoryId } from '../content/types';

type OnboardingData = {
  onboarded: boolean;
  interests: CategoryId[];
};

const KEY = 'founded.onboarding.v1';
const DEFAULT: OnboardingData = { onboarded: false, interests: [] };

type OnboardingState = OnboardingData & {
  ready: boolean;
  complete: (interests: CategoryId[]) => void;
  reset: () => void;
};

const OnboardingContext = createContext<OnboardingState>({
  ...DEFAULT,
  ready: false,
  complete: () => {},
  reset: () => {},
});

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(DEFAULT);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      setData(await getItem<OnboardingData>(KEY, DEFAULT));
      setReady(true);
    })();
  }, []);

  const complete = useCallback((interests: CategoryId[]) => {
    const next = { onboarded: true, interests };
    setData(next);
    void setItem(KEY, next);
  }, []);

  const reset = useCallback(() => {
    setData(DEFAULT);
    void setItem(KEY, DEFAULT);
  }, []);

  const value = useMemo<OnboardingState>(
    () => ({ ...data, ready, complete, reset }),
    [data, ready, complete, reset],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  return useContext(OnboardingContext);
}
