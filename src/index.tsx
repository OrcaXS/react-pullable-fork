import { useCallback, useEffect, useState } from 'react';
import { styled } from '@linaria/react';

const Container = styled.div<{
  actualHeight: number;
  centerSpinner: boolean;
  shouldReset: boolean;
  resetDuration: number;
  resetEase: string;
}>`
  height: ${(p) => p.actualHeight}px;
  align-items: ${(p) => (p.centerSpinner ? 'center' : 'flex-start')};
  transition: ${(p) =>
    p.shouldReset ? `height ${p.resetDuration}ms ${p.resetEase}` : 'none'};
  display: flex;
  overflow: hidden;
  justify-content: center;
  pointer-events: none;
`;

const Spinner = styled.div<{
  fadeSpinner: boolean;
  pctPulled: number;
  spinnerSize: number;
  spinnerOffset: number;
  rotateSpinner: boolean;
  shouldReset: boolean;
  shouldSpin: boolean;
  resetDuration: number;
  resetEase: string;
}>`
  opacity: ${(p) => (p.fadeSpinner ? p.pctPulled : 1)};
  transform: ${(p) =>
    p.shouldReset
      ? `translateY(${
          p.pctPulled * (p.spinnerSize + p.spinnerOffset) - p.spinnerSize
        }px) rotate(${p.rotateSpinner && p.shouldSpin ? 90 : 0}deg)`
      : `translateY(${
          p.pctPulled * (p.spinnerSize + p.spinnerOffset) - p.spinnerSize
        }px) rotate(${p.rotateSpinner ? p.pctPulled * 90 : 0}deg)`};
  transition: ${(p) =>
    p.shouldReset
      ? `opacity ${p.resetDuration}ms ${p.resetEase}, transform ${p.resetDuration}ms ${p.resetEase}`
      : 'none'};
  transform-origin: center;
`;

const SpinnerSVG = styled.svg<{
  spinnerSize: number;
  spinnerColor: string;
  shouldSpin: boolean;
  popDuration: number;
  spinSpeed: number;
}>`
  width: ${(p) => p.spinnerSize}px;
  height: ${(p) => p.spinnerSize}px;
  stroke: ${(p) => p.spinnerColor};
  animation: ${(p) =>
    p.shouldSpin
      ? `scale ${p.popDuration}ms cubic-bezier(0.55, 0.055, 0.675, 0.19), rotate360 ${p.spinSpeed}ms linear ${p.popDuration}ms infinite`
      : 'none'};

  @keyframes scale {
    0% {
      transform: scale(1.3);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes rotate360 {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  } ;
`;

export type PullableProperties = {
  children?: JSX.Element | null;
  onRefresh?: () => void;
  className?: string;
  centerSpinner?: boolean;
  fadeSpinner?: boolean;
  rotateSpinner?: boolean;
  spinnerSize?: number;
  spinnerOffset?: number;
  spinnerColor?: string;
  spinSpeed?: number;
  popDuration?: number;
  distThreshold?: number;
  resistance?: number;
  refreshDuration?: number;
  resetDuration?: number;
  resetEase?: string;
  shouldPullToRefresh?: () => boolean;
  disabled?: boolean;
};

type Status =
  | 'ready'
  | 'pulling'
  | 'pullAborted'
  | 'refreshing'
  | 'refreshCompleted';

const Pullable = ({
  className,
  children,
  onRefresh,
  centerSpinner = true,
  fadeSpinner = true,
  rotateSpinner = true,
  spinnerSize = 24,
  spinnerOffset = 0,
  spinnerColor = '#000000',
  spinSpeed = 1200,
  popDuration = 200,
  distThreshold = 72,
  resistance = 2.5,
  refreshDuration = 1000,
  resetDuration = 400,
  resetEase = 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  shouldPullToRefresh = () => window.scrollY <= 0,
  disabled = false,
}: PullableProperties) => {
  const [status, setStatus] = useState<Status>('ready');
  const [height, setHeight] = useState(0);

  const [pullStartY, setPullStartY] = useState<number | undefined>();
  const [dist, setDist] = useState(0);
  const [distResisted, setDistResisted] = useState(0);
  const [ignoreTouches, setIgnoreTouches] = useState(false);

  let resetTimeout: number;
  let refreshCompletedTimeout: number;

  const reset = (delay = 0) => {
    resetTimeout = window.setTimeout(() => {
      setPullStartY(undefined);
      setDist(0);
      setDistResisted(0);
      setIgnoreTouches(false);
      setStatus('ready');
    }, delay);
  };

  const refresh = () => {
    setIgnoreTouches(true);
    setStatus('refreshing');
    onRefresh?.();

    refreshCompletedTimeout = window.setTimeout(() => {
      setStatus('refreshCompleted');
      setHeight(0);
      reset(resetDuration);
    }, refreshDuration);
  };

  const onTouchStart = useCallback(
    (touchEvent: TouchEvent) => {
      if (disabled || ignoreTouches) return;

      if (status === 'ready' && shouldPullToRefresh()) {
        setPullStartY(touchEvent.touches[0].screenY);
      } else {
        setPullStartY(undefined);
      }
    },
    [disabled, ignoreTouches, shouldPullToRefresh, status],
  );

  const onTouchMove = useCallback(
    (touchEvent: TouchEvent) => {
      if (disabled || ignoreTouches || pullStartY === undefined) return;

      const movedY = touchEvent.touches[0].screenY;
      // setPullMoveY(movedY);
      setDist(movedY - pullStartY);

      if (dist > 0) {
        touchEvent.preventDefault();

        const minDist = Math.min(dist / resistance, distThreshold);

        setDistResisted(distResisted);
        setStatus('pulling');
        setHeight(minDist);

        if (minDist === distThreshold) {
          refresh();
        }
      }
    },
    [
      disabled,
      dist,
      distResisted,
      distThreshold,
      ignoreTouches,
      pullStartY,
      refresh,
      resistance,
    ],
  );

  const onTouchEnd = useCallback(() => {
    if (disabled || ignoreTouches) return;

    if (status === 'pulling') {
      setIgnoreTouches(true);
      setStatus('pullAborted');
      setHeight(0);
      reset(resetDuration);
    } else {
      reset();
    }
  }, [disabled, ignoreTouches, reset, resetDuration, status]);

  useEffect(() => {
    window.addEventListener('touchstart', onTouchStart);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
    };
  }, [onTouchStart]);

  useEffect(() => {
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [onTouchMove]);

  useEffect(() => {
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [onTouchEnd]);

  useEffect(() => {
    return () => {
      window.clearTimeout(refreshCompletedTimeout);
      window.clearTimeout(resetTimeout);
    };
  }, []);

  const shouldSpin = status === 'refreshing' || status === 'refreshCompleted';
  const shouldReset = status === 'pullAborted' || status === 'refreshCompleted';
  const pctPulled = height / distThreshold;

  return (
    <>
      <Container
        className={className}
        actualHeight={height}
        centerSpinner={centerSpinner}
        resetDuration={resetDuration}
        resetEase={resetEase}
        shouldReset={shouldReset}
      >
        <Spinner
          pctPulled={pctPulled}
          fadeSpinner={fadeSpinner}
          rotateSpinner={rotateSpinner}
          spinnerSize={spinnerSize}
          spinnerOffset={spinnerOffset}
          resetDuration={resetDuration}
          resetEase={resetEase}
          shouldReset={shouldReset}
          shouldSpin={shouldSpin}
        >
          <SpinnerSVG
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            spinnerSize={spinnerSize}
            spinnerColor={spinnerColor}
            popDuration={popDuration}
            spinSpeed={spinSpeed}
            shouldSpin={shouldSpin}
          >
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
          </SpinnerSVG>
        </Spinner>
      </Container>
      {children}
    </>
  );
};

export { Pullable };
