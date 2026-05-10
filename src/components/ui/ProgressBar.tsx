import React from 'react';
import { View, Text } from 'react-native';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export default function ProgressBar({ progress, className = "" }: ProgressBarProps) {
  return (
    <View className={className}>
      <Text className="text-primary text-[16px] font-bold mb-2">
        Progresso de leitura: {progress}%
      </Text>
      <View className="h-[6px] w-full bg-surface-muted rounded-full overflow-hidden">
        <View 
          className="h-full bg-primary rounded-full" 
          style={{ width: `${progress}%` }} 
        />
      </View>
    </View>
  );
}
