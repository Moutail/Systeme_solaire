import React from 'react';
import { useTransition, animated } from '@react-spring/web';

function Transition({ children, currentPage }) {
  const transitions = useTransition(currentPage, {
    from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
  });

  return transitions((style, item) =>
    item ? (
      <animated.div style={{ ...style, position: 'absolute', width: '100%', height: '100%' }}>
        {children}
      </animated.div>
    ) : null
  );
}

export default Transition;