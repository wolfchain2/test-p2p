
import React from 'react';
import { Stat } from '../types';

// The useAnimatedCounter hook is kept if needed for other Stat types, but not used when valueString is present.
// const useAnimatedCounter = (targetValue: number, duration: number = 1500, initialValue: number = 0) => { ... };

const StatCard: React.FC<{ stat: Stat }> = ({ stat }) => {
  // const animatedValue = useAnimatedCounter(stat.targetValue, 2000, stat.initialValue);

  return (
    <div className="bg-teal-50 p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform duration-300">
      {stat.labelTop && (
        <div className="text-sm font-medium text-teal-600 mb-1 uppercase tracking-wider">{stat.labelTop}</div>
      )}
      <div className="text-4xl font-bold text-gray-800 my-2">
        {stat.valueString ? stat.valueString : (
          <>
            {/* Fallback to animated counter if valueString is not provided and targetValue is */}
            {/* For now, assuming valueString will be provided for HomePage stats */}
            {/* stat.isCurrency && '$'}{animatedValue.toLocaleString('es-ES') */}
            Needs configuration if animation is desired
          </>
        )}
      </div>
      <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
    </div>
  );
};

export default StatCard;