# useTrial Hook

## Overview
The `useTrial` hook manages the free trial system for the Background Remover application. It tracks the number of free trials used and implements a time-based trial period.

## Features
- **Lifetime Trial Limit**: Users get 4 free trials
- **Time-Based Reset**: Trials reset after 24 hours
- **Persistent Storage**: Usage data stored in localStorage
- **Automatic Expiration**: Trials automatically expire after 24 hours

## Usage

```typescript
import { useTrial } from '@/hooks/use-trial';

const MyComponent = () => {
  const { 
    uses,           // Number of trials used
    limit,          // Trial limit (4)
    remaining,      // Trials remaining
    isExhausted,    // Whether trials are exhausted
    increment,      // Use one trial
    reset,          // Reset trials
    isTrialExpired, // Whether trial period has expired
    trialStartTime, // When trial period started
    trialPeriodHours // Trial period in hours (24)
  } = useTrial();

  // Use a trial
  const handleUseTrial = () => {
    if (!isExhausted) {
      increment();
      // Process image...
    }
  };

  return (
    <div>
      <p>Free trials remaining: {remaining}</p>
      {isTrialExpired && <p>Trial period has expired. Resetting...</p>}
    </div>
  );
};
```

## Implementation Details

### Storage
- **Usage Count**: Stored in `localStorage` under key `bgremover_trial_uses`
- **Start Time**: Stored in `localStorage` under key `bgremover_trial_timestamp`

### Time-Based Reset
The trial system automatically resets after 24 hours:
1. When the hook initializes, it checks if the trial period has expired
2. If expired, it automatically calls `reset()` to start a new trial period
3. The expiration is calculated based on the stored start time

### Edge Cases
- **Browser Storage Unavailable**: Gracefully handles environments without localStorage
- **Invalid Data**: Safely handles corrupted or invalid stored data
- **Manual Reset**: Provides `reset()` function for manual trial reset
- **Server-Side Rendering**: Handles SSR by checking `window` object availability

## API Reference

### Return Values
| Property | Type | Description |
|----------|------|-------------|
| `uses` | `number` | Number of trials used in current period |
| `limit` | `number` | Maximum trials allowed (4) |
| `remaining` | `number` | Trials remaining in current period |
| `isExhausted` | `boolean` | Whether trials are exhausted or period expired |
| `increment` | `function` | Use one trial |
| `reset` | `function` | Reset trials and start new period |
| `isTrialExpired` | `boolean` | Whether current trial period has expired |
| `trialStartTime` | `number|null` | Timestamp when current trial period started |
| `trialPeriodHours` | `number` | Length of trial period in hours (24) |

## Example Implementation

```typescript
// Example of how to use the hook in a component
import { useTrial } from '@/hooks/use-trial';

export function ImageProcessor() {
  const { remaining, isExhausted, increment } = useTrial();
  
  const processImage = async (image: File) => {
    if (isExhausted) {
      alert('Free trials exhausted. Please upgrade to premium.');
      return;
    }
    
    try {
      // Process the image
      await processBackgroundRemoval(image);
      
      // Use one trial
      increment();
      
      console.log(`Trial used. ${remaining - 1} trials remaining.`);
    } catch (error) {
      console.error('Image processing failed:', error);
    }
  };
  
  return (
    <div>
      {/* Image processing UI */}
    </div>
  );
}
```