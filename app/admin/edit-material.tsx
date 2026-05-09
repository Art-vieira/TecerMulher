import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import MaterialFormTemplate from '../../components/MaterialFormTemplate';

export default function EditMaterialScreen() {
  const { id } = useLocalSearchParams();
  return <MaterialFormTemplate isEdit={true} id={id as string} />;
}
