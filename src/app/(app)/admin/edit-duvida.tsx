import { useLocalSearchParams } from 'expo-router';
import DuvidaFormTemplate from '../../../components/forms/DuvidaFormTemplate';

export default function EditDuvidaScreen() {
  const { id } = useLocalSearchParams();
  return <DuvidaFormTemplate duvidaId={id} />;
}
