import { useSearchParams } from 'react-router-dom';
import MitreNavigator from '@/components/dashboard/MitreNavigator/MitreNavigator';
import { Alert } from '@/components/dashboard/types';

const Navigator = () => {
  const [searchParams] = useSearchParams();
  const eventsParam = searchParams.get('events');
  const events: Alert[] = eventsParam ? JSON.parse(decodeURIComponent(eventsParam)) : [];

  return <MitreNavigator events={events} />;
};

export default Navigator;